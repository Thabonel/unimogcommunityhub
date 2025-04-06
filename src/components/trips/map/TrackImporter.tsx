
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, MapPin, X } from 'lucide-react';
import { parseGpxFile, geoJsonToTrack, addTrackToMap } from './utils/trackUtils';
import mapboxgl from 'mapbox-gl';
import { Track } from '@/types/track';
import TrackImportStatus, { ImportStatus } from './TrackImportStatus';
import { toast } from 'sonner';

interface TrackImporterProps {
  map: mapboxgl.Map | null;
  onTrackImported?: (track: Track) => void;
}

const TrackImporter = ({ map, onTrackImported }: TrackImporterProps) => {
  const [importing, setImporting] = useState<boolean>(false);
  const [importStatus, setImportStatus] = useState<ImportStatus>('idle');
  const [importProgress, setImportProgress] = useState<number>(0);
  const [importError, setImportError] = useState<string | undefined>(undefined);
  const [fileName, setFileName] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !map) {
      return;
    }

    const file = event.target.files[0];
    setFileName(file.name);
    setImporting(true);
    setImportStatus('processing');
    setImportProgress(10);
    setImportError(undefined);

    try {
      const reader = new FileReader();
      
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const percentLoaded = Math.round((e.loaded / e.total) * 50);
          setImportProgress(10 + percentLoaded);
        }
      };

      reader.onload = async (e) => {
        setImportProgress(60);
        
        if (e.target && typeof e.target.result === 'string') {
          const gpxData = e.target.result;
          
          // Parse GPX file
          const geoJson = parseGpxFile(gpxData);
          setImportProgress(80);
          
          if (!geoJson) {
            throw new Error('Failed to parse GPX file');
          }
          
          // Convert to our track format
          const track = geoJsonToTrack(geoJson, file.name);
          setImportProgress(90);
          
          // Add track to map
          addTrackToMap(map, track);
          setImportProgress(100);
          
          // Callback with the imported track
          if (onTrackImported) {
            onTrackImported(track);
          }
          
          setImportStatus('success');
          toast.success('Track imported successfully');
        }
      };

      reader.onerror = () => {
        throw new Error('Error reading the file');
      };

      reader.readAsText(file);
    } catch (error) {
      console.error('Error processing GPX file:', error);
      setImportStatus('error');
      setImportError(error instanceof Error ? error.message : 'Unknown error processing file');
      toast.error('Failed to import track');
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDismiss = () => {
    setImporting(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRetry = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept=".gpx"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleButtonClick}
        disabled={!map || importing}
        className="bg-white/80 backdrop-blur-sm hover:bg-white"
      >
        <Upload className="h-4 w-4 mr-2" />
        Import GPX
      </Button>
      
      {importing && (
        <div className="absolute right-0 top-10 z-50 w-72">
          <TrackImportStatus
            fileName={fileName}
            status={importStatus}
            progress={importProgress}
            error={importError}
            onDismiss={handleDismiss}
            onRetry={handleRetry}
          />
        </div>
      )}
    </div>
  );
};

export default TrackImporter;
