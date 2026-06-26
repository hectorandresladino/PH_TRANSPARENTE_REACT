# Comandos para ejecutar PH Transparente

## Opcion 1: Ejecutar TODO en Docker (Recomendado)

Levanta la base de datos, el API y el frontend con un solo comando.

```bash
cd ph_transparente_react_springboot
docker-compose up -d
```

**Espera unos minutos** mientras se construyen las imagenes.

### URLs cuando todo este en Docker:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8081/api
- **pgAdmin (Base de datos):** http://localhost:5050

### Detener todo:
```bash
docker-compose down
```

### Detener todo y borrar datos:
```bash
docker-compose down -v
```

---

## Opcion 2: Ejecutar Localmente (Modo Desarrollo)

### Paso 1: Base de datos (Docker)
```bash
cd ph_transparente_react_springboot
npm run db:up
```
Esto levanta solo PostgreSQL y pgAdmin.

### Paso 2: Backend (Spring Boot)
Abre otra terminal:
```bash
cd ph_transparente_react_springboot/backend-springboot
mvn spring-boot:run
```

El API estara en: **http://localhost:8081/api**

### Paso 3: Frontend (React)
Abre otra terminal:
```bash
cd ph_transparente_react_springboot/frontend-react
npm install
npm run dev
```

El frontend estara en: **http://localhost:5173**

---

## Comandos utiles

### Ver estado de los contenedores:
```bash
docker-compose ps
```

### Ver logs:
```bash
# Logs de la base de datos
docker-compose logs -f postgres

# Logs del API
docker-compose logs -f backend

# Logs del frontend
docker-compose logs -f frontend
```

### Conectar a la base de datos por consola:
```bash
docker exec -it ph-transparente-db psql -U postgres -d phdb
```

### Reconstruir todo desde cero:
```bash
docker-compose down -v
docker-compose up -d --build
```

---

## Credenciales

| Servicio   | Usuario / Email          | Password     |
|------------|--------------------------|--------------|
| App        | admin                    | admin123     |
| pgAdmin    | admin@phtransparente.com | admin123     |
| PostgreSQL | postgres                 | postgres123  |
