#!/usr/bin/env bash
#
# Dispara un endpoint de /api/cron en producción desde el cron del VPS.
#
# Reemplaza a los workflows de GitHub Actions que hacían el mismo curl
# (migrados el 2026-09-08, ver /etc/cron.d/sara-crons).
#
# Uso: cron-endpoint.sh <nombre-del-endpoint>
#   ej. cron-endpoint.sh publish-scheduled
#
# Lee CRON_SECRET del .env del proyecto. La URL base sale de CRON_APP_URL
# si está definida en el .env; si no, usa el dominio con www, que es el
# canónico (el ápex responde 307 y añade un salto innecesario).
#
# Sale con código != 0 si el endpoint no devuelve 200, para que cron
# mande el correo de error al usuario local.

set -uo pipefail

ENDPOINT="${1:-}"
if [ -z "$ENDPOINT" ]; then
  echo "uso: $(basename "$0") <nombre-del-endpoint>" >&2
  exit 2
fi

ENV_FILE="${SARA_ENV_FILE:-/var/www/sara-solution/.env}"
if [ ! -r "$ENV_FILE" ]; then
  echo "$(date -Is) [$ENDPOINT] ERROR: no se puede leer $ENV_FILE" >&2
  exit 3
fi

# Sólo extraemos las dos claves que necesitamos, sin ejecutar el .env entero.
read_env() {
  sed -n "s/^$1=//p" "$ENV_FILE" | head -n1 | sed 's/^["'\'']//; s/["'\'']$//'
}

CRON_SECRET="$(read_env CRON_SECRET)"
APP_URL="$(read_env CRON_APP_URL)"
APP_URL="${APP_URL:-https://www.consultorio.site}"

if [ -z "$CRON_SECRET" ]; then
  echo "$(date -Is) [$ENDPOINT] ERROR: CRON_SECRET vacío en $ENV_FILE" >&2
  exit 3
fi

# El cuerpo va a un fichero temporal en vez de mezclarse con el código HTTP:
# así el parseo no depende de saltos de línea dentro de la respuesta.
# Sin reintentos, igual que los workflows: estos endpoints no son idempotentes
# (publish-scheduled llegaría a publicar dos veces el mismo post).
BODY_FILE=$(mktemp)
trap 'rm -f "$BODY_FILE"' EXIT

STATUS=$(curl -s -L -o "$BODY_FILE" -w '%{http_code}' \
  --max-time 60 --connect-timeout 10 \
  -H "x-cron-secret: $CRON_SECRET" \
  "$APP_URL/api/cron/$ENDPOINT")

BODY=$(head -c 500 "$BODY_FILE" | tr -d '\n')

echo "$(date -Is) [$ENDPOINT] $STATUS $BODY"

if [ "$STATUS" != "200" ]; then
  echo "$(date -Is) [$ENDPOINT] ERROR: el endpoint devolvió $STATUS" >&2
  exit 1
fi
