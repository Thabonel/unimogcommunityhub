
import { Layers, Navigation, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapControlsProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const MapControls = ({ sidebarOpen, toggleSidebar }: MapControlsProps) => {
  return (
    <>
      {/* Sidebar toggle button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-28 left-0 z-20 bg-white dark:bg-gray-800 p-1 shadow-md rounded-r-lg"
      >
        {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>
      
      {/* Map control buttons */}
      <div className="absolute top-28 right-4 z-10 flex flex-col space-y-2">
        <Button size="icon" variant="outline" className="bg-white/90 dark:bg-gray-800/90 shadow-md">
          <Layers size={18} />
        </Button>
        <Button size="icon" variant="outline" className="bg-white/90 dark:bg-gray-800/90 shadow-md">
          <Navigation size={18} />
        </Button>
      </div>
    </>
  );
};

export default MapControls;
