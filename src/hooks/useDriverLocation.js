// AI-assisted: see docs/AI_LOG.md #3.

import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export default function useDriverLocation(enabled) {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    updatedAt: null,
  });

  useEffect(() => {
    let subscription = null;
    let active = true;

    async function startLocation() {
      if (!enabled) {
        setLocation({
          latitude: null,
          longitude: null,
          updatedAt: null,
        });
        return;
      }

      try {
        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (!active) return;

        if (status !== 'granted') {
          console.log('Permiso de ubicación denegado.');
          return;
        }

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 5000,
            distanceInterval: 0,
          },
          (position) => {
            if (!active) return;

            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              updatedAt: new Date().toISOString(),
            });
          }
        );
      } catch (error) {
        console.error('Error obteniendo ubicación:', error);
      }
    }

    startLocation();

    return () => {
      active = false;
      subscription?.remove();
    };
  }, [enabled]);

  return location;
}
