
import { Search, Filter, Plus, X, ArrowLeft, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

interface MapTopControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onCreateTrip: () => void;
}

const MapTopControls = ({ 
  searchQuery, 
  setSearchQuery, 
  onCreateTrip 
}: MapTopControlsProps) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="absolute top-0 left-0 right-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm z-10 p-4 flex flex-col shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Map size={24} className="text-primary mr-2" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Unimog Trip Explorer</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative w-64">
            <Search size={16} className="absolute left-2 top-2.5 text-gray-500" />
            <Input 
              placeholder="Search trips..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          <Button size="sm" variant="outline" className="flex items-center gap-1">
            <Filter size={16} />
            <span>Filter</span>
          </Button>
          
          <Button 
            size="sm" 
            className="bg-primary flex items-center gap-1"
            onClick={onCreateTrip}
          >
            <Plus size={16} />
            <span>New Trip</span>
          </Button>
        </div>
      </div>

      {/* Back button */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="self-start mt-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center"
        onClick={handleBack}
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Dashboard
      </Button>
    </div>
  );
};

export default MapTopControls;
