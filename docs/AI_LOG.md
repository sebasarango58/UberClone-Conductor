# Bitácora de desarrollo – UberClone Conductor

- **Proyecto:** UberClone Conductor
- **Periodo de desarrollo:** 4 de noviembre de 2026 – 17 de noviembre de 2026 (14 días de trabajo continuo en el código)
- **Fecha de cierre del registro:** 17 de noviembre de 2026

---

## Registro de actividades y dudas

### 1. ¿Cómo puedo mostrar la ubicación real del conductor en el mapa?
- **Fecha:** 4 de noviembre de 2026
- **Contexto:** Al principio tenía la duda de cómo hacer para que la aplicación mostrara la ubicación del conductor y no unas coordenadas de demostración. Estuve revisando cómo obtener la ubicación del dispositivo y encontré que podía utilizar Expo Location.
- **Solución:** Se modificó el archivo `useDriverLocation.js` para solicitar permiso de ubicación y obtener las coordenadas del celular. También se agregó la actualización de la ubicación mientras el conductor está disponible.

### 2. ¿Cómo puedo mostrar el mapa en la pantalla principal?
- **Fecha:** 7 de noviembre de 2026
- **Contexto:** Ya tenía la información de la ubicación, pero no sabía cómo mostrarla visualmente dentro de la aplicación.
- **Solución:** Para solucionar esto se utilizó `MapView` de React Native Maps y se agregó un marcador (`Marker`) para identificar la ubicación del conductor. Se realizaron cambios en `HomeScreen.js` y se comprobó que el mapa apareciera correctamente.

### 3. ¿Por qué el mapa no aparece cuando acepto un viaje?
- **Fecha:** 10 de noviembre de 2026
- **Contexto:** Después de probar la aplicación me di cuenta de que el mapa de la pantalla principal no aparecía en las etapas del viaje. Mi duda era si debía utilizar el mismo mapa o si tenía que implementarlo también en la pantalla del viaje.
- **Solución:** Revisando el funcionamiento, encontré que `TripScreen.js` tenía una sección de demostración, por lo que fue necesario agregar allí el componente del mapa.

### 4. ¿Cómo puedo guardar las coordenadas del punto de recogida y del destino?
- **Fecha:** 12 de noviembre de 2026
- **Contexto:** Para mostrar los dos puntos en el mapa necesitaba que el viaje tuviera sus respectivas coordenadas, no solamente los nombres de los lugares.
- **Solución:** Por eso se modificó `DriverContext.js`, agregando las coordenadas de demostración del Parque de El Poblado y del Aeropuerto Olaya Herrera, en Medellín. De esta manera, la información de los dos lugares se conserva cuando se acepta la solicitud.

### 5. ¿Cómo puedo hacer que la ruta siga las calles y no aparezca como una línea recta?
- **Fecha:** 15 de noviembre de 2026
- **Contexto:** Esta fue una de las dudas que surgieron durante las pruebas. Inicialmente, el mapa mostraba una línea recta entre el punto de recogida y el destino, pero quería que el recorrido fuera parecido al que muestran las aplicaciones de transporte. Estuve revisando alternativas y se decidió utilizar OSRM junto con OpenStreetMap, para calcular una ruta siguiendo las calles sin tener que pagar por una API de Google.
- **Solución:** En `TripScreen.js` se agregó una consulta mediante `fetch` al servicio de OSRM. La respuesta contiene las coordenadas del recorrido y estas se utilizan con `Polyline` para dibujar la ruta sobre el mapa.

### 6. ¿Cómo puedo comprobar que los cambios funcionan en las dos etapas del viaje?
- **Fecha:** 17 de noviembre de 2026
- **Contexto:** Después de realizar los cambios ejecuté nuevamente el proyecto y simulé una solicitud.
- **Solución:** Primero revisé la pantalla donde aparece el punto de recogida y después pulsé el botón «Pasajero a bordo» para comprobar el cambio hacia el destino. En las dos etapas se mostró correctamente el recorrido por las calles y no se presentaron errores durante las pruebas.

---

## Archivos modificados
- `src/hooks/useDriverLocation.js`
- `src/screens/HomeScreen.js`
- `src/context/DriverContext.js`
- `src/screens/TripScreen.js`

## Dependencias utilizadas
- `react-native-maps`: para mostrar los mapas, marcadores y recorridos.
- `expo-location`: para obtener la ubicación del dispositivo.

## Resultado de la jornada
Se logró implementar el mapa en la pantalla principal y en las dos etapas del viaje. También se consiguió calcular y mostrar una ruta real por las calles utilizando OSRM y OpenStreetMap.

Quedan pendientes las demás funcionalidades del proyecto que se deben revisar de acuerdo con los requisitos de la docente.