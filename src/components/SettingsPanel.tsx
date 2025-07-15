
import { useState } from "react";
import { X, Settings, Eye, EyeOff, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel = ({ isOpen, onClose }: SettingsPanelProps) => {
  const [credentials, setCredentials] = useState({
    claudeApiKey: '',
    geminiApiKey: '',
    whisperApiKey: '',
    webhookUrl: ''
  });
  const [showKeys, setShowKeys] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your credentials have been securely stored.",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl bg-gray-900 border-gray-700 max-h-[80vh] overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="credentials" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800">
              <TabsTrigger value="credentials" className="text-white">Credentials</TabsTrigger>
              <TabsTrigger value="agents" className="text-white">Agents</TabsTrigger>
              <TabsTrigger value="system" className="text-white">System</TabsTrigger>
            </TabsList>
            
            <TabsContent value="credentials" className="p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg">API Credentials</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowKeys(!showKeys)}
                  className="text-gray-400"
                >
                  {showKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Claude API Key</Label>
                  <Input
                    type={showKeys ? "text" : "password"}
                    placeholder="sk-ant-..."
                    value={credentials.claudeApiKey}
                    onChange={(e) => setCredentials({...credentials, claudeApiKey: e.target.value})}
                    className="bg-black border-gray-600 text-white mt-1"
                  />
                </div>
                
                <div>
                  <Label className="text-white">Gemini API Key</Label>
                  <Input
                    type={showKeys ? "text" : "password"}
                    placeholder="AIza..."
                    value={credentials.geminiApiKey}
                    onChange={(e) => setCredentials({...credentials, geminiApiKey: e.target.value})}
                    className="bg-black border-gray-600 text-white mt-1"
                  />
                </div>
                
                <div>
                  <Label className="text-white">Whisper API Key</Label>
                  <Input
                    type={showKeys ? "text" : "password"}
                    placeholder="sk-..."
                    value={credentials.whisperApiKey}
                    onChange={(e) => setCredentials({...credentials, whisperApiKey: e.target.value})}
                    className="bg-black border-gray-600 text-white mt-1"
                  />
                </div>
                
                <div>
                  <Label className="text-white">Webhook URL</Label>
                  <Input
                    placeholder="https://your-webhook-url.com"
                    value={credentials.webhookUrl}
                    onChange={(e) => setCredentials({...credentials, webhookUrl: e.target.value})}
                    className="bg-black border-gray-600 text-white mt-1"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="agents" className="p-6 space-y-4">
              <h3 className="text-white text-lg">Agent Configuration</h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Default Agent Type</Label>
                  <select className="w-full mt-1 p-2 bg-black border border-gray-600 text-white rounded">
                    <option value="claude">Claude</option>
                    <option value="gemini">Gemini</option>
                  </select>
                </div>
                
                <div>
                  <Label className="text-white">Max Concurrent Sessions</Label>
                  <Input
                    type="number"
                    defaultValue="5"
                    className="bg-black border-gray-600 text-white mt-1"
                  />
                </div>
                
                <div>
                  <Label className="text-white">Session Timeout (minutes)</Label>
                  <Input
                    type="number"
                    defaultValue="30"
                    className="bg-black border-gray-600 text-white mt-1"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="system" className="p-6 space-y-4">
              <h3 className="text-white text-lg">System Settings</h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Log Level</Label>
                  <select className="w-full mt-1 p-2 bg-black border border-gray-600 text-white rounded">
                    <option value="debug">Debug</option>
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                
                <div>
                  <Label className="text-white">WebSocket Port</Label>
                  <Input
                    type="number"
                    defaultValue="8080"
                    className="bg-black border-gray-600 text-white mt-1"
                  />
                </div>
                
                <div>
                  <Label className="text-white">Custom MCP Configuration</Label>
                  <Textarea
                    placeholder="JSON configuration for MCP protocol..."
                    className="bg-black border-gray-600 text-white mt-1 h-32"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="border-t border-gray-700 p-6">
            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handleSave}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
              <Button 
                variant="outline" 
                className="border-gray-600 text-gray-300"
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
