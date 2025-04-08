
import React from 'react';
import { Source, Layer } from 'react-map-gl';
import { Track } from '@/types/track';

interface TrackRendererProps {
  tracks: Track[];
}

const TrackRenderer = ({ tracks = [] }: TrackRendererProps) => {
  return (
    <>
      {tracks.map((track, trackIndex) => (
        track.segments && track.segments.map((segment, segIndex) => {
          // Convert track data to GeoJSON
          const coordinates = segment.points.map(point => [
            point.longitude,
            point.latitude,
            point.elevation || 0
          ]);
          
          const geojson = {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates
            }
          };
          
          return (
            <Source
              key={`${track.id}-${segIndex}`}
              id={`track-${track.id}-${segIndex}`}
              type="geojson"
              data={geojson as any}
            >
              <Layer
                id={`track-line-${track.id}-${segIndex}`}
                type="line"
                paint={{
                  'line-color': track.color || '#FF0000',
                  'line-width': 3
                }}
              />
            </Source>
          );
        })
      ))}
    </>
  );
};

export default TrackRenderer;
