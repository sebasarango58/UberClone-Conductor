import { Text, View } from 'react-native';
import { Button, Card, Heading, styles } from '../components/UI';
import { useDriver } from '../context/DriverContext';
import { cop } from '../utils/calculateFare';

export default function PaymentScreen({ navigate }) {
  const { trips, confirmCashPayment } = useDriver();
  const last = trips[0];
  if (!last) return <View style={styles.screen}><Heading>Resumen del viaje</Heading><Text style={styles.subtitle}>Cuando finalices una carrera, aquí aparecerá su resumen de cobro.</Text><Button title="Volver al inicio" onPress={() => navigate('Inicio')} /></View>;

  const cashPending = last.paymentMethod === 'cash' && last.status !== 'paid';
  return <View style={styles.screen}>
    <Heading>Resumen del viaje</Heading>
    <Text style={styles.subtitle}>Detalle del último viaje finalizado. Los pagos electrónicos requieren la integración del backend y la pasarela.</Text>
    <Card>
      <Heading small>{last.origin} → {last.destination}</Heading>
      <Text>Tarifa: {cop(last.fare)}</Text>
      <Text>Comisión ({Math.round((last.commissionRate || 0.2) * 100)} %): {cop(last.commission)}</Text>
      <Text>Propina: {cop(last.tip)}</Text>
      <Text>Ganancia neta: {cop(last.driverEarnings)}</Text>
      <Text>Medio de pago: {last.paymentMethod === 'cash' ? 'Efectivo' : last.paymentMethod}</Text>
      <Text>Estado del pago: {last.paymentStatus || 'Pendiente'}</Text>
      {cashPending ? <Button title="Confirmar efectivo recibido" onPress={() => confirmCashPayment(last.id)} /> : null}
      <Button title="Ver historial" secondary onPress={() => navigate('Historial')} />
      <Button title="Volver al inicio" secondary onPress={() => navigate('Inicio')} />
    </Card>
  </View>;
}
