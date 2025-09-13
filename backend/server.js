import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import messagesRouter from './routes/messages.js';

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*'
}));
app.use(express.json());

// Serve static files from React build (for production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
}

// API Routes
app.use('/api/messages', messagesRouter);

// Serve React app for all non-API routes (for production)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

// 404-Handler - Catch-all Route (for development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res) => {
    res.status(404).json({ error: 'Seite nicht gefunden' });
  });
}

// Allgemeiner Error-Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Serverfehler' });
});

// Server starten
app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf Port ${PORT}`);
  console.log(`📁 Daten werden gespeichert in: ${process.env.DATA_FILE || 'messages.json'}`);
  console.log(`🌐 CORS erlaubt für: ${process.env.FRONTEND_URL || 'alle Origins'}`);
  console.log(`🏗️ Environment: ${process.env.NODE_ENV || 'development'}`);
});
