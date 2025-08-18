import React, { useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Layers, 
  Navigation, 
  Mountain, 
  Globe, 
  Satellite,
  Map,
  CheckCircle,
  Flame,
  Cloud,
  Wifi,
  Trees,
  MapPin,
  Users,
  Car
} from 'lucide-react';

interface MapOptionsDropdownProps {
  map: React.MutableRefObject<mapboxgl.Map | undefined>;
  currentMapStyle: string;
  onStyleChange: (style: string) => void;
}

export default function MapOptionsDropdown({ 
  map, 
  currentMapStyle,
  onStyleChange
}: MapOptionsDropdownProps) {
  // State for overlays
  const [overlays, setOverlays] = useState({
    traffic: false,
    fires: false,
    smoke: false,
    phoneCoverage: false,
    nationalParks: false,
    stateForests: false
  });

  // State for POI filters
  const [poiFilters, setPoiFilters] = useState({
    wide_parking: false,
    pet_stops: false,
    medical: false,
    farmers_markets: false
  });

  // State for social layers
  const [socialLayers, setSocialLayers] = useState({
    friends: false,
    community: false
  });

  // Map styles configuration (using your existing styles)
  const mapStyles = [
    { 
      id: 'mapbox://styles/mapbox/satellite-streets-v12', 
      name: 'Satellite', 
      icon: Satellite,
      description: 'Satellite imagery with labels'
    },
    { 
      id: 'mapbox://styles/mapbox/outdoors-v12', 
      name: 'Outdoors', 
      icon: Mountain,
      description: 'Topographic for off-road'
    },
    { 
      id: 'mapbox://styles/mapbox/navigation-day-v1', 
      name: 'Navigation', 
      icon: Navigation,
      description: 'Turn-by-turn optimized'
    },
    { 
      id: 'mapbox://styles/mapbox/streets-v12', 
      name: 'Streets', 
      icon: Map,
      description: 'General purpose map'
    }
  ];

  // Handle style change
  const handleStyleChange = useCallback((styleId: string) => {
    if (!map.current) return;
    
    // Store current overlay states
    const currentOverlays = { ...overlays };
    
    // Change the style
    onStyleChange(styleId);
    
    // Reapply overlays after style loads
    map.current.once('styledata', () => {
      // Reapply active overlays
      Object.entries(currentOverlays).forEach(([key, enabled]) => {
        if (enabled) {
          toggleOverlay(key as keyof typeof overlays, true);
        }
      });
    });
  }, [map, onStyleChange, overlays]);

  // Toggle overlay function
  const toggleOverlay = useCallback(async (
    overlayKey: keyof typeof overlays, 
    forceState?: boolean
  ) => {
    if (!map.current) return;
    
    const newState = forceState !== undefined ? forceState : !overlays[overlayKey];
    setOverlays(prev => ({ ...prev, [overlayKey]: newState }));

    try {
      switch (overlayKey) {
        case 'traffic':
          if (newState) {
            // Add traffic layer
            if (!map.current.getSource('mapbox-traffic')) {
              map.current.addSource('mapbox-traffic', {
                type: 'vector',
                url: 'mapbox://mapbox.mapbox-traffic-v1'
              });
              
              map.current.addLayer({
                id: 'traffic',
                type: 'line',
                source: 'mapbox-traffic',
                'source-layer': 'traffic',
                paint: {
                  'line-color': [
                    'case',
                    ['==', ['get', 'congestion'], 'low'], '#22c55e',
                    ['==', ['get', 'congestion'], 'moderate'], '#eab308',
                    ['==', ['get', 'congestion'], 'heavy'], '#f97316',
                    ['==', ['get', 'congestion'], 'severe'], '#ef4444',
                    '#6b7280'
                  ],
                  'line-width': 2,
                  'line-opacity': 0.7
                }
              });
            }
          } else {
            // Remove traffic layer
            if (map.current.getLayer('traffic')) {
              map.current.removeLayer('traffic');
            }
            if (map.current.getSource('mapbox-traffic')) {
              map.current.removeSource('mapbox-traffic');
            }
          }
          break;

        // Other overlay cases will be implemented in next phases
        default:
          console.log(`Overlay ${overlayKey} will be implemented in next phase`);
      }
    } catch (error) {
      console.error(`Error toggling ${overlayKey}:`, error);
      setOverlays(prev => ({ ...prev, [overlayKey]: false }));
    }
  }, [map, overlays]);

  // Toggle POI filter
  const togglePOIFilter = useCallback((poiKey: keyof typeof poiFilters) => {
    setPoiFilters(prev => ({ ...prev, [poiKey]: !prev[poiKey] }));
    // POI implementation will come in Phase 5
    console.log(`POI filter ${poiKey} toggled - implementation coming in Phase 5`);
  }, []);

  // Toggle social layer
  const toggleSocialLayer = useCallback((layerKey: keyof typeof socialLayers) => {
    setSocialLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
    // Social features implementation will come in Phase 6
    console.log(`Social layer ${layerKey} toggled - implementation coming in Phase 6`);
  }, []);

  // Save preferences to localStorage
  React.useEffect(() => {
    const preferences = {
      overlays,
      poiFilters,
      socialLayers
    };
    localStorage.setItem('mapOptionsPreferences', JSON.stringify(preferences));
  }, [overlays, poiFilters, socialLayers]);

  // Load preferences on mount
  React.useEffect(() => {
    const savedPreferences = localStorage.getItem('mapOptionsPreferences');
    if (savedPreferences) {
      try {
        const prefs = JSON.parse(savedPreferences);
        if (prefs.overlays) setOverlays(prefs.overlays);
        if (prefs.poiFilters) setPoiFilters(prefs.poiFilters);
        if (prefs.socialLayers) setSocialLayers(prefs.socialLayers);
      } catch (error) {
        console.error('Error loading map preferences:', error);
      }
    }
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">Map Options</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Map styles and overlays</p>
          </TooltipContent>
        </Tooltip>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-80 max-h-[600px] overflow-y-auto"
        align="end"
        sideOffset={5}
      >
        {/* Map Styles Section */}
        <DropdownMenuLabel className="flex items-center gap-2">
          <Map className="w-4 h-4" />
          Map Styles
        </DropdownMenuLabel>
        {mapStyles.map((style) => {
          const Icon = style.icon;
          const isActive = currentMapStyle === style.id;
          return (
            <DropdownMenuItem
              key={style.id}
              onClick={() => handleStyleChange(style.id)}
              className={`flex items-start gap-3 p-3 cursor-pointer ${
                isActive ? 'bg-accent' : ''
              }`}
            >
              <Icon className="w-4 h-4 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{style.name}</span>
                  {isActive && (
                    <CheckCircle className="w-4 h-4 text-primary" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {style.description}
                </span>
              </div>
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator />

        {/* Map Overlays Section */}
        <DropdownMenuLabel className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Map Overlays
        </DropdownMenuLabel>
        
        {/* Traffic */}
        <div
          className="flex items-center justify-between px-3 py-2 hover:bg-accent cursor-pointer rounded"
          onClick={() => toggleOverlay('traffic')}
        >
          <div className="flex items-center gap-3">
            <Car className="w-4 h-4" />
            <div>
              <Label className="text-sm font-medium cursor-pointer">
                Traffic
              </Label>
              <p className="text-xs text-muted-foreground">
                Real-time traffic conditions
              </p>
            </div>
          </div>
          <Switch
            checked={overlays.traffic}
            onCheckedChange={() => toggleOverlay('traffic')}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Active Fires */}
        <div
          className="flex items-center justify-between px-3 py-2 hover:bg-accent cursor-pointer rounded opacity-50"
          title="Coming in Phase 3"
        >
          <div className="flex items-center gap-3">
            <Flame className="w-4 h-4" />
            <div>
              <Label className="text-sm font-medium cursor-pointer">
                Active Fires
              </Label>
              <p className="text-xs text-muted-foreground">
                NASA wildfire data
              </p>
            </div>
          </div>
          <Switch
            checked={overlays.fires}
            disabled
          />
        </div>

        {/* Phone Coverage */}
        <div
          className="flex items-center justify-between px-3 py-2 hover:bg-accent cursor-pointer rounded opacity-50"
          title="Coming in Phase 3"
        >
          <div className="flex items-center gap-3">
            <Wifi className="w-4 h-4" />
            <div>
              <Label className="text-sm font-medium cursor-pointer">
                Phone Coverage
              </Label>
              <p className="text-xs text-muted-foreground">
                Cell tower coverage
              </p>
            </div>
          </div>
          <Switch
            checked={overlays.phoneCoverage}
            disabled
          />
        </div>

        {/* National Parks */}
        <div
          className="flex items-center justify-between px-3 py-2 hover:bg-accent cursor-pointer rounded opacity-50"
          title="Coming in Phase 4"
        >
          <div className="flex items-center gap-3">
            <Trees className="w-4 h-4" />
            <div>
              <Label className="text-sm font-medium cursor-pointer">
                National Parks
              </Label>
              <p className="text-xs text-muted-foreground">
                Park boundaries
              </p>
            </div>
          </div>
          <Switch
            checked={overlays.nationalParks}
            disabled
          />
        </div>

        <DropdownMenuSeparator />

        {/* Points of Interest Section */}
        <DropdownMenuLabel className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Points of Interest
        </DropdownMenuLabel>
        
        <DropdownMenuCheckboxItem
          checked={poiFilters.wide_parking}
          onCheckedChange={() => togglePOIFilter('wide_parking')}
          disabled
        >
          <span className="text-lg mr-2">🅿️</span>
          Wide Parking (Coming Soon)
        </DropdownMenuCheckboxItem>
        
        <DropdownMenuCheckboxItem
          checked={poiFilters.pet_stops}
          onCheckedChange={() => togglePOIFilter('pet_stops')}
          disabled
        >
          <span className="text-lg mr-2">🐾</span>
          Pet Stops (Coming Soon)
        </DropdownMenuCheckboxItem>

        <DropdownMenuSeparator />

        {/* Social Layers Section */}
        <DropdownMenuLabel className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          Social Layers
        </DropdownMenuLabel>
        
        <div
          className="flex items-center justify-between px-3 py-2 hover:bg-accent cursor-pointer rounded opacity-50"
          title="Coming in Phase 6"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">👥</span>
            <div>
              <Label className="text-sm font-medium cursor-pointer">
                Friends
              </Label>
              <p className="text-xs text-muted-foreground">
                Track friends on trips
              </p>
            </div>
          </div>
          <Switch
            checked={socialLayers.friends}
            disabled
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}