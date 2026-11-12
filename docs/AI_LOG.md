# Bitácora de uso de inteligencia artificial — UberClone Conductor

Esta bitácora registra el uso de ChatGPT como apoyo al desarrollo. Los bloques se revisaron contra el documento de requisitos. No se afirma que el estudiante haya escrito manualmente cada línea asistida por IA.

## Entrada #1
- Fecha: 2026-11-11
- Integrante: Kevin Pérez
- Herramienta: ChatGPT
- Objetivo: Revisar el estado del ZIP inicial y compararlo con el documento de requisitos.
- Prompt: "Espera, no tengo acceso al pc, necesito que me lo entregues completamente hecho conforme a lo que pide el documento, los datos que necesites, los puedes inventar."
- Resumen de la respuesta: Se revisó el ZIP y el PDF original. Se identificó que el proyecto inicial era un prototipo con dos pestañas de registro, simulación local de viajes y un backend con checkout pendiente.
- Qué se usó / modificó / descartó: Se utilizó la revisión de requisitos y se decidió ampliar el código existente, sin reemplazarlo por un proyecto ajeno. Los datos de ejemplo se mantienen ficticios. No se inventaron credenciales de servicios.
- Archivos afectados: ninguno en esta entrada de revisión.
- Commit: pendiente; no se creó commit en esta sesión.
- Verificación: lectura del contenido del ZIP y extracción del texto del PDF. No equivale a una prueba de ejecución.
- Aprendizaje: Antes de continuar un proyecto hay que comparar el código existente con el enunciado y distinguir las funciones reales de las simulaciones.

## Entrada #2
- Fecha: 2026-11-11
- Integrante: Kevin Pérez
- Herramienta: ChatGPT
- Objetivo: Completar el formulario de registro del conductor en tres pestañas con validaciones.
- Prompt: "Espera, no tengo acceso al pc, necesito que me lo entregues completamente hecho conforme a lo que pide el documento, los datos que necesites, los puedes inventar."
- Resumen de la respuesta: Se propuso y generó una tercera pestaña para documentos y pagos, con validaciones de licencia, SOAT, revisión técnico-mecánica, correo de Mercado Pago y aceptación de términos con comisión visible del 20 %.
- Qué se usó / modificó / descartó: Se conservaron las dos pestañas existentes y se amplió el formulario. Se mantuvo el estado de cuenta pendiente al enviar. Los datos reales del conductor no se inventaron ni se precargaron.
- Archivos afectados: `src/screens/RegistrationScreen.js`, `src/utils/validation.js`.
- Commit: pendiente; no se creó commit en esta sesión.
- Verificación: revisión estática del flujo y de las funciones de validación. Falta ejecutar en Expo Go y probar cada caso en dispositivo.
- Aprendizaje: La validación debe comprobar los datos antes de permitir avanzar o enviar el formulario.

## Entrada #3
- Fecha: 2026-11-11
- Integrante: Kevin Pérez
- Herramienta: ChatGPT
- Objetivo: Completar el flujo local de demostración, ganancias, historial y backend de pagos.
- Prompt: "Espera, no tengo acceso al pc, necesito que me lo entregues completamente hecho conforme a lo que pide el documento, los datos que necesites, los puedes inventar."
- Resumen de la respuesta: Se amplió el flujo de solicitud, viaje y cobro; se añadió filtro temporal y por método de pago al historial, saldo ilustrativo y endpoints Express para Checkout Pro y webhook.
- Qué se usó / modificó / descartó: Se añadió un botón de simulación de pago electrónico identificado como demo. La ruta real de Mercado Pago solo funciona al configurar credenciales de prueba en el backend. No se afirmaron integraciones activas de Google Maps, GPS, Firebase ni notificaciones push.
- Archivos afectados: `App.js`, `src/context/DriverContext.js`, `src/hooks/useDriverLocation.js`, `src/hooks/useEarnings.js`, `src/screens/HomeScreen.js`, `src/screens/TripScreen.js`, `src/screens/PaymentScreen.js`, `src/screens/EarningsScreen.js`, `src/screens/HistoryScreen.js`, `src/screens/ProfileScreen.js`, `backend/src/server.js`, archivos README y `.env.example`.
- Commit: pendiente; no se creó commit en esta sesión.
- Verificación: revisión estática del código generado y de las rutas. No se ejecutó la app ni se probó una transacción real en este entorno.
- Aprendizaje: Una simulación sirve para demostrar el flujo, pero no debe presentarse como pago real ni como conexión real a un servicio externo.

## Entrada #4
- Fecha: 2026-11-12
- Integrante: Sebastián Arango Posada
- Herramienta: Gemini
- Objetivo: Corregir la navegación hacia el registro, habilitar la precarga de datos al editar el perfil, validar la sincronización de disponibilidad en Firebase Firestore y realizar el commit seguro del proyecto.
- Prompt: "es que cuando le doy ver registro sale todo en blanco, sera que no esta guardando la informacion en Firebase_", "bueno ya me deja ponerme disponible pero el perfil al entrar aun lo veo en blanco", "si salgo, peor le doy en el boton ver/editar registro pero se me pone todo en blanco", "haz el commit solo con las caropetas que debo actualizar siguiendo tu recomendacion de seguridad"
- Resumen de la respuesta: Se corrigió el paso de la prop `navigate` en `RegistrationScreen.js` y se inicializó el estado del formulario con los datos guardados en `profile` para permitir su visualización y edición desde el perfil. Se validó la escritura en tiempo real en Firestore y se estructuraron los comandos de Git excluyendo el archivo `.env`.
- Qué se usó / modificó / descartó: Se ajustó `RegistrationScreen.js` para recibir `navigate`, precargar `profile` si existe y aprobar la cuenta en modo demostración al guardar. Se verificó la estructura de `App.js` y se descartó subir `.env` al repositorio remoto por seguridad.
- Archivos afectados: `App.js`, `src/screens/RegistrationScreen.js`, `src/screens/ProfileScreen.js`, `src/context/DriverContext.js`.
- Commit: "Ajustes: corrección de navegación, sincronización de perfil y estado de disponibilidad en Firebase" (puedes reemplazar por el hash corto tras ejecutar `git log -1 --oneline`).
- Verificación: Ejecución real en emulador Android (`Medium_Phone_API_37.0`) con Expo; comprobación visual del flujo completo de registro, edición de perfil, simulación de viaje y verificación de escritura en la consola de Firebase Firestore (`drivers` -> `isAvailable: true`).
- Aprendizaje: Al reutilizar un formulario para creación y edición, es indispensable inicializar su estado con los datos persistidos en el contexto global, y siempre se deben aislar las credenciales privadas (`.env`) antes de hacer commit.


# Estado de cierre de la bitácora académica

- **Pruebas de ejecución:** Completadas en emulador Android (`Medium_Phone_API_37.0`) mediante Expo, validando el flujo de registro, edición de perfil, simulación de viajes y sincronización en tiempo real con Firebase Firestore.
- **Control de versiones:** Cambios consolidados en el repositorio Git excluyendo credenciales sensibles (`.env`).
- **Trazabilidad:** Bloques asistidos documentados con referencia `AI-assisted: see docs/AI_LOG.md #N`.
- **Entrega:** Documento listo para exportación a PDF y carga en la plataforma académica.
