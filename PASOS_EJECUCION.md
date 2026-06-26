# Pasos para Ejecutar PH Transparente

Guía paso a paso para ejecutar el backend, frontend y la aplicación completa.

## Requisitos Previos

- **Java 17** o superior
- **Maven 3.6+** para el backend
- **Node.js 18+** y **npm** para el frontend
- **Docker Desktop** (para la base de datos PostgreSQL)

---

## PASO 0: Levantar la Base de Datos (PostgreSQL)

### 0.1 Desde la raíz del proyecto, iniciar Docker Compose
```bash
cd ph_transparente_react_springboot
npm run db:up
```

**O manualmente con Docker Compose:**
```bash
docker-compose up -d
```

### 0.2 Verificar que PostgreSQL está corriendo
```bash
docker-compose ps
```

Debes ver el contenedor `ph-transparente-db` en estado `healthy`.

### 0.3 Acceder a pgAdmin (opcional, interfaz visual)
Abre tu navegador en: **http://localhost:5050**
- **Email:** `admin@phtransparente.com`
- **Password:** `admin123`

Para conectar el servidor en pgAdmin:
- Host: `postgres`
- Port: `5432`
- Database: `phdb`
- Username: `postgres`
- Password: `postgres123`

---

## PASO 1: Ejecutar el Backend (Spring Boot)

### 1.1 Navegar al directorio del backend
```bash
cd backend-springboot
```

### 1.2 Compilar y ejecutar con Maven
```bash
mvn spring-boot:run
```

**O alternativamente:**
```bash
mvn clean install
mvn spring-boot:run
```

### 1.3 Verificar que el backend está corriendo
El backend iniciará en el puerto **8081**. Verás en la consola:
```
Started PhTransparenteApiApplication in X seconds
Tomcat started on port 8081 (http)
Usuario admin creado: admin/admin123
```

### 1.4 Probar los endpoints del backend
Abre otra terminal y ejecuta:

**Health check:**
```bash
curl http://localhost:8081/api/health
```
Respuesta esperada: `PH Transparente API OK`

**Obtener módulos:**
```bash
curl http://localhost:8081/api/modules
```

**Login:**
```bash
curl -X POST http://localhost:8081/api/auth/login -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

---

## PASO 2: Ejecutar el Frontend (React)

### 2.1 Navegar al directorio del frontend (en otra terminal)
```bash
cd frontend-react
```

### 2.2 Instalar dependencias (primera vez)
```bash
npm install
```

### 2.3 Configurar variables de entorno
Crea el archivo `.env` si no existe:
```bash
echo "VITE_API_URL=http://localhost:8081/api" > .env
```

### 2.4 Ejecutar el frontend en modo desarrollo
```bash
npm run dev
```

### 2.5 Verificar que el frontend está corriendo
El frontend iniciará en el puerto **5174** (o 5173 si está disponible). Verás:
```
VITE ready in XXX ms
➜ Local: http://localhost:5174/
```

---

## PASO 3: Acceder a la Aplicación

### 3.1 Abrir el navegador
Ve a: **http://localhost:5174**

### 3.2 Iniciar sesión
- **Usuario:** `admin`
- **Contraseña:** `admin123`

### 3.3 Navegar por la aplicación
- **Dashboard:** Vista principal con estadísticas y módulos en columna
- **App Store:** Vista tipo tienda de aplicaciones para instalar módulos

---

## PASO 4: Detener las Aplicaciones

### Detener el backend
Presiona `Ctrl + C` en la terminal donde está corriendo el backend.

### Detener el frontend
Presiona `Ctrl + C` en la terminal donde está corriendo el frontend.

---

## Solución de Problemas

### Puerto 8081 ya está en uso
```bash
# En Windows
netstat -ano | findstr :8081
taskkill /PID <PID> /F

# En Linux/Mac
lsof -ti:8081 | xargs kill -9
```

### Puerto 5174 ya está en uso
```bash
# En Windows
netstat -ano | findstr :5174
taskkill /PID <PID> /F

# En Linux/Mac
lsof -ti:5174 | xargs kill -9
```

### Error de conexión con el backend
- Verifica que el backend esté corriendo en http://localhost:8081
- Verifica que CORS esté configurado correctamente
- Revisa la consola del navegador para errores de red

### Error de compilación del backend
```bash
cd backend-springboot
mvn clean
mvn spring-boot:run
```

### Error de dependencias del frontend
```bash
cd frontend-react
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## Ejecución con Scripts Simultáneos

### Usar el script principal del proyecto
Desde la raíz del proyecto:
```bash
npm install
npm run dev
```

Esto iniciará tanto el backend como el frontend simultáneamente.

### Ejecutar en segundo plano (background)
```bash
# Backend en background
cd backend-springboot
mvn spring-boot:run &

# Frontend en background
cd frontend-react
npm run dev &
```

---

## Configuración de Base de Datos

### Usar PostgreSQL (por defecto)
El proyecto ya está configurado para usar PostgreSQL con Docker Compose. No requiere configuración adicional.

Credenciales por defecto:
- **Host:** `localhost:5434`
- **Database:** `phdb`
- **Usuario:** `postgres`
- **Password:** `postgres123`

### Usar H2 (desarrollo rápido, sin Docker)
Si prefieres usar H2 en memoria sin Docker, edita `backend-springboot/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:h2:mem:phdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
spring.datasource.username=sa
spring.datasource.password=
spring.datasource.driver-class-name=org.h2.Driver
spring.h2.console.enabled=true
```

Y luego ejecuta el backend con el perfil `dev`:
```bash
cd backend-springboot
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

---

## Verificación Completa

### Checklist de ejecución
- [ ] PostgreSQL corriendo en Docker (contenedor `ph-transparente-db`)
- [ ] pgAdmin accesible en http://localhost:5050
- [ ] Backend corriendo en puerto 8081
- [ ] Frontend corriendo en puerto 5174
- [ ] Login funcional con admin/admin123
- [ ] Dashboard muestra estadísticas
- [ ] Dashboard muestra 24 módulos en columna
- [ ] App Store muestra módulos como aplicaciones
- [ ] Instalación/desinstalación de módulos funciona

---

## URLs de Acceso

- **Frontend:** http://localhost:5174
- **Backend API:** http://localhost:8081/api
- **Health Check:** http://localhost:8081/api/health
- **Módulos:** http://localhost:8081/api/modules
- **Login:** http://localhost:8081/api/auth/login
- **Dashboard:** http://localhost:8081/api/dashboard
- **pgAdmin:** http://localhost:5050 (interfaz visual de PostgreSQL)

---

## Credenciales

- **Usuario admin:** `admin`
- **Contraseña admin:** `admin123`
- **PostgreSQL pgAdmin:**
  - Email: `admin@phtransparente.com`
  - Password: `admin123`
- **Base de datos PostgreSQL:**
  - Host: `localhost:5434`
  - Database: `phdb`
  - Usuario: `postgres`
  - Password: `postgres123`
