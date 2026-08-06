# Despliegue de PH Transparente en OpenShift

Esta carpeta contiene un despliegue completo y seguro para OpenShift 4:

- PostgreSQL 15 con volumen persistente.
- Backend Spring Boot construido desde Git mediante `BuildConfig`.
- Frontend React/Nginx construido desde Git mediante `BuildConfig`.
- `Secret`, `ConfigMap`, `ImageStream`, `Deployment`, `Service` y `Route` HTTPS.
- Probes de inicio, disponibilidad y vida, limites de recursos y ejecucion sin privilegios.

Solo el frontend se publica. Las solicitudes a `/api` se envian desde Nginx al servicio interno `ph-backend`; PostgreSQL y el backend no se exponen a Internet.

## Archivos

| Archivo | Uso |
| --- | --- |
| `ph-transparente-template.yaml` | Plantilla OpenShift con todos los componentes. |
| `deploy.ps1` | Instalacion o actualizacion idempotente desde Windows/PowerShell. |
| `parameters.example.env` | Ejemplo de parametros para usar directamente con `oc process`. |

La plantilla no contiene contrasenas reales. OpenShift o `deploy.ps1` generan claves aleatorias para PostgreSQL, JWT y el primer superadministrador.

## Antes de desplegar

1. Confirme que estos cambios esten guardados y enviados al repositorio Git. Los `BuildConfig` construyen desde el repositorio remoto, no desde los archivos locales.
2. Instale la CLI `oc` e inicie sesion:

```powershell
oc login --token=SU_TOKEN --server=https://api.SU_CLUSTER:6443
oc whoami
```

3. Use un proyecto existente del Sandbox o cree uno si su cuenta tiene permiso.

## Opcion recomendada: PowerShell

Desde la raiz del repositorio:

```powershell
.\openshift\deploy.ps1 `
  -Project ph-transparente `
  -GitUri https://github.com/hectorandresladino/PH_TRANSPARENTE_REACT.git `
  -GitRef main `
  -SuperAdminEmail admin@su-dominio.com `
  -EmailFrom no-reply@su-dominio.com `
  -WaitForRollout
```

Si OpenShift Sandbox ya le asigno un proyecto y no puede crear otro, seleccionelo primero y omita `-Project`:

```powershell
oc project SU_PROYECTO
.\openshift\deploy.ps1 -SuperAdminEmail admin@su-dominio.com -WaitForRollout
```

El script conserva `DATABASE_PASSWORD` y `JWT_SECRET` cuando se vuelve a ejecutar. Esto evita romper la base de datos o invalidar todas las sesiones durante una actualizacion.

Para configurar Gmail u otro SMTP en la primera instalacion:

```powershell
.\openshift\deploy.ps1 `
  -SuperAdminEmail admin@su-dominio.com `
  -EmailUsername cuenta@su-dominio.com `
  -EmailPassword CLAVE_DE_APLICACION `
  -EmailFrom cuenta@su-dominio.com
```

## Opcion por CLI

Copie el archivo de ejemplo sin guardar secretos en Git:

```powershell
Copy-Item openshift\parameters.example.env openshift\parameters.env
```

Edite `parameters.env` y procese la plantilla una sola vez:

```powershell
oc process -f openshift/ph-transparente-template.yaml --param-file=openshift/parameters.env | oc apply -f -
```

No repita ese comando sin aportar los mismos secretos: los parametros generados cambiarian. Para instalaciones y actualizaciones repetibles use `deploy.ps1`.

## Opcion desde la consola web

1. Seleccione la perspectiva **Developer** y el proyecto destino.
2. Abra **+Add > Import YAML** y cargue `ph-transparente-template.yaml`.
3. Cree la plantilla y luego instanciela desde **Developer Catalog**.
4. Revise `SOURCE_REPOSITORY_URL`, `SOURCE_REPOSITORY_REF`, correo del superadministrador y almacenamiento.
5. Espere a que terminen los builds `ph-backend` y `ph-frontend`.

La consola genera las claves marcadas como parametros automaticos. Guarde la clave del superadministrador en un gestor de contrasenas.

## Verificacion

```powershell
oc get builds,pods,deployments,services,routes,pvc
oc logs -f bc/ph-backend
oc logs -f bc/ph-frontend
oc rollout status deployment/ph-postgresql --timeout=5m
oc rollout status deployment/ph-backend --timeout=10m
oc rollout status deployment/ph-frontend --timeout=5m
oc get route ph-transparente -o jsonpath='https://{.spec.host}'
```

Consulte las credenciales iniciales sin almacenarlas en archivos:

```powershell
oc extract secret/ph-transparente-secrets --keys=APP_BOOTSTRAP_SUPERADMIN_USERNAME --to=-
oc extract secret/ph-transparente-secrets --keys=APP_BOOTSTRAP_SUPERADMIN_PASSWORD --to=-
```

El bootstrap solo crea el superadministrador cuando aun no existe. Cambie su clave despues del primer ingreso y no habilite datos de demostracion ni autorregistro en produccion.

## Publicar una nueva version

Despues de enviar cambios a la rama configurada:

```powershell
oc start-build ph-backend --follow
oc start-build ph-frontend --follow
oc rollout status deployment/ph-backend --timeout=10m
oc rollout status deployment/ph-frontend --timeout=5m
```

## Diagnostico rapido

```powershell
oc describe pod -l app.kubernetes.io/part-of=ph-transparente
oc logs deployment/ph-backend --tail=200
oc logs deployment/ph-frontend --tail=200
oc logs deployment/ph-postgresql --tail=200
oc get events --sort-by=.lastTimestamp
```

Si el backend no queda listo, compruebe primero PostgreSQL. Para consultar el endpoint de readiness, abra temporalmente un port-forward y visite la URL indicada:

```powershell
oc port-forward service/ph-backend 18081:8081
# En otra terminal:
Invoke-RestMethod http://localhost:18081/actuator/health/readiness
```

## Copias de seguridad

Antes de actualizaciones de esquema o cambios importantes, haga un respaldo:

```powershell
oc exec deployment/ph-postgresql -- pg_dump -U phuser phdb > phdb-backup.sql
```

El PVC protege los datos frente al reinicio del pod, pero no reemplaza una politica externa de copias de seguridad. Para alta disponibilidad real use un servicio PostgreSQL administrado o un operador certificado en lugar del `Deployment` incluido para el MVP.
