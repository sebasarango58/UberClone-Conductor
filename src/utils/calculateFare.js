import { PRICING } from '../config/pricing';

/**
 * Calcula tarifa, comisión y ganancia del conductor.
 * La propina no hace parte de la tarifa ni de la comisión: va completa al conductor.
 */
export function calculateFare({ distanceKm, durationMin, category = 'economy', tip = 0 }) {
  const distance = Number(distanceKm);
  const duration = Number(durationMin);
  const gratuity = Number(tip);
  if (![distance, duration, gratuity].every(Number.isFinite) || distance < 0 || duration < 0 || gratuity < 0) {
    throw new Error('La distancia, duración y propina deben ser números válidos no negativos.');
  }

  const multiplier = PRICING.categoryMultipliers[category];
  if (!multiplier) throw new Error('Categoría de vehículo no válida.');

  const calculated = (PRICING.baseFare + distance * PRICING.perKm + duration * PRICING.perMinute) * multiplier;
  const fare = Math.max(PRICING.minimumFare, Math.round(calculated / 100) * 100);
  const commission = Math.round(fare * PRICING.commissionRate);
  const tipAmount = Math.round(gratuity);

  return {
    fare,
    commission,
    driverEarnings: fare - commission + tipAmount,
    commissionRate: PRICING.commissionRate,
    tip: tipAmount,
  };
}

export const cop = value => new Intl.NumberFormat('es-CO', {
  style: 'currency', currency: 'COP', maximumFractionDigits: 0,
}).format(Number(value) || 0);