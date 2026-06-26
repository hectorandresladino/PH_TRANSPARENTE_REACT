# Despliegue en OpenShift Sandbox

Este proyecto incluye todos los componentes necesarios para desplegar PH Transparente en Red Hat OpenShift Sandbox.

## Requisitos Previos

- Cuenta en [Red Hat OpenShift Sandbox](https://developers.redhat.com/developer-sandbox)
- CLI de OpenShift (`oc`) instalado
- Acceso a un cluster de OpenShift

## Estructura de Archivos

```
openshift/
├── backend-deployment.yaml    # Deployment del backend Spring Boot
├── backend-service.yaml       # Service del backend
├── frontend-deployment.yaml   # Deployment del frontend React
├── frontend-service.yaml      # Service del frontend
├── route.yaml                # Route para acceso externo
├── db-secret.yaml            # Secret para credenciales de BD
└── deploy.sh                 # Script de despliegue automatizado
```

## Instrucciones de Despliegue

### Opción 1: Script Automatizado

1. **Obtener token de OpenShift**
   - Inicia sesión en [Red Hat Developer Sandbox](https://developers.redhat.com/developer-sandbox)
   - Copia tu token de acceso desde la consola de OpenShift

2. **Ejecutar el script**
   ```bash
   cd openshift
   chmod +x deploy.sh
   ./deploy.sh
   ```

3. **Seguir las instrucciones del script**
   - El script te pedirá que te loguees con tu token
   - Construirá y desplegará ambos componentes
   - Al final mostrará la URL de acceso

### Opción 2: Despliegue Manual

1. **Login en OpenShift**
   ```bash
   oc login --token=<YOUR_TOKEN> --server=<YOUR_SERVER>
   ```

2. **Crear proyecto**
   ```bash
   oc new-project ph-transparente
   ```

3. **Desplegar secret de base de datos**
   ```bash
   oc apply -f db-secret.yaml
   ```

4. **Construir y desplegar backend**
   ```bash
   cd ../backend-springboot
   oc new-build --name ph-transparente-backend --binary --strategy=docker
   oc start-build ph-transparente-backend --from-dir=. --follow
   cd ../openshift
   oc apply -f backend-deployment.yaml
   oc apply -f backend-service.yaml
   ```

5. **Construir y desplegar frontend**
   ```bash
   cd ../frontend-react
   oc new-build --name ph-transparente-frontend --binary --strategy=docker
   oc start-build ph-transparente-frontend --from-dir=. --follow
   cd ../openshift
   oc apply -f frontend-deployment.yaml
   oc apply -f frontend-service.yaml
   ```

6. **Crear route para acceso externo**
   ```bash
   oc apply -f route.yaml
   ```

## Verificar el Despliegue

**Verificar pods:**
```bash
oc get pods -n ph-transparente
```

**Verificar servicios:**
```bash
oc get services -n ph-transparente
```

**Verificar route:**
```bash
oc get route ph-transparente-route -n ph-transparente
```

**Ver logs del backend:**
```bash
oc logs -f deployment/ph-transparente-backend -n ph-transparente
```

**Ver logs del frontend:**
```bash
oc logs -f deployment/ph-transparente-frontend -n ph-transparente
```

## Configuración de Base de Datos

El deployment está configurado para usar PostgreSQL. Necesitas:

1. **Configurar el secret** (editar `db-secret.yaml`):
   ```yaml
   stringData:
     username: tu_usuario
     password: tu_password
   ```

2. **Desplegar PostgreSQL** (opcional - usar servicio de OpenShift):
   ```bash
   oc new-app postgresql-ephemeral --name postgresql \
     -e POSTGRESQL_USER=postgres \
     -e POSTGRESQL_PASSWORD=changeme \
     -e POSTGRESQL_DATABASE=phdb
   ```

## Credenciales de Acceso

- **Usuario admin:** `admin`
- **Contraseña:** `admin123`

## Solución de Problemas

**Pod no inicia:**
```bash
oc describe pod <pod-name> -n ph-transparente
oc logs <pod-name> -n ph-transparente
```

**Reconstruir imagen:**
```bash
oc start-build ph-transparente-backend --from-dir=../backend-springboot --follow -n ph-transparente
oc start-build ph-transparente-frontend --from-dir=../frontend-react --follow -n ph-transparente
```

**Escalar replicas:**
```bash
oc scale deployment ph-transparente-backend --replicas=2 -n ph-transparente
oc scale deployment ph-transparente-frontend --replicas=2 -n ph-transparente
```

## Recursos

- [Documentación de OpenShift](https://docs.openshift.com/)
- [Red Hat Developer Sandbox](https://developers.redhat.com/developer-sandbox)
- [CLI de OpenShift](https://docs.openshift.com/cli-reference/openshift-cli/index.html)
