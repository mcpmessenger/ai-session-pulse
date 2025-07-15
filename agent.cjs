const WebSocket = require('ws');
const { spawn } = require('child_process');

// Unique session ID for this agent (could be generated or passed as an argument)
const sessionId = process.argv[2] || 'session-1';

// Connect to the backend WebSocket server (now on port 3000)
const ws = new WebSocket('ws://localhost:3000');

ws.on('open', () => {
  console.log(`Agent for ${sessionId} connected to backend`);
  // Optionally, register with the backend
  ws.send(JSON.stringify({ type: 'register', sessionId }));
});

ws.on('message', (message) => {
  console.log('Agent received message:', message);
  let parsed;
  try {
    parsed = JSON.parse(message);
  } catch (e) {
    console.error('Invalid JSON from backend:', message);
    return;
  }

  // Only handle commands for this session
  if (parsed.sessionId !== sessionId || parsed.type !== 'command') return;

  const command = parsed.command;
  console.log(`Executing command for ${sessionId}: ${command}`);

  const shell = spawn(command, { shell: true });

  shell.stdout.on('data', (data) => {
    ws.send(JSON.stringify({ sessionId, type: 'output', content: data.toString() }));
  });

  shell.stderr.on('data', (data) => {
    ws.send(JSON.stringify({ sessionId, type: 'error', content: data.toString() }));
  });

  shell.on('close', (code) => {
    ws.send(JSON.stringify({ sessionId, type: 'close', content: `Process exited with code ${code}` }));
  });
}); 