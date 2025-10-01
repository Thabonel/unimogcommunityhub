import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Download, Smartphone, Monitor, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Waypoint } from '@/types/waypoint';
import { DirectionsRoute } from '@/services/mapboxDirections';
import { getExportOptions, ExportOption } from '@/utils/navigationExport';

interface ExportOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  waypoints: Waypoint[];
  route: DirectionsRoute | null;
}

const ExportOptionsModal = ({ isOpen, onClose, waypoints, route }: ExportOptionsModalProps) => {
  const [isExporting, setIsExporting] = useState<string | null>(null);
  
  const exportOptions = getExportOptions();
  
  // Group options by category
  const mobileApps = exportOptions.filter(opt => opt.category === 'mobile');
  const desktopApps = exportOptions.filter(opt => opt.category === 'desktop');
  const fileExports = exportOptions.filter(opt => opt.category === 'file');

  const handleExport = async (option: ExportOption) => {
    setIsExporting(option.id);
    
    try {
      // Add debug logging
      console.log(`🚀 Executing ${option.name} export`, {
        waypoints: waypoints.length,
        hasRoute: !!route,
        routeCoords: route?.geometry?.coordinates?.length || 0
      });

      // Execute the export action
      option.action(waypoints, route);
      
      // For navigation apps, add popup blocker detection
      if (option.category === 'mobile' || option.category === 'desktop') {
        // Check if window.open was blocked
        setTimeout(() => {
          toast.info(`If ${option.name} didn't open, please check your popup blocker settings`);
        }, 1000);
      }
      
      // Close modal after successful export
      setTimeout(() => {
        onClose();
      }, 500);
      
    } catch (error) {
      console.error(`❌ Export failed for ${option.name}:`, error);
      toast.error(`Failed to export to ${option.name}`);
    } finally {
      setIsExporting(null);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'desktop': return <Monitor className="h-4 w-4" />;
      case 'file': return <Download className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getOptionIcon = (optionId: string) => {
    switch (optionId) {
      case 'google-maps': return '🗺️';
      case 'apple-maps': return '🍎';
      case 'waze': return '🚗';
      case 'komoot': return '🥾';
      case 'gpx': return '📍';
      case 'kml': return '🌍';
      case 'geojson': return '🌐';
      case 'csv': return '📊';
      default: return '📱';
    }
  };

  const getOptionDescription = (optionId: string) => {
    switch (optionId) {
      case 'google-maps': return 'Open route in Google Maps for navigation';
      case 'apple-maps': return 'Open route in Apple Maps (iOS/macOS)';
      case 'waze': return 'Navigate with Waze community-based routing';
      case 'komoot': return 'Plan outdoor adventures and hiking routes';
      case 'gpx': return 'GPS track file for outdoor devices and apps';
      case 'kml': return 'Google Earth compatible file format';
      case 'geojson': return 'Web mapping and GIS compatible format';
      case 'csv': return 'Spreadsheet format with coordinates';
      default: return 'Export your route data';
    }
  };

  const ExportSection = ({ title, options, categoryIcon }: { 
    title: string; 
    options: ExportOption[]; 
    categoryIcon: React.ReactNode;
  }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {categoryIcon}
        <h3 className="font-medium text-sm">{title}</h3>
        <Badge variant="secondary" className="text-xs">
          {options.length}
        </Badge>
      </div>
      <div className="grid gap-2">
        {options.map((option) => (
          <Button
            key={option.id}
            variant="outline"
            className="justify-start h-auto p-3 text-left"
            onClick={() => handleExport(option)}
            disabled={isExporting === option.id}
          >
            <div className="flex items-start gap-3 w-full">
              <span className="text-lg">{getOptionIcon(option.id)}</span>
              <div className="flex-1">
                <div className="font-medium text-sm">{option.name}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {getOptionDescription(option.id)}
                </div>
              </div>
              {isExporting === option.id && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              )}
            </div>
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Export Route
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 overflow-y-auto flex-1 pr-2">
          {/* Route Info */}
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>
                {waypoints.length > 0 
                  ? `${waypoints.length} waypoints` 
                  : 'Route calculated'
                } • {route ? `${(route.distance / 1000).toFixed(1)} km` : 'Ready to export'}
              </span>
            </div>
          </div>

          {/* Navigation Apps */}
          <ExportSection
            title="Navigation Apps"
            options={mobileApps}
            categoryIcon={getCategoryIcon('mobile')}
          />

          {/* Desktop Apps */}
          {desktopApps.length > 0 && (
            <ExportSection
              title="Desktop Apps"
              options={desktopApps}
              categoryIcon={getCategoryIcon('desktop')}
            />
          )}

          {/* File Downloads */}
          <ExportSection
            title="Download Files"
            options={fileExports}
            categoryIcon={getCategoryIcon('file')}
          />
        </div>

        {/* Cancel Button - Fixed at bottom */}
        <div className="flex-shrink-0 pt-4 border-t">
          <Button
            variant="secondary"
            className="w-full"
            onClick={onClose}
            disabled={!!isExporting}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportOptionsModal;