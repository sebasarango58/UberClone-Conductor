import { Text, View } from 'react-native';
import { Button, Card, Heading, styles } from '../components/UI';
import { useDriver } from '../context/DriverContext';
import { cop } from '../utils/calculateFare';
export default function TripScreen({ navigate }) {
 const {trip,passengerOnBoard,finishTrip}=useDriver();
 if(!trip)return <View style={styles.screen}><Heading>No hay viaje activo</Heading><Button title="Volver al inicio" onPress={()=>navigate('Inicio')}/></View>;
 const onBoard=trip.status==='in_progress';
 return <View style={styles.screen}><Heading>{onBoard?'Viaje en curso':'Dirígete al punto de recogida'}</Heading><Text style={styles.subtitle}>Estado: {trip.status}</Text><Card><Heading small>{onBoard?'Destino':'Punto de recogida'}</Heading><Text>{onBoard?trip.destination:trip.origin}</Text><View style={{height:130,backgroundColor:'#E4E7EC',borderRadius:12,alignItems:'center',justifyContent:'center',marginVertical:16}}><Text style={{fontSize:30}}>⌖</Text><Text>La ruta se mostrará con Google Maps</Text></View><Text>Tarifa estimada: {cop(trip.fare)}</Text><Text>Comisión (20 %): {cop(trip.commission)}</Text><Text>Ganancia neta: {cop(trip.driverEarnings)}</Text>{!onBoard?<Button title="Pasajero a bordo" onPress={passengerOnBoard}/>:<Button title="Finalizar viaje" onPress={()=>{finishTrip();navigate('Cobro');}}/>}</Card></View>;
}
