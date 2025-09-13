import express from 'express';
import cors from 'cors';
import messagesRouter from './routes/messages.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL
}));
app.use(express.json());

// Routes
app.use('/messages', messagesRouter);

// 404-Handler - Catch-all Route
app.use((req, res) => {
  res.status(404).json({ error: 'Seite nicht gefunden' });
});

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
});
