import cors from 'cors';
import 'dotenv/config';
import express from 'express';
const app = express();
app.use(cors());
app.use(express.json());
app.get('/health', (_req, res) => res.json({ ok: true, service: 'uberclone-conductor-api', mode: process.env.NODE_ENV || 'development' }));
app.post('/api/payments/checkout', (_req, res) => {
  // Integración pendiente: crear preferencia con SDK oficial usando ACCESS_TOKEN solo en backend.
  if (!process.env.MERCADOPAGO_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN.startsWith('REEMPLAZAR')) {
    return res.status(503).json({ error: 'Pasarela no configurada. Añade credenciales de prueba al .env del backend.' });
  }
  return res.status(501).json({ error: 'La creación de Checkout Pro se implementará en la fase de integración.' });
});
const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`UberClone API escuchando en http://localhost:${port}`));