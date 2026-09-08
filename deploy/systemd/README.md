# Crons de Sara — systemd timers

Copia versionada de las unidades que corren en el VPS. Migradas desde GitHub Actions el
2026-09-08; en `.github/workflows/` sólo queda `ci.yml`.

Cada timer ejecuta `scripts/cron-endpoint.sh <endpoint>`, que hace el `curl` con la cabecera
`x-cron-secret` contra `/api/cron/<endpoint>` en producción.

Son systemd timers y no entradas de `/etc/cron.d/` porque el `cron` de Ubuntu (vixie 3.0pl1)
no soporta `CRON_TZ`. El VPS corre en `Europe/Berlin`, que tiene horario de verano, y Ecuador
no: sin un `OnCalendar` en UTC explícito los disparos se moverían una hora en cada cambio de
estación.

## Instalar / actualizar

```bash
sudo cp deploy/systemd/sara-cron@.service deploy/systemd/sara-cron@*.timer /etc/systemd/system/
sudo systemctl daemon-reload
for e in appointment-reminders birthday-reminders trial-expiry token-expiry \
         manual-reminders publish-scheduled satisfaction-surveys; do
  sudo systemctl enable --now "sara-cron@$e.timer"
done
```

## Operación

```bash
systemctl list-timers 'sara-cron@*' --all      # próximas ejecuciones
systemctl start sara-cron@publish-scheduled    # disparo manual
journalctl -u 'sara-cron@publish-scheduled.service' -n 50
journalctl -u 'sara-cron@*' --since today      # todos
```

El script sale con código != 0 si el endpoint no devuelve 200, así que un fallo deja la
unidad en `failed` y queda registrado en el journal.

La tabla de horarios está en `CLAUDE.md`, sección "Crons".
