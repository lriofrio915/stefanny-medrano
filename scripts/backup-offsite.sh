#!/usr/bin/env bash
#
# Cifra un dump de la base y lo sube a Supabase Storage (bucket privado
# "db-backups"), para tener una copia fuera del VPS.
#
# Uso: backup-offsite.sh /ruta/al/sara_backup_XXXX.sql.gz
# Lo llama scripts/backup-db.sh al terminar; también se puede lanzar a mano.
#
# El fichero sale del VPS cifrado con GPG simétrico (AES256). La frase de paso
# está en /root/.sara-backup-passphrase, modo 600. Sin ella el backup NO se
# puede restaurar: guárdala también en el gestor de contraseñas.
#
# Restaurar:
#   gpg --batch --passphrase-file /root/.sara-backup-passphrase \
#       --decrypt fichero.sql.gz.gpg > fichero.sql.gz
#   npm run db:restore fichero.sql.gz

set -eo pipefail

DUMP="${1:-}"
if [ -z "$DUMP" ] || [ ! -f "$DUMP" ]; then
  echo "uso: $(basename "$0") <fichero.sql.gz>" >&2
  exit 2
fi

ENV_FILE="$(cd "$(dirname "$0")/.." && pwd)/.env"
PASS_FILE="/root/.sara-backup-passphrase"
BUCKET="db-backups"
RETENCION_DIAS=30

for f in "$ENV_FILE" "$PASS_FILE"; do
  if [ ! -r "$f" ]; then
    echo "ERROR: no se puede leer $f" >&2
    exit 3
  fi
done

leer_env() {
  sed -n "s/^$1=//p" "$ENV_FILE" | head -n1 | sed 's/^["'\'']//; s/["'\'']$//'
}

SUPABASE_URL="$(leer_env NEXT_PUBLIC_SUPABASE_URL)"
SERVICE_KEY="$(leer_env SUPABASE_SERVICE_ROLE_KEY)"

if [ -z "$SUPABASE_URL" ] || [ -z "$SERVICE_KEY" ]; then
  echo "ERROR: faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en $ENV_FILE" >&2
  exit 3
fi

NOMBRE="$(basename "$DUMP").gpg"
CIFRADO="$(mktemp --suffix=.gpg)"
trap 'rm -f "$CIFRADO"' EXIT
chmod 600 "$CIFRADO"

echo "Cifrando $(basename "$DUMP")…"
gpg --batch --yes --quiet \
    --symmetric --cipher-algo AES256 \
    --passphrase-file "$PASS_FILE" \
    --output "$CIFRADO" "$DUMP"

# Comprobar que el cifrado es reversible ANTES de subir: un backup que no se
# puede descifrar es peor que no tener backup, porque da falsa tranquilidad.
if ! gpg --batch --quiet --decrypt --passphrase-file "$PASS_FILE" "$CIFRADO" 2>/dev/null | gzip -t; then
  echo "ERROR: el fichero cifrado no se puede descifrar, no se sube" >&2
  exit 1
fi

TAM=$(du -sh "$CIFRADO" | cut -f1)
echo "Subiendo $NOMBRE ($TAM) a $BUCKET…"

CODIGO=$(curl -s -o /tmp/offsite-resp.$$ -w '%{http_code}' \
  --max-time 300 --retry 2 --retry-delay 10 \
  -X POST "$SUPABASE_URL/storage/v1/object/$BUCKET/$NOMBRE" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/octet-stream" \
  --data-binary "@$CIFRADO")

RESP=$(head -c 300 /tmp/offsite-resp.$$ 2>/dev/null || true)
rm -f /tmp/offsite-resp.$$

if [ "$CODIGO" != "200" ]; then
  echo "ERROR: la subida devolvió $CODIGO: $RESP" >&2
  exit 1
fi
echo "Subido: $BUCKET/$NOMBRE"

# ─── Retención remota ────────────────────────────────────────────────────
# Se borra por nombre, no por fecha del objeto: el nombre lleva el timestamp
# del dump (sara_backup_YYYYMMDD_HHMMSS.sql.gz.gpg) y así el criterio es el
# mismo que el de la limpieza local.
LIMITE=$(date -d "-$RETENCION_DIAS days" +%Y%m%d)

LISTA=$(curl -s --max-time 60 \
  -X POST "$SUPABASE_URL/storage/v1/object/list/$BUCKET" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  --data '{"prefix":"","limit":1000,"sortBy":{"column":"name","order":"asc"}}')

VIEJOS=$(printf '%s' "$LISTA" \
  | grep -oE 'sara_backup_[0-9]{8}_[0-9]{6}\.sql\.gz\.gpg' \
  | sort -u \
  | awk -v lim="$LIMITE" -F'_' '{ if ($3 < lim) print }')

if [ -n "$VIEJOS" ]; then
  N=$(printf '%s\n' "$VIEJOS" | wc -l)
  PAYLOAD=$(printf '%s\n' "$VIEJOS" | python3 -c 'import json,sys; print(json.dumps({"prefixes":[l.strip() for l in sys.stdin if l.strip()]}))')
  curl -s -o /dev/null --max-time 60 \
    -X DELETE "$SUPABASE_URL/storage/v1/object/$BUCKET" \
    -H "Authorization: Bearer $SERVICE_KEY" \
    -H "Content-Type: application/json" \
    --data "$PAYLOAD"
  echo "Retención: $N copia(s) de más de $RETENCION_DIAS días eliminadas del bucket."
else
  echo "Retención: nada que borrar."
fi
