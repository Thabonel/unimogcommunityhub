import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

interface Track {
  id: string;
  name: string;
  visible: boolean;
  segments?: {
    points: Array<{
      lat: number;
      lon: number;
      ele?: number;
    }>;
  };
  data?: any;
}

interface UseTrackRendererProps {
  map: mapboxgl.Map | null;
  tracks: Track[];
}

export function useTrackRenderer({ map, tracks }: UseTrackRendererProps) {
  const renderedTracksRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!map) {
      console.log('Track renderer: No map available');
      return;
    }
    
    console.log('Track renderer: Processing', tracks.length, 'tracks');

    // Wait for map to be loaded
    const renderTracks = () => {
      // Remove tracks that are no longer in the list or not visible
      renderedTracksRef.current.forEach(trackId => {
        const track = tracks.find(t => t.id === trackId);
        if (!track || !track.visible) {
          // Remove track from map
          if (map.getLayer(`track-${trackId}`)) {
            map.removeLayer(`track-${trackId}`);
          }
          if (map.getSource(`track-${trackId}`)) {
            map.removeSource(`track-${trackId}`);
          }
          renderedTracksRef.current.delete(trackId);
        }
      });

      // Add or update visible tracks
      tracks.forEach(track => {
        if (!track.visible) {
          console.log(`Track ${track.name} is not visible, skipping`);
          return;
        }

        const sourceId = `track-${track.id}`;
        const layerId = `track-${track.id}`;

        // Get track points - check all possible data structures
        let points: Array<[number, number]> = [];
        
        console.log(`Processing track ${track.name}:`, {
          hasSegments: !!track.segments,
          hasData: !!track.data,
          dataType: track.data ? typeof track.data : 'none'
        });
        
        if (track.segments?.points) {
          points = track.segments.points.map((p: any) => [p.lon || p.lng, p.lat]);
        } else if (track.data?.points) {
          points = track.data.points.map((p: any) => [p.lon || p.lng, p.lat]);
        } else if (track.data?.segments?.points) {
          // Handle nested segments in data
          points = track.data.segments.points.map((p: any) => [p.lon || p.lng, p.lat]);
        } else if (track.data && Array.isArray(track.data)) {
          points = track.data.map((p: any) => [p.lon || p.lng, p.lat]);
        }

        console.log(`Track ${track.name}: ${points.length} points`, {
          firstPoint: points[0],
          lastPoint: points[points.length - 1]
        });

        if (points.length < 2) {
          console.log(`Track ${track.name} has insufficient points, skipping`);
          return;
        }

        // Check if source already exists
        const existingSource = map.getSource(sourceId);
        
        if (existingSource) {
          // Update existing source
          (existingSource as mapboxgl.GeoJSONSource).setData({
            type: 'Feature',
            properties: { name: track.name },
            geometry: {
              type: 'LineString',
              coordinates: points
            }
          });
        } else {
          // Add new source and layer
          map.addSource(sourceId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: { name: track.name },
              geometry: {
                type: 'LineString',
                coordinates: points
              }
            }
          });

          map.addLayer({
            id: layerId,
            type: 'line',
            source: sourceId,
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#FF6B6B',
              'line-width': 3,
              'line-opacity': 0.8
            }
          });

          // Add track to rendered set
          renderedTracksRef.current.add(track.id);
          console.log(`Successfully added track ${track.name} to map as layer ${layerId}`);
        }
      });
    };

    if (map.loaded()) {
      renderTracks();
    } else {
      map.once('load', renderTracks);
    }

    // Cleanup function
    return () => {
      renderedTracksRef.current.forEach(trackId => {
        if (map.getLayer(`track-${trackId}`)) {
          map.removeLayer(`track-${trackId}`);
        }
        if (map.getSource(`track-${trackId}`)) {
          map.removeSource(`track-${trackId}`);
        }
      });
      renderedTracksRef.current.clear();
    };
  }, [map, tracks]);

  return {
    renderedTracks: Array.from(renderedTracksRef.current)
  };
}