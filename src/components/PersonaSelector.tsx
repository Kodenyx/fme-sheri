
import { Button } from "@/components/ui/button";
import { User, Sparkles } from "lucide-react";

interface PersonaSelectorProps {
  selectedPersona: 'sheri' | 'harper';
  onPersonaChange: (persona: 'sheri' | 'harper') => void;
}

const PersonaSelector = ({ selectedPersona, onPersonaChange }: PersonaSelectorProps) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4 text-center" style={{ color: '#3B1E5E' }}>
        Choose Your Email Enhancement Style
      </h3>
      <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        <Button
          variant={selectedPersona === 'sheri' ? 'default' : 'outline'}
          onClick={() => onPersonaChange('sheri')}
          className={`p-6 h-auto flex flex-col items-center gap-3 transition-all ${
            selectedPersona === 'sheri' 
              ? 'text-white shadow-lg' 
              : 'border-2 hover:border-gray-400 text-gray-700'
          }`}
          style={selectedPersona === 'sheri' ? { backgroundColor: '#E19013' } : {}}
        >
          <Sparkles className="w-6 h-6" />
          <div className="text-center">
            <div className="font-bold text-lg">Sheri Otto</div>
            <div className="text-sm opacity-90">
              Emotionally sharp, behaviorally precise
            </div>
            <div className="text-xs mt-1 opacity-80">
              Best for: High-impact conversions
            </div>
          </div>
        </Button>
        
        <Button
          variant={selectedPersona === 'harper' ? 'default' : 'outline'}
          onClick={() => onPersonaChange('harper')}
          className={`p-6 h-auto flex flex-col items-center gap-3 transition-all ${
            selectedPersona === 'harper' 
              ? 'text-white shadow-lg' 
              : 'border-2 hover:border-gray-400 text-gray-700'
          }`}
          style={selectedPersona === 'harper' ? { backgroundColor: '#E19013' } : {}}
        >
          <User className="w-6 h-6" />
          <div className="text-center">
            <div className="font-bold text-lg">Harper</div>
            <div className="text-sm opacity-90">
              Warm, transparent, disarming
            </div>
            <div className="text-xs mt-1 opacity-80">
              Best for: Cold outreach & trust-building
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default PersonaSelector;
