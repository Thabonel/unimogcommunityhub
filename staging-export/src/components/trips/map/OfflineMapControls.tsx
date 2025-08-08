import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Trash2, MapPin } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import mapboxgl from 'mapbox-gl';
import {
  downloadMapRegionForOffline,
  getOfflineRegions,
  deleteOfflineRegion,
  getMapCacheSize,
} from '@/utils/offline-maps';

interface OfflineMapControlsProps {
  map: mapboxgl.Map | null;
}

export function OfflineMapControls({ map }: OfflineMapControlsProps) {
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [showRegionsDialog, setShowRegionsDialog] = useState(false);
  const [regionName, setRegionName] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [offlineRegions, setOfflineRegions] = useState(getOfflineRegions());

  const handleDownloadRegion = async () => {
    if (!map || !regionName.trim()) {
      toast({
        title: 'Invalid input',
        description: 'Please enter a region name',
        variant: 'destructive',
      });
      return;
    }

    const bounds = map.getBounds();
    
    // Check if the area is too large
    const area = (bounds.getNorth() - bounds.getSouth()) * (bounds.getEast() - bounds.getWest());
    if (area > 0.25) { // Approximately 0.5° x 0.5° area
      toast({
        title: 'Area too large',
        description: 'Please zoom in to download a smaller area for offline use',
        variant: 'destructive',
      });
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      await downloadMapRegionForOffline(map, regionName, bounds);
      
      toast({
        title: 'Download complete',
        description: `"${regionName}" is now available offline`,
      });
      
      setOfflineRegions(getOfflineRegions());
      setShowDownloadDialog(false);
      setRegionName('');
    } catch (error) {
      console.error('Failed to download region:', error);
      toast({
        title: 'Download failed',
        description: 'Failed to download map region. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const handleDeleteRegion = async (regionId: string) => {
    await deleteOfflineRegion(regionId);
    setOfflineRegions(getOfflineRegions());
    toast({
      title: 'Region deleted',
      description: 'Offline map region has been removed',
    });
  };

  const getCacheSizeDisplay = async () => {
    const size = await getMapCacheSize();
    return `${size.toFixed(1)} MB`;
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDownloadDialog(true)}
          disabled={!map}
          title="Download current area for offline use"
        >
          <Download className="h-4 w-4 mr-1" />
          Download Area
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowRegionsDialog(true)}
          title="Manage offline regions"
        >
          <MapPin className="h-4 w-4 mr-1" />
          Offline Regions ({offlineRegions.length})
        </Button>
      </div>

      {/* Download Dialog */}
      <Dialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Download Map for Offline Use</DialogTitle>
            <DialogDescription>
              Save the current map area for offline access during your trips.
              Make sure to zoom to the area you want to download.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="region-name">Region Name</Label>
              <Input
                id="region-name"
                value={regionName}
                onChange={(e) => setRegionName(e.target.value)}
                placeholder="e.g., Black Forest Trail"
                disabled={isDownloading}
              />
            </div>
            
            {isDownloading && (
              <div>
                <Progress value={downloadProgress} className="mb-2" />
                <p className="text-sm text-muted-foreground">
                  Downloading map tiles... {downloadProgress.toFixed(0)}%
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDownloadDialog(false)}
              disabled={isDownloading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDownloadRegion}
              disabled={isDownloading || !regionName.trim()}
            >
              {isDownloading ? 'Downloading...' : 'Download'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Regions Management Dialog */}
      <Dialog open={showRegionsDialog} onOpenChange={setShowRegionsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Offline Map Regions</DialogTitle>
            <DialogDescription>
              Manage your downloaded offline map regions
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {offlineRegions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No offline regions downloaded yet
              </p>
            ) : (
              <div className="space-y-2">
                {offlineRegions.map((region) => (
                  <div
                    key={region.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{region.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Downloaded: {new Date(region.downloadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRegion(region.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button onClick={() => setShowRegionsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}