import { useState } from 'react';
import { Pressable, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from './src/components/UI';
import { DriverProvider } from './src/context/DriverContext';
import EarningsScreen from './src/screens/EarningsScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import HomeScreen from './src/screens/HomeScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import RegistrationScreen from './src/screens/RegistrationScreen';
import RequestScreen from './src/screens/RequestScreen';
import TripScreen from './src/screens/TripScreen';

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

const nav = [['Inicio', 'Inicio'], ['Historial', 'Historial'], ['Ganancias', 'Ganancias'], ['Perfil', 'Perfil']];

function AppShell() {
  const [screen, setScreen] = useState('Inicio'); 
  const Screen = screens[screen] || HomeScreen; 

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar barStyle="dark-content" />
      <View style={{ paddingHorizontal: 18, paddingTop: 8, paddingBottom: 10, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#EAECF0', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 17, fontWeight: '900', color: colors.navy }}>UberClone</Text>
        <Text style={{ fontSize: 12, color: colors.gray }}>CONDUCTOR · DEMO</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Screen navigate={setScreen} />
      </View>
      <View style={{ flexDirection: 'row', backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#EAECF0', paddingVertical: 8 }}>
        {nav.map(([key, label]) => (
          <Pressable key={key} onPress={() => setScreen(key)} style={{ flex: 1, alignItems: 'center', padding: 6 }}>
            <Text style={{ fontSize: 12, fontWeight: screen === key ? '800' : '500', color: screen === key ? colors.blue : colors.gray }}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

export default function App() { 
  return (
    <DriverProvider>
      <AppShell />
    </DriverProvider>
  ); 
}