import { useCallback } from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';
import { Button, Card, colors, Heading, styles } from '../components/UI';
import { useDriver } from '../context/DriverContext';

export default function HomeScreen({ navigate }) {
  const { 
    driverStatus, 
    isAvailable, 
    setIsAvailable, 
    createDemoRequest, 
    request, 
    trip 
  } = useDriver();

  const toggle = useCallback(value => { 
    if (driverStatus !== 'approved') return; 
    setIsAvailable(value); 
  }, [driverStatus, setIsAvailable]);

  return (
    <ScrollView style={styles.screen}>
      <Text style={styles.badge}>UBERCLONE · CONDUCTOR</Text>
      <Heading>Hola, conductor</Heading>
      <Text style={styles.subtitle}>
        Administra tu disponibilidad y tus viajes desde un solo lugar.
      </Text>

      {/* Estado de la cuenta */}
      <Card>
        <Heading small>Estado de la cuenta</Heading>
        <Text style={{ color: driverStatus === 'approved' ? colors.green : colors.gray }}>
          {driverStatus === 'approved' ? 'Aprobado' : 'Pendiente de aprobación'}
        </Text>
        <Text style={styles.subtitle}>
          Para conectarte y recibir viajes, tu registro debe estar aprobado.
        </Text>
        <Button 
          title="Completar registro" 
          onPress={() => navigate('Registro')} 
          secondary 
        />
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
              {driverStatus === 'approved' ? 'Controla si puedes recibir solicitudes.' : 'Se activa al aprobar la cuenta.'}
            </Text>
          </View>
          <Switch 
            value={isAvailable} 
            onValueChange={toggle} 
            disabled={driverStatus !== 'approved'} 
          />
        </View>
      </Card>

      {/* Mapa y ubicación */}
      <Card>
        <Heading small>Mapa y ubicación</Heading>
        <View style={{ height: 150, backgroundColor: '#E4E7EC', borderRadius: 12, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <Text style={{ fontSize: 30 }}>⌖</Text>
          <Text style={{ fontWeight: '700', color: colors.navy }}>Vista previa del mapa</Text>
          <Text style={{ textAlign: 'center', color: colors.gray, marginTop: 4 }}>
            La ubicación GPS y Google Maps se conectarán en la siguiente fase.
          </Text>
        </View>
      </Card>

      {/* Solicitud entrante */}
      {request ? (
        <Card>
          <Heading small>Solicitud entrante</Heading>
          <Text>{request.origin} → {request.destination}</Text>
          <Button 
            title="Ver solicitud" 
            onPress={() => navigate('Solicitud')} 
          />
        </Card>
      ) : null}

      {/* Viaje activo */}
      {trip ? (
        <Card>
          <Heading small>Viaje activo</Heading>
          <Text>{trip.origin} → {trip.destination}</Text>
          <Button 
            title="Continuar viaje" 
            onPress={() => navigate('Viaje')} 
          />
        </Card>
      ) : null}

      {/* Botón de prueba y mensajes de estado */}
      <Button 
        title="Simular solicitud de prueba" 
        secondary 
        disabled={driverStatus !== 'approved' || !isAvailable || Boolean(request) || Boolean(trip)} 
        onPress={() => { 
          const created = createDemoRequest(); 
          if (created) navigate('Solicitud'); 
        }} 
      />

      {driverStatus !== 'approved' ? (
        <Text style={styles.subtitle}>Para probar solicitudes, primero simula la aprobación desde Perfil.</Text>
      ) : !isAvailable ? (
        <Text style={styles.subtitle}>Activa tu disponibilidad para recibir una solicitud de prueba.</Text>
      ) : null}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}