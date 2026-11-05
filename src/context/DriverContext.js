import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { calculateFare } from '../utils/calculateFare';

const DriverContext = createContext(null);
const demoRequest = {
  id: 'demo-trip-001',
  origin: 'Parque de El Poblado',
  destination: 'Aeropuerto Olaya Herrera',
  distanceKm: 8.5,
  durationMin: 22,
  category: 'economy',
  paymentMethod: 'cash',
  createdAt: new Date().toISOString(),
};

export function DriverProvider({ children }) {
  const [driverStatus, setDriverStatus] = useState('pending');
  const [isAvailable, setIsAvailableState] = useState(false);
  const [request, setRequest] = useState(null);
  const [trip, setTrip] = useState(null);
  const [trips, setTrips] = useState([]);
  const [profile, setProfile] = useState(null);

  const setIsAvailable = useCallback((value) => {
    if (driverStatus !== 'approved') return;
    setIsAvailableState(Boolean(value));
  }, [driverStatus]);

  const createDemoRequest = useCallback(() => {
    if (driverStatus !== 'approved' || !isAvailable || trip || request) return false;
    setRequest({ ...demoRequest, id: `demo-${Date.now()}`, createdAt: new Date().toISOString() });
    return true;
  }, [driverStatus, isAvailable, trip, request]);

  const acceptRequest = useCallback(() => {
    if (!request || driverStatus !== 'approved') return false;
    const amounts = calculateFare(request);
    setTrip({ ...request, ...amounts, status: 'driver_arriving', acceptedAt: new Date().toISOString() });
    setRequest(null);
    setIsAvailableState(false);
    return true;
  }, [request, driverStatus]);

  const rejectRequest = useCallback(() => setRequest(null), []);

  const passengerOnBoard = useCallback(() => {
    setTrip(current => current ? { ...current, status: 'in_progress', passengerOnBoardAt: new Date().toISOString() } : null);
  }, []);

  const finishTrip = useCallback(() => {
    if (!trip || trip.status !== 'in_progress') return null;
    const completed = {
      ...trip,
      status: 'completed',
      paymentStatus: trip.paymentMethod === 'cash' ? 'Efectivo' : 'Pendiente',
      completedAt: new Date().toISOString(),
      commissionRate: trip.commissionRate,
    };
    setTrips(previous => [completed, ...previous]);
    setTrip(null);
    return completed;
  }, [trip]);

  const confirmCashPayment = useCallback((tripId) => {
    setTrips(previous => previous.map(item => item.id === tripId && item.paymentMethod === 'cash'
      ? { ...item, status: 'paid', paymentStatus: 'Efectivo', paidAt: new Date().toISOString() }
      : item));
  }, []);

  const value = useMemo(() => ({
    driverStatus, setDriverStatus, isAvailable, setIsAvailable,
    request, setRequest, trip, setTrip, trips, profile, setProfile,
    createDemoRequest, acceptRequest, rejectRequest, passengerOnBoard,
    finishTrip, confirmCashPayment,
  }), [driverStatus, isAvailable, setIsAvailable, request, trip, trips, profile,
    createDemoRequest, acceptRequest, rejectRequest, passengerOnBoard, finishTrip, confirmCashPayment]);

  return <DriverContext.Provider value={value}>{children}</DriverContext.Provider>;
}

export function useDriver() {
  const context = useContext(DriverContext);
  if (!context) throw new Error('useDriver debe usarse dentro de DriverProvider.');
  return context;
}