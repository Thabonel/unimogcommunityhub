/**
 * Location Debug Panel
 * Shows location and map status for debugging purposes
 */

import React, { useState } from 'react';
import { useUserLocation } from '@/hooks/use-user-location';
import { MAPBOX_CONFIG } from '@/config/env';
import { getSupabaseInstanceInfo } from '@/lib/supabase-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MapPin, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Compass
} from 'lucide-react';

interface LocationDebugPanelProps {
  className?: string;
}

export const LocationDebugPanel: React.FC<LocationDebugPanelProps> = ({ className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { location, error, isLoading, getLocation } = useUserLocation();

  const getLocationStatus = () => {
    if (isLoading) return { icon: RefreshCw, color: 'text-blue-500', text: 'Loading...' };
    if (error) return { icon: XCircle, color: 'text-red-500', text: 'Error' };
    if (location) return { icon: CheckCircle, color: 'text-green-500', text: 'Located' };
    return { icon: AlertCircle, color: 'text-yellow-500', text: 'No Location' };
  };

  const getMapboxStatus = () => {
    const hasToken = !!MAPBOX_CONFIG.accessToken;
    const isValidFormat = MAPBOX_CONFIG.accessToken?.startsWith('pk.');
    
    if (!hasToken) return { icon: XCircle, color: 'text-red-500', text: 'No Token' };
    if (!isValidFormat) return { icon: AlertCircle, color: 'text-yellow-500', text: 'Invalid Format' };
    return { icon: CheckCircle, color: 'text-green-500', text: 'Token OK' };
  };

  const handleRefreshLocation = () => {
    console.log('🔄 LocationDebugPanel: Manually refreshing location...');
    getLocation();
  };

  const locationStatus = getLocationStatus();
  const mapboxStatus = getMapboxStatus();
  const supabaseInfo = getSupabaseInstanceInfo();

  if (!isVisible) {
    return (
      <div className={`fixed bottom-20 right-4 z-40 ${className}`}>
        <Button
          onClick={() => setIsVisible(true)}
          size="sm"
          variant="outline"
          className="flex items-center gap-1"
        >
          <Compass className="h-3 w-3" />
          Debug
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-20 right-4 z-40 w-80 ${className}`}>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-1">
              <Compass className="h-4 w-4" />
              Location & Map Debug
            </CardTitle>
            <Button
              onClick={() => setIsVisible(false)}
              size="sm"
              variant="ghost"
            >
              <EyeOff className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          {/* Location Status */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <locationStatus.icon className={`h-3 w-3 ${locationStatus.color} ${isLoading ? 'animate-spin' : ''}`} />
              <span className="font-medium">Location: {locationStatus.text}</span>
              <Button
                onClick={handleRefreshLocation}
                size="sm"
                variant="ghost"
                className="h-5 px-1"
                disabled={isLoading}
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
            
            {location && (
              <div className="ml-5 space-y-1 text-gray-600">
                <div>📍 {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</div>
                <div>🎯 ±{location.accuracy}m accuracy</div>
                <div>⏰ {new Date(location.timestamp || Date.now()).toLocaleTimeString()}</div>
              </div>
            )}
            
            {error && (
              <div className="ml-5 text-red-600">{error}</div>
            )}
          </div>

          {/* Mapbox Status */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <mapboxStatus.icon className={`h-3 w-3 ${mapboxStatus.color}`} />
              <span className="font-medium">Mapbox: {mapboxStatus.text}</span>
            </div>
            
            {MAPBOX_CONFIG.accessToken && (
              <div className="ml-5 text-gray-600">
                🔑 {MAPBOX_CONFIG.accessToken.substring(0, 15)}...
              </div>
            )}
          </div>

          {/* Environment Status */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span className="font-medium">Environment</span>
            </div>
            <div className="ml-5 space-y-1 text-gray-600">
              <div>🏗️ {import.meta.env.MODE || 'unknown'} mode</div>
              <div>🌐 {typeof window !== 'undefined' ? 'Browser' : 'Server'}</div>
              <div>📱 {navigator?.geolocation ? 'Geolocation OK' : 'No Geolocation'}</div>
            </div>
          </div>

          {/* Supabase Status */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span className="font-medium">Supabase Instances</span>
            </div>
            <div className="ml-5 text-gray-600">
              {supabaseInfo.instanceCount} instance{supabaseInfo.instanceCount !== 1 ? 's' : ''}
              {supabaseInfo.instanceCount > 1 && (
                <span className="text-yellow-600"> ⚠️ Multiple!</span>
              )}
            </div>
          </div>

          {/* Browser Permissions */}
          <div>
            <Button
              onClick={() => {
                navigator.permissions?.query({ name: 'geolocation' as any })
                  .then(result => {
                    console.log('📍 Geolocation permission:', result.state);
                    alert(`Geolocation permission: ${result.state}`);
                  })
                  .catch(err => {
                    console.error('❌ Permission query failed:', err);
                    alert('Could not check permission status');
                  });
              }}
              size="sm"
              variant="outline"
              className="w-full text-xs h-6"
            >
              Check Permissions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationDebugPanel;