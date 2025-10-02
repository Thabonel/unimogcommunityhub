import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Download, Save, TrendingUp, Eye } from 'lucide-react';
import { GeoJSONFeature, saveTrailToLibrary, exportTrailAsGPX, convertGeoJSONToGPX, downloadGPXFile } from '@/services/trailService';
import { toast } from 'sonner';
import { formatDistance } from '@/utils/gpxUtils';

interface TrailSearchResultsProps {
  trails: GeoJSONFeature[];
  onTrailSelect: (trail: GeoJSONFeature) => void;
  selectedTrail?: GeoJSONFeature | null;
}

export function TrailSearchResults({ trails, onTrailSelect, selectedTrail }: TrailSearchResultsProps) {
  const handleSaveTrail = async (trail: GeoJSONFeature, e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const { data, error } = await saveTrailToLibrary(trail);

      if (error) {
        toast.error(`Failed to save trail: ${error.message}`);
        return;
      }

      toast.success(`${trail.properties.name} saved to your library!`);
    } catch (error) {
      console.error('Error saving trail:', error);
      toast.error('Failed to save trail');
    }
  };

  const handleDownloadGPX = (trail: GeoJSONFeature, e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const gpxString = convertGeoJSONToGPX(trail);
      downloadGPXFile(gpxString, trail.properties.name);
      toast.success(`${trail.properties.name}.gpx downloaded!`);
    } catch (error) {
      console.error('Error downloading GPX:', error);
      toast.error('Failed to download GPX file');
    }
  };

  if (trails.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No trails found. Try searching for a trail name.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
      {trails.map((trail, index) => {
        const isSelected = selectedTrail?.properties.osm_id === trail.properties.osm_id;

        return (
          <Card
            key={trail.properties.osm_id || index}
            className={`cursor-pointer transition-all hover:shadow-md ${
              isSelected ? 'border-primary border-2 bg-primary/5' : ''
            }`}
            onClick={() => onTrailSelect(trail)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base flex items-center gap-2">
                    {trail.properties.name}
                    {isSelected && (
                      <Badge variant="default" className="ml-2">
                        <Eye className="h-3 w-3 mr-1" />
                        Viewing
                      </Badge>
                    )}
                  </CardTitle>
                  {trail.properties.description && (
                    <CardDescription className="text-sm mt-1 line-clamp-2">
                      {trail.properties.description}
                    </CardDescription>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div className="flex items-center text-muted-foreground">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {formatDistance(trail.properties.distance_meters)}
                </div>
                {trail.properties.surface && (
                  <div className="flex items-center">
                    <Badge variant="secondary" className="text-xs">
                      {trail.properties.surface}
                    </Badge>
                  </div>
                )}
                {trail.properties.difficulty && (
                  <div className="flex items-center col-span-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        trail.properties.difficulty === 'easy' ? 'border-green-500 text-green-700' :
                        trail.properties.difficulty === 'moderate' ? 'border-yellow-500 text-yellow-700' :
                        trail.properties.difficulty === 'difficult' ? 'border-orange-500 text-orange-700' :
                        'border-red-500 text-red-700'
                      }`}
                    >
                      {trail.properties.difficulty}
                    </Badge>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={(e) => handleSaveTrail(trail, e)}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={(e) => handleDownloadGPX(trail, e)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  GPX
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
