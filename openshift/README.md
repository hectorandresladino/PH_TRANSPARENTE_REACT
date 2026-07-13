# Despliegue en Red Hat OpenShift Sandbox

Configuración lista para desplegar PH Transparente en Red Hat OpenShift Sandbox.

## Archivos incluidos

```
openshift/
├── secrets.yaml        # Secret con credenciales de BD, JWT y email
├── postgresql.yaml     # PostgreSQL con almacenamiento persistente
├── backend.yaml        # BuildConfig + Deployment + Service + Route del backend
├── frontend.yaml       # BuildConfig + Deployment + Service + Route del frontend
└── README.md           # Esta guía
```

## Requisitos

- Cuenta en [Red Hat Developer Sandbox](https://developers.redhat.com/developer-sandbox)
- CLI `oc` instalado
- Repositorio en GitHub/GitLab (los BuildConfig apuntan a él)

## Pasos de despliegue

### 1. Configurar secret

Edite `secrets.yaml` y cambie al menos estas claves:

```yaml
stringData:
  database-url: "jdbc:postgresql://ph-postgresql:5432/phdb"
  database-username: "postgres"
  database-password: "UNA_CONTRASEÑA_SEGURA"
  jwt-secret: "UN_SECRET_BASE64_O_TEXTO_LARGO"
  email-password: "SU_CLAVE_DE_APLICACION_GMAIL"
```

> El JWT secret debe ser largo y seguro. En producción nunca use el valor por defecto.

### 2. Actualizar URL del repositorio Git

En `backend.yaml` y `frontend.yaml` reemplace la URL de Git por la suya:

```yaml
spec:
  source:
    git:
      uri: "https://github.com/SU_USUARIO/ph_transparente.git"
```

### 3. Login y crear proyecto

```bash
oc login --token=SU_TOKEN --server=https://api.sandbox-...:6443
oc new-project ph-transparente
```

### 4. Aplicar manifiestos

```bash
cd openshift
oc apply -f secrets.yaml
oc apply -f postgresql.yaml
oc apply -f backend.yaml
```

### 5. Obtener URL pública del backend

Espere a que el backend esté desplegado y obtenga su URL:

```bash
oc get route ph-backend
```

La URL será similar a:
`https://ph-backend-ph-transparente.apps.sandbox-...openshiftapps.com`

### 6. Configurar frontend con URL del backend

Edite `frontend.yaml` y reemplace el valor de `VITE_API_URL`:

```yaml
      dockerStrategy:
        buildArgs:
          - name: "VITE_API_URL"
            value: "https://ph-backend-ph-transparente.apps.sandbox-...openshiftapps.com/api"
```

### 7. Desplegar frontend

```bash
oc apply -f frontend.yaml
```

### 8. Ver URLs públicas

```bash
oc get routes
```

Acceda a la URL del frontend (`ph-frontend`) para usar la aplicación.

## Verificación rápida

```bash
# Ver pods
oc get pods

# Ver logs del backend
oc logs -f deployment/ph-backend

# Ver logs del frontend
oc logs -f deployment/ph-frontend

# Ver logs de PostgreSQL
oc logs -f deployment/ph-postgresql
```

## Credenciales de prueba

| Rol        | Usuario         | Contraseña   |
|------------|-----------------|--------------|
| Admin      | admin           | admin123     |
| Contador   | contador        | contador123  |
| Revisor    | revisor         | revisor123   |
| Consejero  | consejero       | consejero123 |
| Copropietario | copropietario | copropietario123 |
| Vigilancia | vigilancia      | vigilancia123 |

## Notas importantes

- El backend está configurado para escuchar en 0.0.0.0:8081 dentro del pod.
- Las variables de entorno `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD` y `JWT_SECRET` toman prioridad sobre `application.properties`.
- El frontend se construye con `VITE_API_URL` apuntando al backend. Si la URL del backend cambia, debe reconstruir la imagen del frontend.
- Para producción desactive `CORS_ALLOWED_ORIGINS=*` en `backend.yaml` y especifique solo el origen del frontend.

## Reconstruir imágenes

```bash
oc start-build ph-backend --follow
oc start-build ph-frontend --follow
```

## Recursos

- [Red Hat Developer Sandbox](https://developers.redhat.com/developer-sandbox)
- [OpenShift CLI](https://docs.openshift.com/container-platform/4.15/cli_reference/openshift_cli/getting-started-cli.html)
