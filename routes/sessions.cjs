const express = require('express');
const router = express.Router();

// In-memory storage for demo
let sessions = [];

router.get('/', (req, res) => {
  res.json(sessions);
});

router.post('/', (req, res) => {
  const session = { id: Date.now().toString(), ...req.body };
  sessions.push(session);
  res.status(201).json(session);
});

router.delete('/:id', (req, res) => {
  sessions = sessions.filter(s => s.id !== req.params.id);
  res.status(204).end();
});

module.exports = router; 