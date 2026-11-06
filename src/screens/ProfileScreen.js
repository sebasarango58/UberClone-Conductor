import { Text, View } from 'react-native';
import { Button, Card, Heading, styles } from '../components/UI';
import { useDriver } from '../context/DriverContext';

export default function ProfileScreen({ navigate }) {
  const { profile, driverStatus, setDriverStatus } = useDriver();

  return (
    <View style={styles.screen}>
      <Heading>Perfil y configuración</Heading>
      
      <Card>
        <Heading small>Datos del conductor</Heading>
        <Text>Nombre: {profile?.name || 'Aún no registrado'}</Text>
        <Text>Correo: {profile?.email || '—'}</Text>
        <Text>Vehículo: {profile ? `${profile.brand} ${profile.model} · ${profile.plate}` : '—'}</Text>
        <Text>Idioma: {profile?.language || 'Español'}</Text>
        <Text>Estado: {driverStatus === 'approved' ? 'Aprobado' : 'Pendiente de aprobación'}</Text>
        <Button title="Editar / completar registro" onPress={() => navigate('Registro')} />
      </Card>

      <Card>
        <Heading small>Segunda Parte</Heading>
        <Text>
          Continuará...
        </Text>
        <Button title="Simular aprobación" secondary onPress={() => setDriverStatus('approved')} />
      </Card>
    </View>
  );
}