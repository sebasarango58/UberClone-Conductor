import { useCallback } from 'react';
import { Text, View } from 'react-native';
import { Button, Card, colors, Heading, styles } from '../components/UI';
import { useDriver } from '../context/DriverContext';
import useTripRequests from '../hooks/useTripRequests';
import { calculateFare, cop } from '../utils/calculateFare';
export default function RequestScreen({ navigate }) {
 const { request, acceptRequest, rejectRequest }=useDriver();
 const seconds=useTripRequests(request,rejectRequest);
 const reject=useCallback(()=>{rejectRequest();navigate('Inicio');},[rejectRequest,navigate]);
 if(!request)return <View style={styles.screen}><Heading>No hay solicitudes</Heading><Text style={styles.subtitle}>Cuando llegue una solicitud aparecerá aquí.</Text><Button title="Volver al inicio" onPress={()=>navigate('Inicio')}/></View>;
 const fare=calculateFare(request);
 return <View style={styles.screen}><Heading>Solicitud entrante</Heading><Text style={styles.subtitle}>Responde antes de que termine el tiempo.</Text><Card><Text style={{color:colors.blue,fontWeight:'800',fontSize:22}}>{seconds} s</Text><Heading small>Origen</Heading><Text>{request.origin}</Text><View style={{height:14}}/><Heading small>Destino</Heading><Text>{request.destination}</Text><View style={{height:14}}/><Text>Distancia: {request.distanceKm} km</Text><Text>Duración estimada: {request.durationMin} min</Text><Text>Categoría: {request.category}</Text><Text>Pago: {request.paymentMethod==='cash'?'Efectivo':request.paymentMethod}</Text><View style={{height:12}}/><Heading small>Tarifa estimada: {cop(fare.fare)}</Heading><Text>Tu ganancia estimada: {cop(fare.driverEarnings)}</Text><Button title="Aceptar viaje" onPress={()=>{acceptRequest();navigate('Viaje');}}/><Button title="Rechazar" secondary onPress={reject}/></Card></View>;
}
