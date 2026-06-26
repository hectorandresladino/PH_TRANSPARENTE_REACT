# PH Transparente - React + Spring Boot

Proyecto migrado para dejar el frontend en React y el backend en Spring Boot, conservando los 24 módulos oficiales del aplicativo.

## Estructura

- `frontend-react/`: interfaz React con Vite.
- `backend-springboot/`: API REST Spring Boot.
- `docs/`: documentación de módulos y roles.

## Ejecutar backend

```bash
cd backend-springboot
mvn spring-boot:run
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

## Módulos conservados

El sistema conserva los 24 módulos: copropiedad, unidades, propietarios, usuarios, recibos, pagos, cartera, parqueaderos, zonas comunes, vigilancia, convivencia, PQRS, comunicados, documentos, consejo, votaciones del consejo, asamblea, votaciones/quórum, licitaciones, contratos, proyectos, reportes, auditoría y cartelera digital.
