
import { useState } from "react";
import { X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FilterPanel = ({ isOpen, onClose }: FilterPanelProps) => {
  const [sessionTypes, setSessionTypes] = useState<string[]>(['claude', 'gemini']);
  const [eventLevels, setEventLevels] = useState<string[]>(['info', 'success', 'warning', 'error']);
  const [dateRange, setDateRange] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md bg-gray-900 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Events
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Session Types */}
          <div>
            <Label className="text-white mb-3 block">Session Types</Label>
            <div className="space-y-2">
              {['claude', 'gemini'].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={sessionTypes.includes(type)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSessionTypes([...sessionTypes, type]);
                      } else {
                        setSessionTypes(sessionTypes.filter(t => t !== type));
                      }
                    }}
                  />
                  <Label htmlFor={type} className="text-gray-300 capitalize">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Event Levels */}
          <div>
            <Label className="text-white mb-3 block">Event Levels</Label>
            <div className="space-y-2">
              {['info', 'success', 'warning', 'error'].map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <Checkbox
                    id={level}
                    checked={eventLevels.includes(level)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setEventLevels([...eventLevels, level]);
                      } else {
                        setEventLevels(eventLevels.filter(l => l !== level));
                      }
                    }}
                  />
                  <Label htmlFor={level} className="text-gray-300 capitalize">
                    {level}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <Label className="text-white mb-3 block">Date Range</Label>
            <Input
              placeholder="Last 24 hours, Last week, etc."
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-black border-gray-600 text-white"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button 
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={onClose}
            >
              Apply Filters
            </Button>
            <Button 
              variant="outline" 
              className="border-gray-600 text-gray-300"
              onClick={() => {
                setSessionTypes(['claude', 'gemini']);
                setEventLevels(['info', 'success', 'warning', 'error']);
                setDateRange('');
              }}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
