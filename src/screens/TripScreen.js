
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Button, Card, Heading, styles } from '../components/UI';
import { useDriver } from '../context/DriverContext';
import { cop } from '../utils/calculateFare';

export default function TripScreen({ navigate }) {
    const { trip, passengerOnBoard, finishTrip } = useDriver();

    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const [routeError, setRouteError] = useState(false);

    const origin = trip?.originLocation;
    const destination = trip?.destinationLocation;

    const hasCoordinates =
        origin?.latitude != null &&
        origin?.longitude != null &&
        destination?.latitude != null &&
        destination?.longitude != null;

    useEffect(() => {
        let active = true;

        async function getRoute() {
            if (!hasCoordinates) {
                setRouteCoordinates([]);
                return;
            }

            try {
                setRouteError(false);

                const url =
                    `https://router.project-osrm.org/route/v1/driving/` +
                    `${origin.longitude},${origin.latitude};` +
                    `${destination.longitude},${destination.latitude}` +
                    `?overview=full&geometries=geojson`;

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error('No se pudo consultar la ruta');
                }

                const data = await response.json();

                if (!data.routes || data.routes.length === 0) {
                    throw new Error('No se encontró una ruta');
                }

                const coordinates = data.routes[0].geometry.coordinates.map(
                    ([longitude, latitude]) => ({
                        latitude,
                        longitude,
                    })
                );

                if (active) {
                    setRouteCoordinates(coordinates);
                }
            } catch (error) {
                console.error('Error calculando la ruta:', error);

                if (active) {
                    setRouteCoordinates([]);
                    setRouteError(true);
                }
            }
        }

        getRoute();

        return () => {
            active = false;
        };
    }, [
        origin?.latitude,
        origin?.longitude,
        destination?.latitude,
        destination?.longitude,
        hasCoordinates,
    ]);

    if (!trip) {
        return (
            <View style={styles.screen}>
                <Heading>No hay viaje activo</Heading>
                <Button
                    title="Volver al inicio"
                    onPress={() => navigate('Inicio')}
                />
            </View>
        );
    }

    const onBoard = trip.status === 'in_progress';
    const target = onBoard ? destination : origin;

    return (
        <View style={styles.screen}>
            <Heading>
                {onBoard
                    ? 'Viaje en curso'
                    : 'Dirígete al punto de recogida'}
            </Heading>

            <Text style={styles.subtitle}>
                Estado: {trip.status}
            </Text>

            <Card>
                <Heading small>
                    {onBoard ? 'Destino' : 'Punto de recogida'}
                </Heading>

                <Text>
                    {onBoard ? trip.destination : trip.origin}
                </Text>

                {hasCoordinates ? (
                    <MapView
                        key={onBoard ? 'destination-map' : 'pickup-map'}
                        style={{
                            height: 280,
                            borderRadius: 12,
                            marginVertical: 16,
                        }}
                        initialRegion={{
                            latitude: target.latitude,
                            longitude: target.longitude,
                            latitudeDelta: 0.025,
                            longitudeDelta: 0.025,
                        }}
                    >
                        <Marker
                            coordinate={origin}
                            title="Punto de recogida"
                            description={trip.origin}
                            pinColor="green"
                        />

                        <Marker
                            coordinate={destination}
                            title="Destino"
                            description={trip.destination}
                            pinColor="red"
                        />

                        {routeCoordinates.length > 0 && (
                            <Polyline
                                coordinates={routeCoordinates}
                                strokeColor="#2563EB"
                                strokeWidth={5}
                            />
                        )}
                    </MapView>
                ) : (
                    <Text>No hay coordenadas disponibles para este viaje.</Text>
                )}

                {routeCoordinates.length > 0 && (
                    <Text style={{ color: 'green', marginBottom: 8 }}>
                        Ruta real calculada correctamente.
                    </Text>
                )}

                {routeError && (
                    <Text style={{ color: 'red', marginBottom: 8 }}>
                        No fue posible calcular la ruta. Intenta nuevamente.
                    </Text>
                )}

                <Text>Tarifa estimada: {cop(trip.fare)}</Text>
                <Text>Comisión (20 %): {cop(trip.commission)}</Text>
                <Text>Ganancia neta: {cop(trip.driverEarnings)}</Text>

                {!onBoard ? (
                    <Button
                        title="Pasajero a bordo"
                        onPress={passengerOnBoard}
                    />
                ) : (
                    <Button
                        title="Finalizar viaje"
                        onPress={() => {
                            finishTrip();
                            navigate('Cobro');
                        }}
                    />
                )}
            </Card>
        </View>
    );
}
