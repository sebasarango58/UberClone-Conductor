// AI-assisted: see docs/AI_LOG.md #3.
import { Image, Text, View } from 'react-native';
import { Button, Card, colors, Heading, styles } from '../components/UI';
import { useDriver } from '../context/DriverContext';
export default function ProfileScreen({ navigate }) {
  const { profile, driverStatus, setDriverStatus, isAvailable, setIsAvailable } = useDriver();
  const approved = driverStatus === 'approved';
  return <View style={styles.screen}><Heading>Perfil y configuración</Heading>
    <Card><Heading small>Datos del conductor</Heading>{profile?.profilePhoto ? <Image source={{ uri: profile.profilePhoto }} style={{ width: 82, height: 82, borderRadius: 41, marginBottom: 10 }} /> : null}
      <Text>Nombre: {profile?.name || 'Aún no registrado'}</Text><Text>Documento: {profile?.document || '—'}</Text><Text>Correo: {profile?.email || '—'}</Text><Text>Vehículo: {profile ? `${profile.brand} ${profile.model} · ${profile.plate}` : '—'}</Text><Text>Idioma: {profile?.language || 'Español'}</Text><Text>Estado: {approved ? 'Aprobado' : profile?.submittedAt ? 'Pendiente de aprobación' : 'Sin registro enviado'}</Text>
      <Button title="Ver / editar registro" onPress={() => navigate('Registro')} />
    </Card>
    <Card><Heading small>Modo de demostración académica</Heading><Text style={styles.subtitle}>Este control simula la decisión de un administrador. No representa una aprobación real de una empresa.</Text>
      <Button title={approved ? 'Dejar pendiente (prueba)' : 'Simular aprobación'} secondary disabled={!profile?.submittedAt} onPress={() => { setIsAvailable(false); setDriverStatus(approved ? 'pending' : 'approved'); }} />
      {!profile?.submittedAt ? <Text style={{ color: colors.gray, fontSize: 12, marginTop: 7 }}>Primero debes enviar el registro completo.</Text> : null}
    </Card>
  </View>;
}