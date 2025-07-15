let socket: WebSocket | null = null;

export function connectSocket(onMessage: (data: any) => void) {
  socket = new WebSocket('ws://localhost:3000');
  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (e) {
      // handle error
    }
  };
}

export function sendCommand(sessionId: string, command: string) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: 'command',
      sessionId,
      command,
    }));
  }
}

export function closeSocket() {
  if (socket) socket.close();
} 