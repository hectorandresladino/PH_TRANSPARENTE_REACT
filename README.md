# PH Transparente - React + Spring Boot

Proyecto migrado para dejar el frontend en React y el backend en Spring Boot, conservando los 24 módulos oficiales del aplicativo.

## Estructura

- `frontend-react/`: interfaz React con Vite.
- `backend-springboot/`: API REST Spring Boot.
- `docs/`: documentación de módulos y roles.

## Despliegue en OpenShift

El despliegue incluye PostgreSQL persistente, builds de frontend/backend, servicios internos, probes y una Route HTTPS. Consulte la [guia de OpenShift](openshift/README.md).

## Ejecutar backend

```bash
cd backend-springboot
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

Prueba:

```bash
http://localhost:8081/api/health
http://localhost:8081/api/modules
http://localhost:8081/api/dashboard
```

## Ejecutar frontend

```bash
cd frontend-react
npm install
npm run dev
```

Abrir:

```bash
http://localhost:5173
```

## Base de datos PostgreSQL

Por defecto corre con H2 en memoria para pruebas. Para PostgreSQL use variables de entorno:

```bash
DATABASE_URL=jdbc:postgresql://localhost:5432/ph_transparente
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
```

## Operación SaaS

La API aplica multitenencia por `organizationId` desde el JWT. En cada petición valida nuevamente que:

- el usuario siga activo y conserve el rol y la organización del token;
- la organización esté activa o en periodo de prueba;
- la suscripción y el plan estén vigentes;
- el módulo esté incluido tanto en el rol como en el plan;
- el rol pueda realizar operaciones de escritura;
- no se excedan los límites de usuarios y unidades.

El estado del tenant autenticado está disponible en `GET /api/saas/account`.

### Primer despliegue

En producción no se crean usuarios ni contraseñas de demostración. Configure temporalmente:

```bash
APP_BOOTSTRAP_SUPERADMIN_USERNAME=superadmin
APP_BOOTSTRAP_SUPERADMIN_PASSWORD=<contraseña-segura>
APP_BOOTSTRAP_SUPERADMIN_EMAIL=<correo>
JWT_SECRET=<secreto-base64-de-32-bytes-o-mas>
CORS_ALLOWED_ORIGINS=https://app.su-dominio.com
```

Después del primer inicio retire `APP_BOOTSTRAP_SUPERADMIN_PASSWORD`. El superadministrador puede crear planes, organizaciones y suscripciones mediante `/api/superadmin/**`.

Variables adicionales:

- `APP_SEED_ENABLED=false`: debe permanecer desactivada en producción.
- `APP_SAAS_SELF_REGISTRATION_ENABLED=false`: registro público desactivado por defecto.
- `VITE_SELF_REGISTRATION_ENABLED=false`: oculta el registro público en el frontend.

Para desarrollo local, el perfil `dev` habilita datos de demostración y autorregistro. Las contraseñas de demostración no deben reutilizarse ni publicarse en un despliegue real.

## Módulos conservados

El sistema conserva los 24 módulos: copropiedad, unidades, propietarios, usuarios, recibos, pagos, cartera, parqueaderos, zonas comunes, vigilancia, convivencia, PQRS, comunicados, documentos, consejo, votaciones del consejo, asamblea, votaciones/quórum, licitaciones, contratos, proyectos, reportes, auditoría y cartelera digital.
