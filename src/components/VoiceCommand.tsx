
import { useState, useEffect } from "react";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface VoiceCommandProps {
  isActive: boolean;
  onToggle: (active: boolean) => void;
}

export const VoiceCommand = ({ isActive, onToggle }: VoiceCommandProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (isActive) {
      startListening();
    } else {
      stopListening();
    }
  }, [isActive]);

  const startListening = () => {
    setIsListening(true);
    toast({
      title: "Voice Command Active",
      description: "Listening for commands...",
    });
    
    // Simulate voice recognition
    setTimeout(() => {
      if (isActive) {
        setTranscript("Create new session with Claude");
        setTimeout(() => {
          setTranscript("");
          setIsListening(false);
        }, 3000);
      }
    }, 2000);
  };

  const stopListening = () => {
    setIsListening(false);
    setTranscript("");
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onToggle(!isActive)}
        className={`${
          isActive 
            ? "text-green-400 bg-green-400/10 hover:bg-green-400/20" 
            : "text-gray-400 hover:bg-gray-400/10"
        } transition-all duration-200`}
      >
        {isActive ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
      </Button>

      {isActive && (
        <Card className="absolute top-12 right-0 w-64 bg-gray-900 border-gray-700 z-50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="h-4 w-4 text-green-400" />
              <span className="text-sm text-white">Voice Command</span>
              {isListening && (
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-auto" />
              )}
            </div>
            
            <div className="min-h-[40px] p-2 bg-black rounded border border-gray-600">
              {transcript ? (
                <p className="text-green-400 text-sm font-mono">{transcript}</p>
              ) : isListening ? (
                <p className="text-gray-500 text-sm">Listening...</p>
              ) : (
                <p className="text-gray-600 text-sm">Click to start listening</p>
              )}
            </div>
            
            <p className="text-xs text-gray-500 mt-2">
              Try: "Create new session", "Show logs", "Filter by Claude"
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
