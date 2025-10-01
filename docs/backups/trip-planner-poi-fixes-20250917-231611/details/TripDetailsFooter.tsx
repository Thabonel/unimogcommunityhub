
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';

interface TripDetailsFooterProps {
  onClose: () => void;
}

const TripDetailsFooter = ({ onClose }: TripDetailsFooterProps) => {
  return (
    <div className="flex justify-between">
      <Button variant="outline" onClick={onClose}>Close</Button>
      <div className="flex space-x-2">
        <Button variant="outline" size="icon">
          <Download className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
        <Button>View on Map</Button>
      </div>
    </div>
  );
};

export default TripDetailsFooter;
