import { ScrollView, Text } from 'react-native';
import { Card, Heading, styles } from '../components/UI';
import { useDriver } from '../context/DriverContext';
import useEarnings from '../hooks/useEarnings';
import { cop } from '../utils/calculateFare';

export default function EarningsScreen() {
  const { trips } = useDriver();
  const all = useEarnings(trips);

  return (
    <ScrollView style={styles.screen}>
      <Heading>Ganancias</Heading>
      <Text style={styles.subtitle}>
        Resumen calculado sobre el historial disponible en este dispositivo.
      </Text>

      {[
        ['Hoy', all.today],
        ['Esta semana', all.week],
        ['Este mes', all.month],
      ].map(([label, v]) => (
        <Card key={label}>
          <Heading small>{label}</Heading>
          <Text>Viajes: {v.count}</Text>
          <Text>Total facturado: {cop(v.totalFare)}</Text>
          <Text>Comisiones: {cop(v.commission)}</Text>
          <Text>Propinas: {cop(v.tips)}</Text>
          <Text>Ganancia neta: {cop(v.net)}</Text>
          <Text>Promedio por viaje: {cop(v.average)}</Text>
        </Card>
      ))}
    </ScrollView>
  );
}