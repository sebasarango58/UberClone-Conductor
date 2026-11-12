// AI-assisted: see docs/AI_LOG.md #3.
import { useEffect, useState } from 'react';

// Simulación local de ubicación para demostración sin permisos ni API externa.
// Para GPS real debe sustituirse por expo-location y guardar las coordenadas en backend.
export default function useDriverLocation(enabled) {
  const [location, setLocation] = useState({ latitude: 6.2088, longitude: -75.5670, updatedAt: null });
  useEffect(() => {
    if (!enabled) return undefined;
    const timer = setInterval(() => setLocation(current => ({
      latitude: current.latitude + 0.00001,
      longitude: current.longitude + 0.00001,
      updatedAt: new Date().toISOString(),
    })), 5000);
    return () => clearInterval(timer);
  }, [enabled]);
  return location;
}
