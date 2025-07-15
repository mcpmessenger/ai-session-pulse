
import { useState } from "react";
import { Terminal, Play, Square, Pause, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSession, updateSession, deleteSession } from '@/lib/api';
import { createEvent } from '@/lib/api';
import { sendCommand } from '@/lib/socket';

interface Session {
  id: string;
  name: string;
  status: "running" | "paused" | "stopped";
  type: "claude" | "gemini";
  lastActivity: string;
}

interface SessionPanelProps {
  sessions: Session[];
  selectedSession: string | null;
  onSessionSelect: (sessionId: string | null) => void;
}

export const SessionPanel = ({ sessions, selectedSession, onSessionSelect }: SessionPanelProps) => {
  const [command, setCommand] = useState("");
  const [showNewModal, setShowNewModal] = useState(false);
  const [newSession, setNewSession] = useState({ name: '', type: 'claude' });
  const queryClient = useQueryClient();
  const [agentLoading, setAgentLoading] = useState<string | null>(null);
  const [agentError, setAgentError] = useState<string | null>(null);
  const [agentSuccess, setAgentSuccess] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: createSession,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sessions'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateSession(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sessions'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSession,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sessions'] }),
  });

  const createEventMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  });

  const startAgent = async (sessionId: string) => {
    setAgentLoading(sessionId);
    setAgentError(null);
    setAgentSuccess(null);
    try {
      // Use the backend server's IP address for the API call
      const res = await fetch(`http://192.168.4.22:3000/api/agents/${sessionId}/start`, { method: 'POST' });
      let data = {};
      try {
        data = await res.json();
      } catch {
        data = { error: 'Empty or invalid response from server' };
      }
      if (!res.ok) throw new Error(data.error || 'Failed to start agent');
      setAgentSuccess('Agent started!');
    } catch (e: any) {
      setAgentError(e.message);
    } finally {
      setAgentLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "text-green-400 border-green-400";
      case "paused": return "text-yellow-400 border-yellow-400";
      case "stopped": return "text-red-400 border-red-400";
      default: return "text-gray-400 border-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running": return <Play className="h-3 w-3 fill-current" />;
      case "paused": return <Pause className="h-3 w-3" />;
      case "stopped": return <Square className="h-3 w-3 fill-current" />;
      default: return <Square className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Active Sessions
            </CardTitle>
            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => setShowNewModal(true)}>
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`relative p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                selectedSession === session.id
                  ? "border-green-400 bg-green-400/5"
                  : "border-gray-600 hover:border-gray-500 bg-gray-800/50"
              }`}
              onClick={() => onSessionSelect(selectedSession === session.id ? null : session.id)}
            >
              {selectedSession === session.id && (
                <GlowingEffect
                  spread={30}
                  glow={true}
                  disabled={false}
                  proximity={32}
                  inactiveZone={0.01}
                  borderWidth={1}
                />
              )}
              
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-medium">{session.name}</h3>
                <Badge 
                  variant="outline" 
                  className={`${getStatusColor(session.status)} bg-transparent`}
                >
                  {getStatusIcon(session.status)}
                  <span className="ml-1 capitalize">{session.status}</span>
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className={`capitalize ${session.type === 'claude' ? 'text-orange-400' : 'text-blue-400'}`}>
                  {session.type}
                </span>
                <span className="text-gray-400">{session.lastActivity}</span>
              </div>
              
              <div className="flex gap-1 mt-2">
                <Button size="sm" variant="ghost" className="h-6 px-2 text-xs hover:bg-green-400/10">
                  <Play className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-6 px-2 text-xs hover:bg-yellow-400/10">
                  <Pause className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-6 px-2 text-xs hover:bg-red-400/10"
                  onClick={e => {
                    e.stopPropagation();
                    if (window.confirm('Delete this session?')) {
                      deleteMutation.mutate(session.id);
                    }
                  }}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
                <button
                  onClick={() => startAgent(session.id)}
                  disabled={agentLoading === session.id}
                  style={{ marginLeft: 8 }}
                >
                  {agentLoading === session.id ? 'Starting...' : 'Start Agent'}
                </button>
                {agentError && <div style={{ color: 'red' }}>{agentError}</div>}
                {agentSuccess && <div style={{ color: 'green' }}>{agentSuccess}</div>}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Command Input */}
      {selectedSession && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">Send Command</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter command..."
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                className="bg-black border-gray-600 text-green-400 font-mono"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && command.trim()) {
                    sendCommand(selectedSession, command);
                    setCommand('');
                  }
                }}
              />
              <Button 
                onClick={() => {
                  if (selectedSession && command.trim()) {
                    sendCommand(selectedSession, command);
                    setCommand("");
                  }
                }}
                className="bg-green-600 hover:bg-green-700"
                disabled={createEventMutation.isPending}
              >
                Send
              </Button>
            </div>
            {createEventMutation.isError && (
              <div className="text-red-500 text-sm mt-2">Error: {(createEventMutation.error as any)?.message || 'Failed to send command.'}</div>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={showNewModal} onOpenChange={setShowNewModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Session Name"
              value={newSession.name}
              onChange={e => setNewSession({ ...newSession, name: e.target.value })}
            />
            <div>
              <label className="block text-sm mb-1 text-white">Type</label>
              <select
                className="w-full p-2 bg-black border border-gray-600 text-white rounded"
                value={newSession.type}
                onChange={e => setNewSession({ ...newSession, type: e.target.value })}
              >
                <option value="claude">Claude</option>
                <option value="gemini">Gemini</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => createMutation.mutate(newSession)}
              disabled={createMutation.isPending || !newSession.name}
            >
              {createMutation.isPending ? 'Creating...' : 'Create'}
            </Button>
            <Button variant="outline" onClick={() => setShowNewModal(false)}>
              Cancel
            </Button>
          </DialogFooter>
          {createMutation.isError && (
            <div className="text-red-500 text-sm mt-2">Error: {(createMutation.error as any)?.message || 'Failed to create session.'}</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
