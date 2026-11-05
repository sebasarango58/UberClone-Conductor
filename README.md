# UberClone — Versión Conductor

Aplicación móvil multiplataforma inspirada en Uber, desarrollada inicialmente con React Native y Expo. 

## Incluye
- Navegación inicial entre Inicio, Registro, Solicitud, Viaje, Cobro, Ganancias, Historial y Perfil.
- Registro en tres pestañas y validaciones principales.
- Estado de aprobación del conductor y simulación de aprobación para pruebas.
- Solicitud demo con temporizador de 15 segundos.
- Flujo demo: aceptar → conductor llega → pasajero a bordo → finalizar.
- Función pura calculateFare para tarifa, comisión del 20 % y ganancia neta.
- Resumen de ganancias con useMemo y temporizador con useEffect + limpieza.
- Esqueleto de API Express con variables de entorno de ejemplo.
- Bitácora inicial de uso de IA en docs/AI_LOG.md.

## Requisitos
- Node.js LTS compatible con Expo SDK del proyecto.
- Expo Go compatible con la versión del SDK o un emulador configurado.

## Ejecutar la app
1. Abre una terminal dentro de la carpeta uberclone-conductor.
2. Ejecuta npm install.
3. Ejecuta npx expo start.
4. Abre el proyecto con Expo Go compatible o con un emulador.

Si la versión exacta de Expo no estuviera disponible en tu entorno, revisa la versión de SDK compatible con la versión de Expo Go instalada antes de actualizar dependencias.

## Ejecutar el backend
1. Abre otra terminal en backend.
2. Copia .env.example a .env y completa solo credenciales de prueba cuando corresponda.
3. Ejecuta npm install.
4. Ejecuta npm start.
5. Comprueba GET /healt.

La ruta de checkout es un marcador de posición seguro: no crea pagos todavía. No añadas llaves secretas al código móvil ni a Git.

## Configuración e integraciones pendientes
- Google Maps SDK, ubicación real y Directions API.
- Backend de viajes, autenticación, base de datos y sincronización en tiempo real.
- Carga de fotos de perfil, vehículo y documentos (por ejemplo, Cloudinary).
- Notificaciones push.
- Mercado Pago Checkout Pro en entorno de prueba, webhook y confirmación del pago en backend.
- Persistencia de sesión/preferencias, saldo, filtros de fecha completos, paginación e historial de detalle.
- Pruebas unitarias de validaciones y tarifas, pruebas de interfaz y verificación en dispositivo.

## Modelo de tarifa
Valores didácticos del documento: base $3.500 COP, $1.200 COP/km, $250 COP/min, mínimo $6.000 COP; multiplicadores economy 1.0, xl 1.4, premium 1.8; comisión 20 %. Los valores no representan tarifas reales.

## Uso de IA
Consulta docs/AI_LOG.md. La bitácora debe completarse durante el trabajo real y exportarse a PDF para la entrega académica.

## Primera entrega: registro del conductor
- Pestaña 1: datos personales, fotografía de perfil desde cámara o galería, fecha de nacimiento y validaciones.
- Pestaña 2: categoría, placa colombiana, marca, modelo, año, color, capacidad y fotografía del vehículo.
- La categoría XL exige mínimo 6 pasajeros.
- El avance se guarda en el contexto local de la aplicación. El envío definitivo y la pestaña Documentos y pagos quedan para la siguiente entrega.
- Para instalar el selector de fotografías con la versión compatible con el SDK de Expo del proyecto, ejecuta: npx expo install expo-image-picker.
