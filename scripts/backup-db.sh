#!/bin/bash
# Backup de la base de datos Sara Medical
# Uso: ./scripts/backup-db.sh
# El backup se guarda en /var/backups/sara-medical/

# pipefail es importante: sin él, si pg_dump falla a mitad, gzip sigue devolviendo 0
# y nos quedamos con un .gz válido pero truncado que parece un backup bueno.
set -eo pipefail

BACKUP_DIR="/var/backups/sara-medical"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/sara_backup_$TIMESTAMP.sql.gz"

# Los dumps llevan datos clínicos de pacientes reales: solo root.
mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"
umask 077

# Cargar DATABASE_URL desde .env
ENV_FILE="$(dirname "$0")/../.env"
if [ -f "$ENV_FILE" ]; then
  export $(grep "^DATABASE_URL=" "$ENV_FILE" | sed 's/DATABASE_URL="\(.*\)"/DATABASE_URL=\1/' | sed 's/?pgbouncer=true//')
fi

if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL no encontrada en .env"
  exit 1
fi

echo "Iniciando backup: $BACKUP_FILE"
pg_dump "$DATABASE_URL" --no-owner --no-privileges | gzip > "$BACKUP_FILE"
chmod 600 "$BACKUP_FILE"

# Un dump sano termina siempre con la línea de cierre de pg_dump.
if ! zcat "$BACKUP_FILE" | tail -5 | grep -q "PostgreSQL database dump complete"; then
  echo "ERROR: el dump está incompleto, se borra $BACKUP_FILE" >&2
  rm -f "$BACKUP_FILE"
  exit 1
fi

echo "Backup completado: $BACKUP_FILE"
echo "Tamaño: $(du -sh "$BACKUP_FILE" | cut -f1)"

# Borrar backups con más de 30 días
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +30 -delete
echo "Backups anteriores (>30 días) eliminados."
