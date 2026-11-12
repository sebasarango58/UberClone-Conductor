// AI-assisted: see docs/AI_LOG.md #3.
import { useCallback, useState } from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';
import { Button, Card, colors, Heading, styles } from '../components/UI';
import { useDriver } from '../context/DriverContext';
import useDriverLocation from '../hooks/useDriverLocation';
// 1. Importar Firebase y Firestore
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function HomeScreen({ navigate }) {
  const { driverStatus, isAvailable, setIsAvailable, createDemoRequest, request, trip, profile } = useDriver();
  const location = useDriverLocation(isAvailable);
  const [demoPayment, setDemoPayment] = useState('cash');

  // 2. Fusionar el toggle de Kevin con la persistencia en Firebase Cloud Firestore
  const toggle = useCallback(async (value) => { 
    if (driverStatus !== 'approved') return; 
    setIsAvailable(value); // Actualiza la UI de inmediato

    try {
      const driverRef = doc(db, 'drivers', '9IzGBtxzYmculTx7KqDn'); // ID real de Firestore
      await updateDoc(driverRef, {
        isAvailable: value,
        updatedAt: new Date()
      });
      console.log("Disponibilidad sincronizada con Firebase:", value);
    } catch (error) {
      console.error("Error al actualizar disponibilidad en Firebase:", error);
    }
  }, [driverStatus, setIsAvailable]);

  return (
    <ScrollView style={styles.screen}>
      <Text style={styles.badge}>UBERCLONE · CONDUCTOR</Text>
      <Heading>Hola{profile?.name ? `, ${profile.name.split(' ')[0]}` : ', conductor'}</Heading>
      <Text style={styles.subtitle}>Administra tu disponibilidad y tus viajes desde un solo lugar.</Text>
      
      {/* Estado de la cuenta */}
      <Card>
        <Heading small>Estado de la cuenta</Heading>
        <Text style={{ color: driverStatus === 'approved' ? colors.green : colors.gray, fontWeight: '700' }}>
          {driverStatus === 'approved' ? 'Aprobado' : 'Pendiente de aprobación'}
        </Text>
        <Text style={styles.subtitle}>Solo una cuenta aprobada puede ponerse disponible y recibir solicitudes.</Text>
        <Button title="Ver registro" secondary onPress={() => navigate('Registro')} />
      </Card>

      {/* Disponibilidad */}
      <Card>
        <Heading small>Disponibilidad</Heading>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: '700', color: colors.navy }}>
              {isAvailable ? 'Disponible' : 'No disponible'}
            </Text>
            <Text style={{ color: colors.gray, marginTop: 4 }}>
              {driverStatus === 'approved' ? 'Activa o pausa la recepción de solicitudes.' : 'Se activa cuando la cuenta esté aprobada.'}
            </Text>
          </View>
          <Switch 
            value={isAvailable} 
            onValueChange={toggle} 
            disabled={driverStatus !== 'approved'} 
          />
        </View>
      </Card>

      {/* Ubicación del conductor con el hook de Kevin */}
      <Card>
        <Heading small>Ubicación del conductor</Heading>
        <View style={{ height: 135, backgroundColor: '#E4E7EC', borderRadius: 12, alignItems: 'center', justifyContent: 'center', padding: 15 }}>
          <Text style={{ fontSize: 28, color: colors.blue }}>⌖</Text>
          <Text style={{ fontWeight: '700', color: colors.navy }}>Ubicación de demostración</Text>
          <Text style={{ color: colors.gray, textAlign: 'center', marginTop: 5 }}>
            Lat: {location.latitude.toFixed(5)} · Lng: {location.longitude.toFixed(5)}
          </Text>
          <Text style={{ color: colors.gray, fontSize: 11 }}>Actualiza cada 5 segundos mientras estás disponible.</Text>
        </View>
      </Card>

      {request ? (
        <Card>
          <Heading small>Solicitud entrante</Heading>
          <Text>{request.origin} → {request.destination}</Text>
          <Button title="Ver solicitud" onPress={() => navigate('Solicitud')} />
        </Card>
      ) : null}

      {trip ? (
        <Card>
          <Heading small>Viaje activo</Heading>
          <Text>{trip.origin} → {trip.destination}</Text>
          <Button title="Continuar viaje" onPress={() => navigate('Viaje')} />
        </Card>
      ) : null}

      {/* Tipo de pago y simulación de prueba */}
      <Card>
        <Heading small>Tipo de pago para la solicitud de prueba</Heading>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button title="Efectivo" secondary={demoPayment !== 'cash'} onPress={() => setDemoPayment('cash')} />
          <Button title="Mercado Pago" secondary={demoPayment !== 'mercadopago'} onPress={() => setDemoPayment('mercadopago')} />
        </View>
        <Button 
          title="Simular solicitud de prueba" 
          disabled={driverStatus !== 'approved' || !isAvailable || Boolean(request) || Boolean(trip)} 
          onPress={() => { 
            if (createDemoRequest(demoPayment)) navigate('Solicitud'); 
          }} 
        />
      </Card>

      <Text style={[styles.subtitle, { marginTop: 10 }]}>
        La ubicación y las solicitudes sincronizan con servicios externos y Firestore.
      </Text>
      <View style={{ height: 25 }} />
    </ScrollView>
  );
}