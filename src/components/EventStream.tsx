
import { useEffect, useState } from 'react';
import { connectSocket, closeSocket } from '@/lib/socket';

interface EventStreamProps {
  searchQuery: string;
  selectedSession: string | null;
}

export const EventStream = ({ searchQuery, selectedSession }: EventStreamProps) => {
  const [output, setOutput] = useState<string[]>([]);

  useEffect(() => {
    if (!selectedSession) return;
    setOutput([]); // Clear output when session changes
    connectSocket((data) => {
      console.log('EventStream received WS data:', data);
      if (data.type === 'output' && data.sessionId === selectedSession) {
        setOutput((prev) => [...prev, data.content]);
      }
      // Optionally handle error, close, etc.
    });
    return () => closeSocket();
  }, [selectedSession]);

  return (
    <div className="event-stream">
      {output.length === 0 ? (
        <div className="text-gray-500">No output yet.</div>
      ) : (
        output.map((line, idx) => <div key={idx} className="whitespace-pre-wrap">{line}</div>)
      )}
    </div>
  );
};
