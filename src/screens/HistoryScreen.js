import { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { Card, colors, Heading, styles } from '../components/UI';
import { useDriver } from '../context/DriverContext';
import { cop } from '../utils/calculateFare';

export default function HistoryScreen() {
  const { trips } = useDriver();
  const [filter, setFilter] = useState('all');

  const data = useMemo(
    () => trips.filter(t => filter === 'all' || t.paymentMethod === filter),
    [trips, filter]
  );

  return (
    <View style={styles.screen}>
      <Heading>Historial de carreras</Heading>

      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
        {[
          ['all', 'Todos'],
          ['cash', 'Efectivo'],
          ['mercadopago', 'Mercado Pago'],
          ['stripe', 'Stripe'],
        ].map(([k, l]) => (
          <Pressable
            key={k}
            onPress={() => setFilter(k)}
            style={{
              padding: 8,
              borderRadius: 8,
              backgroundColor: filter === k ? colors.blue : 'white',
            }}
          >
            <Text style={{ fontSize: 12, color: filter === k ? 'white' : colors.navy }}>
              {l}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={data}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Card>
            <Text>No hay viajes para este filtro.</Text>
          </Card>
        }
        renderItem={({ item }) => (
          <Card>
            <Heading small>
              {item.origin} → {item.destination}
            </Heading>
            <Text>
              {new Date(item.completedAt || item.createdAt).toLocaleString('es-CO')}
            </Text>
            <Text>
              Tarifa: {cop(item.fare)} · Ganancia: {cop(item.driverEarnings)}
            </Text>
            <Text>Pago: {item.paymentStatus || 'Pendiente'}</Text>
          </Card>
        )}
      />
    </View>
  );
}