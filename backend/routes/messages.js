import express from 'express';
import { randomUUID } from 'crypto';
import { readMessages, writeMessages } from '../utils/fileUtils.js';

const router = express.Router();

// GET /messages - Liste der Einträge zurückschicken
router.get('/', async (req, res, next) => {
  try {
    const messages = await readMessages();
    res.json(messages);
  } catch (error) {
    next(error);
  }
});

// POST /messages - Neuen Eintrag erstellen
router.post('/', async (req, res, next) => {
  try {
    const { name, message } = req.body;
    
    // Validierung
    if (!name || !message) {
      return res.status(400).json({ error: 'Name und Message sind erforderlich' });
    }
    
    const messages = await readMessages();
    const newMessage = {
      id: randomUUID(),
      name: name.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString()
    };
    
    messages.push(newMessage);
    await writeMessages(messages);
    
    res.status(201).json(newMessage);
  } catch (error) {
    next(error);
  }
});

// PUT /messages/:id - Komplett ersetzen (Name + Message)
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, message } = req.body;
    
    // Validierung
    if (!name || !message) {
      return res.status(400).json({ error: 'Name und Message sind erforderlich' });
    }
    
    const messages = await readMessages();
    const messageIndex = messages.findIndex(msg => msg.id === id);
    
    if (messageIndex === -1) {
      return res.status(404).json({ error: 'Message nicht gefunden' });
    }
    
    // Komplett ersetzen, aber ID und createdAt beibehalten
    messages[messageIndex] = {
      ...messages[messageIndex],
      name: name.trim(),
      message: message.trim(),
      updatedAt: new Date().toISOString()
    };
    
    await writeMessages(messages);
    res.json(messages[messageIndex]);
  } catch (error) {
    next(error);
  }
});

// DELETE /messages/:id - Eintrag löschen
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const messages = await readMessages();
    const messageIndex = messages.findIndex(msg => msg.id === id);
    
    if (messageIndex === -1) {
      return res.status(404).json({ error: 'Message nicht gefunden' });
    }
    
    messages.splice(messageIndex, 1);
    await writeMessages(messages);
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// PATCH /messages/:id - Einzelne Felder ändern (Extra-Credit 😉)
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, message } = req.body;
    
    const messages = await readMessages();
    const messageIndex = messages.findIndex(msg => msg.id === id);
    
    if (messageIndex === -1) {
      return res.status(404).json({ error: 'Message nicht gefunden' });
    }
    
    // Nur vorhandene Felder aktualisieren
    if (name !== undefined) {
      messages[messageIndex].name = name.trim();
    }
    if (message !== undefined) {
      messages[messageIndex].message = message.trim();
    }
    
    messages[messageIndex].updatedAt = new Date().toISOString();
    
    await writeMessages(messages);
    res.json(messages[messageIndex]);
  } catch (error) {
    next(error);
  }
});

export default router;
