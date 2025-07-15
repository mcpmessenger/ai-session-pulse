
import { useState, useEffect } from "react";
import { Terminal, Play, Square, Mic, MicOff, Search, Filter, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SessionPanel } from "@/components/SessionPanel";
import { EventStream } from "@/components/EventStream";
import { VoiceCommand } from "@/components/VoiceCommand";
import { FilterPanel } from "@/components/FilterPanel";
import { SettingsPanel } from "@/components/SettingsPanel";
import { useQuery } from '@tanstack/react-query';
import { getSessions, getEvents } from '@/lib/api';

const Index = () => {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  // Replace mock useState with useQuery
  const { data: sessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ['sessions'],
    queryFn: getSessions,
  });
  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  });

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Terminal className="h-8 w-8" />
            <h1 className="text-2xl font-bold text-white">Terminal Command Center</h1>
            <Badge variant="outline" className="border-green-400 text-green-400">
              {sessions.filter(s => s.status === 'running').length} Active
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className="text-green-400 hover:bg-green-400/10"
            >
              <Filter className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              className="text-green-400 hover:bg-green-400/10"
            >
              <Settings className="h-4 w-4" />
            </Button>
            
            <VoiceCommand 
              isActive={isVoiceActive} 
              onToggle={setIsVoiceActive}
            />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search sessions, events, or commands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-green-400"
          />
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Session Management Panel */}
          <div className="lg:col-span-1">
            <SessionPanel 
              sessions={sessions}
              selectedSession={selectedSession}
              onSessionSelect={setSelectedSession}
            />
          </div>

          {/* Event Stream */}
          <div className="lg:col-span-2">
            <EventStream 
              searchQuery={searchQuery}
              selectedSession={selectedSession}
            />
          </div>
        </div>

        {/* Modals */}
        {showFilters && (
          <FilterPanel 
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
          />
        )}

        {showSettings && (
          <SettingsPanel
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
