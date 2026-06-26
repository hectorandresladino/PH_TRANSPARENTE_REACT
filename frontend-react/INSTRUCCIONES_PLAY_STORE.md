# INSTRUCCIONES PARA SUBIR A GOOGLE PLAY STORE

## PASO 1: INSTALAR ANDROID STUDIO

1. Descargue Android Studio desde: https://developer.android.com/studio
2. Instale Android Studio con las siguientes opciones:
   - Android SDK
   - Android SDK Platform-Tools
   - Android SDK Build-Tools
   - Android Virtual Device (para emulador)

## PASO 2: ABRIR EL PROYECTO EN ANDROID STUDIO

1. Abra Android Studio
2. Seleccione "Open an Existing Project"
3. Navegue a: `C:\Users\User\Desktop\ph_transparente_react_springboot\ph_transparente_react_springboot\frontend-react\android`
4. Espere a que Gradle sincronice el proyecto

## PASO 3: GENERAR FIRMA DE LA APLICACIÓN (KEYSTORE)

1. En Android Studio, vaya a: Build > Generate Signed Bundle / APK
2. Seleccione "Android App Bundle" (para Play Store) o "APK" (para pruebas)
3. Haga clic en "Create new..."
4. Complete los campos:
   - **Key store path:** Elija una ubicación segura para guardar el keystore
   - **Password:** Cree una contraseña segura (guárdela en un lugar seguro)
   - **Key alias:** Por ejemplo: "phtransparente"
   - **Key password:** Cree una contraseña segura (guárdela en un lugar seguro)
   - **Validity:** 25 años o más
   - **Certificate:** Complete con su información (nombre, organización, país)
5. Haga clic en "OK"

## PASO 4: COMPILAR LA APLICACIÓN

1. Seleccione "Build > Generate Signed Bundle / APK"
2. Seleccione el keystore que creó
3. Seleccione "release" como build variant
4. Haga clic en "Finish"
5. Espere a que se compile la aplicación
6. El archivo AAB se generará en: `android\app\release\app-release.aab`

## PASO 5: CREAR CUENTA DE DESARROLLADOR EN GOOGLE PLAY

1. Vaya a: https://play.google.com/console
2. Inicie sesión con su cuenta de Google
3. Pague la tarifa de registro ($25 USD - pago único)
4. Complete su información de desarrollador

## PASO 6: SUBIR LA APLICACIÓN A PLAY STORE

1. En Google Play Console, cree una nueva aplicación
2. Complete la información básica:
   - **Nombre de la app:** PH Transparente
   - **Paquete:** com.phtransparente.app
   - **Idioma:** Español
   - **Categoría:** Productividad o Herramientas
3. Suba el archivo AAB generado
4. Complete la información de la tienda:
   - **Descripción corta:** Sistema de gestión de propiedad horizontal
   - **Descripción completa:** (ver abajo)
   - **Capturas de pantalla:** Necesita capturas de la aplicación
   - **Icono:** Necesita crear iconos en diferentes tamaños
   - **Banner:** Banner de 1024x500 px

## PASO 7: CONFIGURAR CONTENIDO DE LA APLICACIÓN

1. Complete la información de clasificación de contenido
2. Declare los permisos de la aplicación
3. Configure la política de privacidad

## PASO 8: PRECIO Y DISTRIBUCIÓN

1. Seleccione "Gratis" o "Pago"
2. Configure los países donde estará disponible
3. Configure la disponibilidad del dispositivo

## PASO 9: PUBLICAR

1. Seleccione "Publicar" o "Lanzamiento de prueba"
2. Revise toda la información
3. Haga clic en "Publicar"

---

## DESCRIPCIÓN COMPLETA PARA PLAY STORE

```
PH Transparente es un sistema completo de gestión de propiedad horizontal diseñado 
para facilitar la administración de edificios y conjuntos residenciales.

CARACTERÍSTICAS PRINCIPALES:

✓ Gestión de usuarios con roles (Administrador, Contador, Revisor Fiscal, 
  Consejero, Copropietario, Seguridad)
✓ Sistema de PQR (Peticiones, Quejas, Reclamos)
✓ Gestión de pagos y cuotas de administración
✓ Reservas de espacios comunes
✓ Control de visitantes y seguridad
✓ Gestión de contratos y proveedores
✓ Sistema de multas y sanciones
✓ Gestión documental centralizada
✓ Asambleas y votaciones
✓ Consejo de administración
✓ Fondo de reserva y presupuesto anual
✓ Seguros obligatorios
✓ Cuentas bancarias
✓ Libro de actas oficial
✓ Reglamento de propiedad horizontal
✓ Sistema de alertas y notificaciones
✓ Dashboard de transparencia
✓ Reportes y estadísticas
✓ Calificación de personal
✓ Soporte y tareas de mantenimiento

BENEFICIOS:

- Transparencia total en la gestión administrativa
- Acceso fácil desde cualquier dispositivo
- Comunicación fluida entre copropietarios y administración
- Control financiero detallado
- Cumplimiento con la Ley 675 de 2001 (Colombia)
- Seguridad y control de acceso
- Historial completo de todas las actividades

IDEAL PARA:

- Edificios residenciales
- Conjuntos cerrados
- Unidades residenciales
- Parquesaderos
- Oficinas
- Cualquier propiedad horizontal

PH Transparente: La solución moderna para la gestión de su propiedad horizontal.
```

---

## ICONOS Y RECURSOS

Para crear iconos profesionales, use:
- https://www.favicon-generator.org/
- https://realfavicongenerator.net/
- https://canva.com/ (para diseño gráfico)

Tamaños necesarios:
- Icono de la app: 512x512 px
- Banner: 1024x500 px
- Capturas de pantalla: Mínimo 2, máximo 8
  - Teléfono: 1080x1920 px o 1080x2400 px
  - Tablet: 1200x1600 px o 1200x1920 px

---

## POLÍTICA DE PRIVACIDAD

Debe crear una política de privacidad que incluya:
- Qué datos recopila la aplicación
- Cómo se usan los datos
- Con quién se comparten los datos
- Cómo protege los datos
- Derechos del usuario

---

## REQUISITOS TÉCNICOS

- Android 5.0 (Lollipop) o superior
- Conexión a internet requerida
- 50 MB de espacio disponible

---

## INFORMACIÓN DE CONTACTO

Para soporte:
- Email: soporte@phtransparente.com
- Sitio web: http://phtransparente.com

---

## NOTAS IMPORTANTES

1. **Guarde el keystore en un lugar seguro** - Si lo pierde, no podrá actualizar la aplicación
2. **Las contraseñas del keystore son críticas** - Guárdelas en un lugar seguro
3. **La URL del backend debe estar en producción** antes de publicar
4. **Debe tener un servidor backend funcionando** para que la app funcione
5. **Los iconos deben ser de alta calidad** para ser aprobados por Google

---

## ACTUALIZACIÓN DE LA URL DEL BACKEND

Antes de publicar, debe actualizar la URL del backend en el archivo:

`frontend-react/src/api.js`

Cambie:
```javascript
const API_URL = 'http://localhost:8082/api';
```

Por la URL de producción de su backend:
```javascript
const API_URL = 'https://su-servidor-produccion.com/api';
```

Luego vuelva a compilar:
```bash
cd frontend-react
npm run build
npx cap sync android
```

Y abra el proyecto en Android Studio para generar el nuevo AAB.
