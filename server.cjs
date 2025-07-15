const express = require('express');
const cors = require('cors');
const sessionsRouter = require('./routes/sessions.cjs');
const eventsRouter = require('./routes/events.cjs');
const { spawn } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

// Mount routers
app.use('/api/sessions', sessionsRouter);
app.use('/api/events', eventsRouter);

// Track running agent processes by sessionId
const runningAgents = new Map();

// Endpoint to launch an agent for a session
app.post('/api/agents/:sessionId/start', (req, res) => {
  const sessionId = req.params.sessionId;
  if (runningAgents.has(sessionId)) {
    return res.status(400).json({ error: 'Agent already running for this session' });
  }
  try {
    const agentProcess = spawn('node', ['agent.cjs', sessionId], {
      cwd: __dirname,
      detached: true,
      stdio: 'ignore',
    });
    runningAgents.set(sessionId, agentProcess.pid);
    agentProcess.unref();
    res.json({ status: 'started', sessionId, pid: agentProcess.pid });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Failed to start agent' });
  }
});

// (Optional) Endpoint to check agent status
app.get('/api/agents/:sessionId/status', (req, res) => {
  const sessionId = req.params.sessionId;
  res.json({ running: runningAgents.has(sessionId), pid: runningAgents.get(sessionId) });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`REST API running on http://localhost:${PORT}`));

// --- WebSocket Server Setup ---
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });

// Map of sessionId to agent WebSocket
const agents = new Map();
// Set of frontend WebSockets
const frontends = new Set();

wss.on('connection', (ws) => {
  ws.isAgent = false;
  ws.sessionId = null;

  ws.on('message', (msg) => {
    let data;
    try {
      data = JSON.parse(msg);
    } catch (e) {
      ws.send(JSON.stringify({ type: 'error', error: 'Invalid JSON' }));
      return;
    }

    console.log('Backend received WS message:', data);

    // Agent registration
    if (data.type === 'register' && data.sessionId) {
      ws.isAgent = true;
      ws.sessionId = data.sessionId;
      agents.set(data.sessionId, ws);
      ws.send(JSON.stringify({ type: 'registered', sessionId: data.sessionId }));
      return;
    }

    // Command from frontend to agent
    if (data.type === 'command' && data.sessionId && data.command) {
      console.log('Routing command to agent for session:', data.sessionId);
      const agent = agents.get(data.sessionId);
      if (agent && agent.readyState === WebSocket.OPEN) {
        agent.send(JSON.stringify({ type: 'command', sessionId: data.sessionId, command: data.command }));
      } else {
        ws.send(JSON.stringify({ type: 'error', error: 'Agent not connected' }));
      }
      return;
    }

    // Output from agent to frontend(s)
    if (ws.isAgent && data.type && data.sessionId) {
      // Broadcast to all frontends
      frontends.forEach(fw => {
        if (fw.readyState === WebSocket.OPEN) {
          fw.send(JSON.stringify(data));
        }
      });
      return;
    }
  });

  // Track frontend connections
  if (!ws.isAgent) {
    frontends.add(ws);
  }

  ws.on('close', () => {
    if (ws.isAgent && ws.sessionId) {
      agents.delete(ws.sessionId);
    }
    if (frontends.has(ws)) {
      frontends.delete(ws);
    }
  });
});