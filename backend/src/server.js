// AI-assisted: see docs/AI_LOG.md #3.
import cors from 'cors';
import 'dotenv/config';
import express from 'express';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Almacenamiento temporal en memoria para la demostración. En producción se reemplaza por Firestore/MongoDB.
const trips = new Map();
const payments = new Map();

app.get('/health', (_req, res) => res.json({ ok: true, service: 'uberclone-conductor-api', mode: process.env.NODE_ENV || 'development' }));

app.post('/api/trips', (req, res) => {
  const { tripId, driverId, fare, commission, driverEarnings, paymentMethod } = req.body || {};
  if (!tripId || !Number.isInteger(fare) || fare < 0 || !['cash', 'mercadopago', 'stripe'].includes(paymentMethod)) {
    return res.status(400).json({ error: 'Datos de viaje incompletos o inválidos.' });
  }
  const trip = { ...req.body, status: 'completed', paymentStatus: paymentMethod === 'cash' ? 'pending_cash' : 'pending', createdAt: new Date().toISOString() };
  trips.set(tripId, trip);
  return res.status(201).json({ trip });
});

app.get('/api/trips/:tripId', (req, res) => {
  const trip = trips.get(req.params.tripId);
  if (!trip) return res.status(404).json({ error: 'Viaje no encontrado.' });
  return res.json({ trip });
});

app.post('/api/drivers/:driverId/location', (req, res) => {
  const { latitude, longitude } = req.body || {};
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return res.status(400).json({ error: 'Coordenadas inválidas.' });
  return res.status(202).json({ accepted: true, driverId: req.params.driverId, latitude, longitude, receivedAt: new Date().toISOString() });
});

// Mercado Pago Checkout Pro: el access token solo se lee en el servidor.
app.post('/api/payments/checkout', async (req, res) => {
  const { tripId, amount, description = 'Viaje UberClone' } = req.body || {};
  if (!tripId || !Number.isInteger(amount) || amount < 1) return res.status(400).json({ error: 'tripId y amount entero positivo son obligatorios.' });
  const trip = trips.get(String(tripId));
  if (!trip) return res.status(404).json({ error: 'El viaje no existe en el backend.' });
  if (trip.fare !== amount) return res.status(409).json({ error: 'El monto no coincide con la tarifa guardada del viaje.' });
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token || token.startsWith('REEMPLAZAR')) return res.status(503).json({ error: 'Mercado Pago no está configurado. Añade credenciales de prueba en backend/.env.' });
  try {
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ title: description, quantity: 1, currency_id: 'COP', unit_price: amount }],
        external_reference: String(tripId),
        notification_url: process.env.MERCADOPAGO_WEBHOOK_URL || undefined,
        back_urls: process.env.PAYMENT_SUCCESS_URL ? { success: process.env.PAYMENT_SUCCESS_URL, failure: process.env.PAYMENT_FAILURE_URL || process.env.PAYMENT_SUCCESS_URL, pending: process.env.PAYMENT_PENDING_URL || process.env.PAYMENT_SUCCESS_URL } : undefined,
        auto_return: process.env.PAYMENT_SUCCESS_URL ? 'approved' : undefined,
      }),
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: 'Mercado Pago rechazó la creación del checkout.', details: data.message || data.error || 'Error de proveedor' });
    payments.set(String(data.id), { tripId: String(tripId), preferenceId: String(data.id), status: 'pending' });
    return res.status(201).json({ preferenceId: data.id, checkoutUrl: data.init_point, sandboxCheckoutUrl: data.sandbox_init_point });
  } catch (error) {
    return res.status(502).json({ error: 'No fue posible comunicarse con Mercado Pago.' });
  }
});

// Webhook: se consulta el pago directamente a Mercado Pago antes de actualizar el viaje.
app.post('/api/payments/webhook', async (req, res) => {
  const paymentId = String(req.body?.data?.id || req.query?.['data.id'] || req.query?.id || '');
  if (!paymentId) return res.status(400).json({ error: 'Falta el identificador del pago.' });
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token || token.startsWith('REEMPLAZAR')) return res.status(503).json({ error: 'Pasarela no configurada.' });
  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}`, { headers: { Authorization: `Bearer ${token}` } });
    const payment = await response.json();
    if (!response.ok) return res.status(502).json({ error: 'No se pudo verificar el pago con Mercado Pago.' });
    const tripId = String(payment.external_reference || '');
    const trip = trips.get(tripId);
    if (trip && payment.status === 'approved') {
      trip.status = 'paid'; trip.paymentStatus = 'approved'; trip.paymentId = String(payment.id); trip.paidAt = new Date().toISOString();
      trips.set(tripId, trip);
    }
    payments.set(String(paymentId), { tripId, status: payment.status });
    return res.status(200).json({ received: true, paymentStatus: payment.status, tripUpdated: Boolean(trip && payment.status === 'approved') });
  } catch {
    return res.status(502).json({ error: 'Error verificando la notificación.' });
  }
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`UberClone API escuchando en http://localhost:${port}`));