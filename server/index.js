import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.VITE_PROXY_PORT || 3001;
const API_KEY = process.env.VITE_ANTHROPIC_API_KEY;

// Rate limiting simple (en memoria)
const rateLimiter = {
  requests: new Map(),
  maxRequests: 10,
  windowMs: 60000,
  check(ip) {
    const now = Date.now();
    const record = this.requests.get(ip) || { count: 0, start: now };
    if (now - record.start > this.windowMs) {
      record.count = 1;
      record.start = now;
    } else {
      record.count++;
    }
    this.requests.set(ip, record);
    return record.count <= this.maxRequests;
  }
};

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:4173', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'] }));
app.use(express.json({ limit: '1mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Proxy a Claude API
app.post('/api/claude', async (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;
  if (!rateLimiter.check(ip)) {
    return res.status(429).json({ error: 'Demasiadas peticiones. Espera un minuto.' });
  }

  if (!API_KEY || API_KEY === 'sk-ant-TU-API-KEY-AQUI') {
    return res.status(500).json({ error: 'API key no configurada en .env' });
  }

  try {
    const forwardHeaders = {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
    };
    if (req.headers['anthropic-beta']) {
      forwardHeaders['anthropic-beta'] = req.headers['anthropic-beta'];
    }
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: forwardHeaders,
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (err) {
    console.error('Error proxy:', err.message);
    res.status(500).json({ error: `Error de proxy: ${err.message}` });
  }
});

app.listen(PORT, () => {
  console.log(`\n🛰️  SIGINT Backend Proxy activo en http://localhost:${PORT}`);
  console.log(`   API Key: ${API_KEY ? '✅ Configurada' : '❌ NO CONFIGURADA'}`);
  console.log(`   Rate limit: ${rateLimiter.maxRequests} req/min\n`);
});
