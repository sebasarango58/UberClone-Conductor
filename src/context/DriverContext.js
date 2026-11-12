// AI-assisted: see docs/AI_LOG.md #3.
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { calculateFare } from '../utils/calculateFare';

const DriverContext = createContext(null);
const demoRequest = {
  id: 'demo-trip-001', origin: 'Parque de El Poblado, Medellín', destination: 'Aeropuerto Olaya Herrera, Medellín',
  distanceKm: 8.5, durationMin: 22, category: 'economy', paymentMethod: 'cash', status: 'requested', createdAt: new Date().toISOString(),
};

export function DriverProvider({ children }) {
  const [driverStatus, setDriverStatus] = useState('pending');
  const [isAvailableState, setIsAvailableState] = useState(false);
  const [request, setRequest] = useState(null);
  const [trip, setTrip] = useState(null);
  const [trips, setTrips] = useState([]);
  const [profile, setProfile] = useState(null);
  const [registrationDraft, setRegistrationDraft] = useState(null);

  const setIsAvailable = useCallback(value => {
    if (driverStatus !== 'approved' || trip || request) return;
    setIsAvailableState(Boolean(value));
  }, [driverStatus, trip, request]);

  const createDemoRequest = useCallback((paymentMethod = 'cash') => {
    if (driverStatus !== 'approved' || !isAvailable || trip || request) return false;
    setRequest({ ...demoRequest, paymentMethod, id: `demo-${Date.now()}`, createdAt: new Date().toISOString() });
    return true;
  }, [driverStatus, isAvailable, trip, request]);

  const acceptRequest = useCallback(() => {
    if (!request || driverStatus !== 'approved') return false;
    const amounts = calculateFare(request);
    setTrip({ ...request, ...amounts, status: 'accepted', acceptedAt: new Date().toISOString() });
    setRequest(null); setIsAvailableState(false); return true;
  }, [request, driverStatus]);

  const rejectRequest = useCallback(() => setRequest(null), []);
  const startToPickup = useCallback(() => setTrip(current => current && current.status === 'accepted' ? { ...current, status: 'driver_arriving', startedToPickupAt: new Date().toISOString() } : current), []);
  const cancelTrip = useCallback(() => {
    if (!trip || !['accepted', 'driver_arriving'].includes(trip.status)) return;
    setTrips(previous => [{ ...trip, status: 'cancelled', paymentStatus: 'No aplica', completedAt: new Date().toISOString() }, ...previous]);
    setTrip(null);
  }, [trip]);
  const passengerOnBoard = useCallback(() => setTrip(current => current ? { ...current, status: 'in_progress', passengerOnBoardAt: new Date().toISOString() } : null), []);
  const finishTrip = useCallback(() => {
    if (!trip || trip.status !== 'in_progress') return null;
    const completed = { ...trip, status: 'completed', paymentStatus: trip.paymentMethod === 'cash' ? 'Pendiente de confirmación' : 'Pendiente', completedAt: new Date().toISOString() };
    setTrips(previous => [completed, ...previous]); setTrip(null); return completed;
  }, [trip]);
  const confirmCashPayment = useCallback(tripId => {
    setTrips(previous => previous.map(item => item.id === tripId && item.paymentMethod === 'cash'
      ? { ...item, status: 'paid', paymentStatus: 'Efectivo recibido', paidAt: new Date().toISOString() } : item));
  }, []);

  const simulateElectronicPayment = useCallback(tripId => {
    setTrips(previous => previous.map(item => item.id === tripId && item.paymentMethod !== 'cash'
      ? { ...item, status: 'paid', paymentStatus: 'Aprobado (simulación)', paymentId: `demo-payment-${tripId}`, paidAt: new Date().toISOString() } : item));
  }, []);

  const value = useMemo(() => ({ driverStatus, setDriverStatus, isAvailable, setIsAvailable, request, setRequest, trip, setTrip, trips, profile, setProfile, registrationDraft, setRegistrationDraft, createDemoRequest, acceptRequest, rejectRequest, startToPickup, cancelTrip, passengerOnBoard, finishTrip, confirmCashPayment, simulateElectronicPayment }),
    [driverStatus, isAvailable, setIsAvailable, request, trip, trips, profile, registrationDraft, createDemoRequest, acceptRequest, rejectRequest, startToPickup, cancelTrip, passengerOnBoard, finishTrip, confirmCashPayment, simulateElectronicPayment]);
  return <DriverContext.Provider value={value}>{children}</DriverContext.Provider>;
}

export function useDriver() {
  const context = useContext(DriverContext);
  if (!context) throw new Error('useDriver debe usarse dentro de DriverProvider.');
  return context;
}