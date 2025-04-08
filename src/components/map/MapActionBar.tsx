
import React from 'react';
import { cn } from '@/lib/utils';
import MapTokenTester from './MapTokenTester';
import TrackUploadControls from './TrackUploadControls';
import { Track } from '@/types/track';

interface MapActionBarProps {
  className?: string;
  tracks?: Track[];
}

const MapActionBar = ({ className, tracks = [] }: MapActionBarProps) => {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <MapTokenTester />
      <TrackUploadControls tracks={tracks} />
    </div>
  );
};

export default MapActionBar;
