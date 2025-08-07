import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

interface Track {
  id: string;
  name?: string;
  data: any;
  visible?: boolean;
  color?: string;
}

interface UseTrackRendererProps {
  map: mapboxgl.Map | null;
  tracks: Track[];
}

export function useTrackRenderer({ map, tracks }: UseTrackRendererProps) {
  const [renderedTracks, setRenderedTracks] = useState<string[]>([]);
  const sourcesRef = useRef<Set<string>>(new Set());
  
  useEffect(() => {
    if (!map) return;
    
    // Clean up old tracks
    sourcesRef.current.forEach(sourceId => {
      if (map.getLayer(`track-${sourceId}`)) {
        map.removeLayer(`track-${sourceId}`);
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
    });
    sourcesRef.current.clear();
    
    // Render visible tracks
    const visibleTracks = tracks.filter(t => t.visible);
    const rendered: string[] = [];
    
    visibleTracks.forEach(track => {
      if (!track.data) return;
      
      const sourceId = `track-${track.id}`;
      
      try {
        // Add source if it doesn't exist
        if (!map.getSource(sourceId)) {
          map.addSource(sourceId, {
            type: 'geojson',
            data: track.data
          });
          sourcesRef.current.add(sourceId);
        }
        
        // Add layer if it doesn't exist
        if (!map.getLayer(`track-${sourceId}`)) {
          map.addLayer({
            id: `track-${sourceId}`,
            type: 'line',
            source: sourceId,
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': track.color || '#3b82f6',
              'line-width': 3,
              'line-opacity': 0.8
            }
          });
        }
        
        rendered.push(track.id);
      } catch (error) {
        console.error(`Error rendering track ${track.id}:`, error);
      }
    });
    
    setRenderedTracks(rendered);
    
    // Cleanup on unmount
    return () => {
      sourcesRef.current.forEach(sourceId => {
        if (map.getLayer(`track-${sourceId}`)) {
          map.removeLayer(`track-${sourceId}`);
        }
        if (map.getSource(sourceId)) {
          map.removeSource(sourceId);
        }
      });
      sourcesRef.current.clear();
    };
  }, [map, tracks]);
  
  return { renderedTracks };
}