
import { useState } from "react";
import { Terminal, Play, Square, Pause, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

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

  const addSession = async (sessionData: { name: string; type: string }) => {
    // Default status is 'running', lastActivity is now
    const { data, error } = await supabase
      .from('sessions')
      .insert([{ 
        name: sessionData.name, 
        type: sessionData.type, 
        status: 'running',
        last_activity: new Date().toISOString()
      }]);
    if (error) throw error;
    return data;
  };

  const mutation = useMutation({
    mutationFn: addSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      setShowNewModal(false);
      setNewSession({ name: '', type: 'claude' });
    },
  });

  const deleteSession = async (id: string) => {
    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('id', id);
    if (error) throw error;
  };

  const deleteMutation = useMutation({
    mutationFn: deleteSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });

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
                  if (e.key === 'Enter') {
                    console.log('Sending command:', command);
                    setCommand('');
                  }
                }}
              />
              <Button 
                onClick={() => {
                  console.log('Sending command:', command);
                  setCommand('');
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                Send
              </Button>
            </div>
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
              onClick={() => mutation.mutate(newSession)}
              disabled={mutation.isPending || !newSession.name}
            >
              {mutation.isPending ? 'Creating...' : 'Create'}
            </Button>
            <Button variant="outline" onClick={() => setShowNewModal(false)}>
              Cancel
            </Button>
          </DialogFooter>
          {mutation.isError && (
            <div className="text-red-500 text-sm mt-2">Error: {(mutation.error as any)?.message || 'Failed to create session.'}</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
