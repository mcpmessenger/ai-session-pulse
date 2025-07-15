const express = require('express');
const router = express.Router();

// In-memory storage for demo
let events = [];

router.get('/', (req, res) => {
  res.json(events);
});

router.post('/', (req, res) => {
  const event = { id: Date.now().toString(), ...req.body };
  events.push(event);
  res.status(201).json(event);
});

module.exports = router; 