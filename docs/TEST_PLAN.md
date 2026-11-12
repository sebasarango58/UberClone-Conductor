# Plan de pruebas manuales — UberClone Conductor

Estas pruebas deben ejecutarse en Expo Go SDK 58 y en el backend local antes de presentar el proyecto. El código de esta entrega fue revisado estáticamente; no se debe marcar una prueba como aprobada hasta ejecutarla en un dispositivo.

| ID | Caso | Resultado esperado |
|---|---|---|
| REG-01 | Intentar enviar el registro vacío | No se envía; se muestran errores en los campos obligatorios. |
| REG-02 | Nombre con números o más de 50 caracteres | Se rechaza. |
| REG-03 | Documento con menos de 6 o más de 10 dígitos | Se rechaza. |
| REG-04 | Celular diferente de 10 dígitos | Se rechaza. |
| REG-05 | Fecha de nacimiento menor de 18 años | Se rechaza. |
| REG-06 | Placa `abc123` | Se convierte a `ABC123` y pasa el formato. |
| REG-07 | Placa con formato incorrecto | Se rechaza. |
| REG-08 | Categoría XL con capacidad 5 | Se rechaza; con 6 debe pasar. |
| REG-09 | Año del vehículo futuro | Se rechaza. |
| REG-10 | Licencia/SOAT vencidos o fecha inválida | Se rechazan. |
| REG-11 | No aceptar términos | No permite enviar el registro. |
| REG-12 | Completar las tres pestañas | Envía el registro y queda `pending`. |
| REG-13 | Salir de Registro y volver | El borrador permanece mientras la app siga abierta. |
| FLOW-01 | Intentar activar disponibilidad sin aprobación | El interruptor permanece bloqueado. |
| FLOW-02 | Simular aprobación y activar disponibilidad | Permite activar disponibilidad. |
| FLOW-03 | Simular solicitud y esperar 15 segundos | La solicitud se rechaza automáticamente. |
| FLOW-04 | Aceptar una solicitud | El viaje queda `accepted`. |
| FLOW-05 | Iniciar ruta al origen | El viaje queda `driver_arriving`. |
| FLOW-06 | Marcar pasajero a bordo | El viaje queda `in_progress`. |
| FLOW-07 | Finalizar viaje | Se crea un registro `completed` y abre Cobro. |
| FLOW-08 | Cancelar antes de pasajero a bordo | Se registra `cancelled`. |
| PAY-01 | Confirmar efectivo recibido | El viaje pasa a `paid` y queda registrado como efectivo recibido. |
| PAY-02 | Simular pago electrónico | El viaje pasa a `paid` con etiqueta de simulación. |
| FARE-01 | 8,5 km, 22 min, Económico, sin propina | Tarifa $19.200; comisión $3.840; ganancia $15.360. |
| FARE-02 | 8,5 km, 22 min, XL, sin propina | Tarifa $26.900; comisión $5.380; ganancia $21.520. |
| HIST-01 | Filtrar historial por hoy/semana/mes | Solo aparecen viajes del periodo. |
| HIST-02 | Filtrar por método de pago | Solo aparecen viajes del método seleccionado. |
| HIST-03 | Seleccionar rango de fechas | Solo aparecen viajes dentro del rango válido. |
| API-01 | `GET /health` | Responde JSON con `ok: true`. |
| API-02 | Checkout sin token | Responde 503 sin exponer secretos. |
| API-03 | Checkout con token de prueba y viaje registrado | Crea preferencia en Mercado Pago sandbox. Requiere red, credenciales de prueba y viaje guardado en backend. |
| API-04 | Webhook de pago | Consulta el pago a Mercado Pago y marca `paid` solo si el proveedor confirma `approved`. |

## Registro de ejecución

| Fecha | ID | Resultado real | Evidencia / observación |
|---|---|---|---|
| Pendiente | — | Aún no ejecutado en dispositivo | Completar al probar con Expo Go. |
