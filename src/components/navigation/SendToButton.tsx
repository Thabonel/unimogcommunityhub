import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Share2, Navigation, Smartphone, Monitor, Download, Map } from 'lucide-react';
import { Waypoint } from '@/types/waypoint';
import { DirectionsRoute } from '@/services/mapboxDirections';
import { getExportOptions, isMobile, isIOS, isAndroid } from '@/utils/navigationExport';

interface SendToButtonProps {
  waypoints: Waypoint[];
  route: DirectionsRoute | null;
  disabled?: boolean;
  className?: string;
}

export const SendToButton: React.FC<SendToButtonProps> = ({
  waypoints,
  route,
  disabled = false,
  className = ''
}) => {
  const exportOptions = getExportOptions();
  
  // Filter options based on platform
  const mobileOptions = exportOptions.filter(opt => opt.category === 'mobile');
  const desktopOptions = exportOptions.filter(opt => opt.category === 'desktop');
  const fileOptions = exportOptions.filter(opt => opt.category === 'file');
  
  // Further filter mobile options based on platform
  const relevantMobileOptions = mobileOptions.filter(opt => {
    if (opt.id === 'apple-maps') return isIOS();
    if (opt.id === 'google-maps') return true; // Works on all platforms
    if (opt.id === 'waze') return true; // Works on all platforms
    return true;
  });

  const handleExport = (option: any) => {
    try {
      option.action(waypoints, route);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'desktop': return <Monitor className="h-4 w-4" />;
      case 'file': return <Download className="h-4 w-4" />;
      default: return <Navigation className="h-4 w-4" />;
    }
  };

  const getOptionIcon = (optionId: string) => {
    switch (optionId) {
      case 'google-maps':
      case 'apple-maps':
      case 'waze':
      case 'komoot':
        return <Map className="h-4 w-4" />;
      default:
        return <Download className="h-4 w-4" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="default"
          className={`text-xs bg-blue-600 hover:bg-blue-700 ${className}`}
          disabled={disabled || waypoints.length === 0}
        >
          <Share2 className="h-3 w-3 mr-1 flex-shrink-0" />
          SEND TO
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center">
          <Share2 className="h-4 w-4 mr-2" />
          Export Route
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Mobile Navigation Apps */}
        {(isMobile() || relevantMobileOptions.length > 0) && (
          <>
            <DropdownMenuLabel className="text-xs text-muted-foreground flex items-center">
              {getCategoryIcon('mobile')}
              <span className="ml-2">Mobile Navigation</span>
            </DropdownMenuLabel>
            {relevantMobileOptions.map((option) => (
              <DropdownMenuItem
                key={option.id}
                onClick={() => handleExport(option)}
                className="flex items-center cursor-pointer"
              >
                {getOptionIcon(option.id)}
                <span className="ml-2">{option.name}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </>
        )}
        
        {/* Desktop Apps */}
        {(!isMobile() || desktopOptions.length > 0) && (
          <>
            <DropdownMenuLabel className="text-xs text-muted-foreground flex items-center">
              {getCategoryIcon('desktop')}
              <span className="ml-2">Web Navigation</span>
            </DropdownMenuLabel>
            {desktopOptions.map((option) => (
              <DropdownMenuItem
                key={option.id}
                onClick={() => handleExport(option)}
                className="flex items-center cursor-pointer"
              >
                {getOptionIcon(option.id)}
                <span className="ml-2">{option.name}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </>
        )}
        
        {/* File Exports */}
        <DropdownMenuLabel className="text-xs text-muted-foreground flex items-center">
          {getCategoryIcon('file')}
          <span className="ml-2">File Exports</span>
        </DropdownMenuLabel>
        {fileOptions.map((option) => (
          <DropdownMenuItem
            key={option.id}
            onClick={() => handleExport(option)}
            className="flex items-center cursor-pointer"
          >
            {getOptionIcon(option.id)}
            <span className="ml-2">{option.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SendToButton;