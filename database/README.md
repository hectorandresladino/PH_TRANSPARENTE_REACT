# Base de Datos - PH Transparente

## Configuración

Este proyecto usa **PostgreSQL 15** como base de datos principal.

### Credenciales

| Campo         | Valor            |
|---------------|------------------|
| Host          | `localhost:5434` |
| Database      | `phdb`           |
| Usuario       | `postgres`       |
| Password      | `postgres123`    |

### Conexión desde pgAdmin

1. Abre pgAdmin en: http://localhost:5050
2. Login:
   - Email: `admin@phtransparente.com`
   - Password: `admin123`
3. Agrega un nuevo servidor:
   - Name: `PH Transparente`
   - Host: `postgres` (desde Docker) o `localhost` (desde host, puerto `5434`)
   - Port: `5434` desde host o `5432` desde Docker
   - Database: `phdb`
   - Username: `postgres`
   - Password: `postgres123`

## Estructura de Tablas

Las tablas se crean automáticamente por JPA (Hibernate) al iniciar el backend:

- `users` — Usuarios del sistema
- `roles` — Roles y permisos por módulo
- `modules` — Módulos de la aplicación
- `alerts` — Alertas del sistema
- `annual_budgets` — Presupuestos anuales
- `assemblies` — Asambleas
- `bank_accounts` — Cuentas bancarias
- `contracts` — Contratos
- `contractors` — Contratistas
- `councils` — Consejos
- `documents` — Documentos
- `fines` — Multas
- `insurance_policies` — Pólizas de seguro
- `official_minutes` — Actas oficiales
- `payments` — Pagos
- `pqrs` — Peticiones, quejas y reclamos
- `property_units` — Unidades de propiedad
- `reservations` — Reservas
- `reserve_funds` — Fondos de reserva
- `security` — Registros de seguridad
- `support_tasks` — Tareas de soporte
- `transparency` — Transparencia
- `visitors` — Visitantes
- `votes` — Votaciones

## Scripts

- `init.sql` — Script de referencia de la estructura y datos iniciales

## Comandos Útiles

```bash
# Levantar la base de datos
docker-compose up -d postgres

# Ver logs
docker-compose logs -f postgres

# Conectar por consola
docker exec -it ph-transparente-db psql -U postgres -d phdb

# Backup
docker exec ph-transparente-db pg_dump -U postgres phdb > backup.sql

# Restore
docker exec -i ph-transparente-db psql -U postgres -d phdb < backup.sql
```
