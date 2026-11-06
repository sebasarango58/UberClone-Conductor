1. Estructura principal y navegación
Bloque de código trabajado:
const screens = {
  Inicio: HomeScreen,
  Registro: RegistrationScreen,
  Solicitud: RequestScreen,
  Viaje: TripScreen,
  Ganancias: EarningsScreen,
  Historial: HistoryScreen,
  Perfil: ProfileScreen,
  Cobro: PaymentScreen
};

¿Cómo utilicé la IA?
Le pedí ayuda a la IA para entender cómo organizar las diferentes pantallas de la aplicación y cómo hacer que se pudieran mostrar desde un mismo archivo.
¿Qué aprendí?
Entendí que podemos tener cada pantalla organizada por separado y después conectarlas desde el archivo principal. Esto ayuda a que el proyecto sea más ordenado y fácil de mantener.
2. Manejo de la navegación con useState
Bloque de código trabajado:
function AppShell() {
  const [screen, setScreen] = useState('Inicio');

  const Screen = screens[screen] || HomeScreen;

  return (
    <View style={{ flex: 1 }}>
      <Screen navigate={setScreen} />
    </View>
  );
}

¿Cómo utilicé la IA?
Solicité una explicación de cómo cambiar entre pantallas sin tener que crear un archivo diferente para cada navegación.
¿Qué aprendí?
Comprendí que useState nos permite guardar cuál pantalla está activa. Cuando cambia su valor, React Native actualiza lo que se muestra en la aplicación.
3. Protección del espacio de la barra de estado
Bloque de código trabajado:
import { SafeAreaView } from
  'react-native-safe-area-context';

<SafeAreaView style={{ flex: 1 }}>
  <StatusBar barStyle="dark-content" />
  {/* Contenido de la aplicación */}
</SafeAreaView>

¿Cómo utilicé la IA?
Al probar la aplicación en mi celular, noté que el título UberClone aparecía demasiado arriba y se mezclaba con la barra de notificaciones. Le compartí el código a la IA para identificar el problema.
¿Qué aprendí?
Aprendí la importancia de utilizar las áreas seguras del dispositivo para evitar que los elementos de la aplicación queden debajo de la barra de estado. Después de realizar el cambio, comprobé el resultado en mi celular.
4. Configuración y compatibilidad del proyecto
Comandos utilizados con apoyo de IA:
npx expo install babel-preset-expo

npx expo install --check

npx expo start -c

¿Cómo utilicé la IA?
Cuando intenté ejecutar el proyecto aparecieron errores relacionados con las dependencias y la versión de Expo. Compartí los mensajes de error para recibir orientación sobre cómo solucionarlos.
¿Qué aprendí?
Entendí que las versiones de las dependencias deben ser compatibles con la versión de Expo que utiliza el proyecto. También aprendí a instalar los paquetes necesarios y a limpiar la caché cuando se presentan problemas al iniciar la aplicación.