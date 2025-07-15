
import { useState, useEffect } from "react";
import { Activity, AlertCircle, CheckCircle, Info, Terminal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Event {
  id: number;
  sessionId: string;
  type: string;
  content: string;
  timestamp: string;
  level: "info" | "success" | "warning" | "error";
}

interface EventStreamProps {
  events: Event[];
  searchQuery: string;
  selectedSession: string | null;
}

export const EventStream = ({ events, searchQuery, selectedSession }: EventStreamProps) => {
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    let filtered = events;
    
    if (selectedSession) {
      filtered = filtered.filter(event => event.sessionId === selectedSession);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredEvents(filtered);
  }, [events, searchQuery, selectedSession]);

  const getEventIcon = (level: string) => {
    switch (level) {
      case "success": return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "error": return <AlertCircle className="h-4 w-4 text-red-400" />;
      case "warning": return <AlertCircle className="h-4 w-4 text-yellow-400" />;
      default: return <Info className="h-4 w-4 text-blue-400" />;
    }
  };

  const getEventColors = (level: string) => {
    switch (level) {
      case "success": return "border-l-green-400 bg-green-400/5";
      case "error": return "border-l-red-400 bg-red-400/5";
      case "warning": return "border-l-yellow-400 bg-yellow-400/5";
      default: return "border-l-blue-400 bg-blue-400/5";
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-700 h-[600px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Event Stream
            {isLive && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-green-400">LIVE</span>
              </div>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-gray-500 text-gray-400">
              {filteredEvents.length} events
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px] px-4">
          <div className="space-y-2 pb-4">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className={`p-3 rounded-lg border-l-2 ${getEventColors(event.level)} border border-gray-700`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2 flex-1">
                    {getEventIcon(event.level)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge 
                          variant="outline" 
                          className="text-xs bg-transparent border-gray-600 text-gray-400"
                        >
                          {event.sessionId}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className="text-xs bg-transparent border-gray-600 text-gray-400"
                        >
                          {event.type}
                        </Badge>
                      </div>
                      <p className="text-white text-sm font-mono break-words">
                        {event.content}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 font-mono whitespace-nowrap">
                    {event.timestamp}
                  </span>
                </div>
              </div>
            ))}
            
            {filteredEvents.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Terminal className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No events to display</p>
                {searchQuery && (
                  <p className="text-sm mt-1">Try adjusting your search or filters</p>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
