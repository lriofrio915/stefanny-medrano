# Sara Medical — Claude Code Instructions

## REGLAS CRÍTICAS — NUNCA IGNORAR

### 🚨 INCIDENTE 2026-04-11: pérdida total de datos
`prisma db push --force-reset` fue ejecutado en producción durante una sesión de desarrollo.
Resultado: TODOS los registros Doctor, Patient, MedicalRecord, Prescription, etc. fueron borrados permanentemente.
Esta fue una pérdida catastrófica e irrecuperable de datos de médicos reales.

### Comandos ABSOLUTAMENTE PROHIBIDOS — nunca ejecutar, ni con confirmación
- `prisma db push --force-reset` — DESTRUYE TODOS LOS DATOS. BLOQUEADO por `scripts/prisma-safe.sh`.
- `prisma migrate reset` — igual de destructivo.
- `DROP SCHEMA public CASCADE` — equivalente a force-reset.
- `TRUNCATE "Doctor" CASCADE` o cualquier TRUNCATE en producción.
- `DELETE FROM "Doctor"`, `DELETE FROM "Patient"` sin WHERE muy específico.

### Comandos que REQUIEREN backup previo explícito
- Cualquier `ALTER TABLE ... DROP COLUMN`
- `DROP TABLE`
- `DELETE FROM` con WHERE amplio

### Cambios de schema Prisma — proceso obligatorio
1. NUNCA usar `db push` en producción directamente. Usar `npm run db:deploy` (migrate deploy).
2. Para agregar una columna nueva: `npm run db:migrate` (crea migración en `/prisma/migrations/`).
3. Si `prisma db push` dice "already in sync" pero el campo no existe: el problema es la migración, NO ejecutar force-reset. Investigar primero.
4. En caso de conflicto irresoluble: reportar al usuario, crear un backup manual, y ESPERAR instrucción.

### Base de datos — backup obligatorio antes de cualquier cambio de schema
- Backup automático: `/etc/cron.d/sara-backup` en el VPS, cada día a las 3:00 (hora local del
  VPS) → `/var/backups/sara-medical/`, retención 30 días, log en `/var/log/sara-backup.log`.
  El workflow `daily-backup.yml` de GitHub Actions se eliminó el 2026-09-08 con el resto de
  crons. **Ojo**: con eso desapareció la única copia fuera del VPS (subía el dump como
  artifact con 90 días de retención). Hoy todos los backups viven en el mismo servidor.
  Pendiente: mandar el dump a un destino externo (S3/Backblaze/Drive).
- Copia fuera del VPS: `scripts/backup-offsite.sh`, llamado por `backup-db.sh` al terminar.
  Cifra el dump con GPG simétrico (AES256) y lo sube al bucket **privado** `db-backups` de
  Supabase Storage, con 30 días de retención. Antes de subir comprueba que el fichero cifrado
  se puede descifrar: un backup irrecuperable es peor que no tenerlo. Si la subida falla, el
  backup local sigue siendo válido y el script avisa sin abortar.
  - Frase de paso: `/root/.sara-backup-passphrase` (modo 600). **Sin ella los backups remotos
    no se pueden restaurar.** Debe existir además una copia en el gestor de contraseñas.
  - Restaurar desde la copia remota:
    ```bash
    curl -s -o b.sql.gz.gpg -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
      "$NEXT_PUBLIC_SUPABASE_URL/storage/v1/object/db-backups/<fichero>.sql.gz.gpg"
    gpg --batch --passphrase-file /root/.sara-backup-passphrase --decrypt b.sql.gz.gpg > b.sql.gz
    npm run db:restore b.sql.gz
    ```
  - Limitación asumida: el bucket vive en el mismo proyecto Supabase que la base que
    respalda. Cubre la pérdida del VPS, no un compromiso de la cuenta de Supabase; el cifrado
    GPG es lo que mitiga ese segundo caso.
- Backup manual: `npm run db:backup`
- Restaurar: `npm run db:restore <archivo.sql.gz>`
- Script: `scripts/backup-db.sh` y `scripts/restore-backup.sh`

## Stack técnico
- Next.js 16 App Router, TypeScript 6, Tailwind CSS 4
- Prisma ORM 5 + PostgreSQL (Supabase)
- Supabase Auth
- **Deploy en Vercel** — push a `main` dispara deploy automático

## Flujo de deploy
1. Editar archivos
2. `npm run build` — verificar que compile sin errores
3. `git add ... && git commit && git push origin main` → Vercel deploya automáticamente

## Crons (systemd timers en el VPS)

Migrados desde GitHub Actions el 2026-09-08. En `.github/workflows/` sólo queda `ci.yml`;
**no volver a crear workflows de cron ahí**.

Cada timer ejecuta `scripts/cron-endpoint.sh <endpoint>`, que hace el `curl` con la cabecera
`x-cron-secret` contra `/api/cron/<endpoint>` en producción. El script lee `CRON_SECRET` del
`.env` del proyecto y usa `https://www.consultorio.site` como URL base (se puede sobrescribir
con `CRON_APP_URL` en el `.env`).

Unidades en `/etc/systemd/system/`:
- `sara-cron@.service` — plantilla, la instancia es el nombre del endpoint
- `sara-cron@<endpoint>.timer` — uno por cron

| Timer | OnCalendar (UTC) | Qué hace |
|---|---|---|
| `sara-cron@trial-expiry` | 11:00 | 6am EC, downgrade TRIAL → FREE |
| `sara-cron@birthday-reminders` | 12:00 | 7am EC, felicitaciones de cumpleaños |
| `sara-cron@appointment-reminders` | 13:00 | 8am EC, recordatorios de citas 24h y 2h antes |
| `sara-cron@token-expiry` | 15:00 | 10am EC, limpieza de tokens expirados |
| `sara-cron@manual-reminders` | `*:00,15,30,45` | recordatorios manuales del médico vía WhatsApp |
| `sara-cron@publish-scheduled` | `*:00` | publicación de posts programados |
| `sara-cron@satisfaction-surveys` | `*:05` | encuestas de satisfacción |

Los `OnCalendar` llevan `UTC` explícito a propósito: el VPS corre en `Europe/Berlin`, que
tiene horario de verano, y Ecuador no. Sin el sufijo los disparos se moverían una hora en
cada cambio de estación. El `cron` de Ubuntu (vixie 3.0pl1) **no** soporta `CRON_TZ`, por eso
esto son systemd timers y no una entrada en `/etc/cron.d/`.

Operación:
```bash
systemctl list-timers 'sara-cron@*' --all      # próximas ejecuciones
systemctl start sara-cron@publish-scheduled    # disparo manual (equivale al workflow_dispatch)
journalctl -u 'sara-cron@publish-scheduled.service' -n 50
journalctl -u 'sara-cron@*' --since today      # todos
```
El script sale con código != 0 si el endpoint no devuelve 200, así que un fallo deja la
unidad en estado `failed` y queda en el journal.

El backup diario de la base es aparte: `/etc/cron.d/sara-backup`.

## Planes
- FREE: acceso básico (post-trial)
- TRIAL: 21 días, acceso PRO completo
- PRO / ENTERPRISE: acceso completo
- Planes disponibles: `FREE`, `TRIAL`, `PRO_MENSUAL`, `PRO_ANUAL`, `ENTERPRISE`
- Para activar Pro Mensual: `UPDATE "Doctor" SET plan = 'PRO_MENSUAL', "trialEndsAt" = NULL WHERE email = '...'`
- Para activar Pro Anual: `UPDATE "Doctor" SET plan = 'PRO_ANUAL', "trialEndsAt" = NULL WHERE email = '...'`

## Reglas de calidad

- SIEMPRE verifica tu trabajo antes de darlo por terminado. Revisa que el código compila, que no hay errores de tipos, y que la lógica tiene sentido.
- Antes de implementar cualquier cambio, investiga el código existente para entender cómo funciona. No asumas — lee el código primero.
- NO implementes nada a menos que estés 100% seguro de que va a funcionar. Si tienes dudas, investiga más o pregúntame antes de proceder.

## Vulnerabilidades conocidas y aceptadas

### @signpdf / pdfkit / crypto-js (4 CVEs críticos, sin fix disponible)

**Paquetes afectados** (pineados a versión exacta sin `^`):
- `@signpdf/placeholder-plain@3.3.0`
- `@signpdf/signer-p12@3.3.0`
- `@signpdf/signpdf@3.3.0`
- `pdfkit` y `crypto-js` son deps transitivas de @signpdf

**Qué hacen**: firma electrónica PAdES-B/T de documentos médicos (recetas, certificados, órdenes de examen) según regulación ecuatoriana AM 0009-2017 con certificados P12 del BCE.

**Código**: `src/lib/firma-ec.ts` + rutas `/api/profile/signature` y `/api/documents/[type]/[id]/download`.

**Mitigación activa**:
- La firma ejecuta 100% server-side (Node.js), nunca en el browser.
- No procesa PDFs externos ni subidos por usuarios no autenticados.
- Los CVEs en pdfkit/crypto-js no tienen exploit conocido en este flujo de uso.

**Acción pendiente**: evaluar migración a servicio SaaS (DocuSign, AWS KMS, o SRI Ecuador API) como proyecto separado. No intentar reescribir la firma CMS/PAdES con node-forge sin un experto criptográfico.

## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.

Key routing rules:
- Product ideas, "is this worth building", brainstorming → invoke office-hours
- Bugs, errors, "why is this broken", 500 errors → invoke investigate
- Ship, deploy, push, create PR → invoke ship
- QA, test the site, find bugs → invoke qa
- Code review, check my diff → invoke review
- Update docs after shipping → invoke document-release
- Architecture review → invoke plan-eng-review
- Save progress, checkpoint, resume → invoke checkpoint
- Code quality, health check → invoke health

## gstack (instalado)

Skills disponibles vía `~/.claude/skills/gstack`. Instalar/actualizar:

```bash
git clone --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
cd ~/.claude/skills/gstack && ./setup --team
```

## Sistema de memoria

- Antes de terminar cualquier sesión de trabajo, guarda un resumen de lo que hiciste, lo que falta por hacer y cualquier decisión importante en un archivo .md dentro de la carpeta del proyecto (por ejemplo: PROGRESS.md o SESSION_NOTES.md).
- Al iniciar una nueva sesión, busca y lee estos archivos de memoria para entender dónde te quedaste y qué sigue.
- Organiza las notas por secciones: "Completado", "En progreso", "Pendiente" y "Decisiones tomadas".
- Actualiza estos archivos cada vez que completes un bloque significativo de trabajo.

## Health Stack

- typecheck: tsc --noEmit
- lint: eslint src
- test: vitest run