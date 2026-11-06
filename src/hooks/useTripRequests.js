import { useEffect, useState } from 'react';

/** Cuenta atrás de 15 segundos; limpia el intervalo al cambiar o salir de la solicitud. */
export default function useTripRequests(request, rejectRequest) {
  const [seconds, setSeconds] = useState(15);

  useEffect(() => {
    if (!request) {
      setSeconds(15);
      return undefined;
    }

    const expiresAt = Date.now() + 15000;
    setSeconds(15);
    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      setSeconds(remaining);
      if (remaining === 0) rejectRequest();
    }, 200);

    return () => clearInterval(timer);
  }, [request?.id, rejectRequest]);

  return seconds;
}