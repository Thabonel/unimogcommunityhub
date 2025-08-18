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

        case 'fires':
          if (newState) {
            // Fetch fire data from NASA FIRMS (using MODIS/VIIRS data)
            try {
              // Using a CORS-friendly endpoint or mock data for now
              const mockFireData = {
                type: 'FeatureCollection',
                features: [
                  // Mock fire points for testing - replace with real API
                  {
                    type: 'Feature',
                    geometry: {
                      type: 'Point',
                      coordinates: [-120.5, 38.5]
                    },
                    properties: {
                      brightness: 320,
                      confidence: 'high',
                      date: new Date().toISOString()
                    }
                  },
                  {
                    type: 'Feature',
                    geometry: {
                      type: 'Point', 
                      coordinates: [-121.0, 39.0]
                    },
                    properties: {
                      brightness: 350,
                      confidence: 'high',
                      date: new Date().toISOString()
                    }
                  }
                ]
              };

              if (!map.current.getSource('fires')) {
                map.current.addSource('fires', {
                  type: 'geojson',
                  data: mockFireData as any
                });

                // Add heatmap layer for fire intensity
                map.current.addLayer({
                  id: 'fire-heat',
                  type: 'heatmap',
                  source: 'fires',
                  paint: {
                    'heatmap-weight': [
                      'interpolate',
                      ['linear'],
                      ['get', 'brightness'],
                      0, 0,
                      400, 1
                    ],
                    'heatmap-intensity': 1,
                    'heatmap-color': [
                      'interpolate',
                      ['linear'],
                      ['heatmap-density'],
                      0, 'rgba(255, 255, 0, 0)',
                      0.2, 'rgba(255, 200, 0, 0.5)',
                      0.4, 'rgba(255, 150, 0, 0.6)',
                      0.6, 'rgba(255, 100, 0, 0.7)',
                      0.8, 'rgba(255, 50, 0, 0.8)',
                      1, 'rgba(255, 0, 0, 1)'
                    ],
                    'heatmap-radius': 30,
                    'heatmap-opacity': 0.7
                  }
                });

                // Add point markers for individual fires
                map.current.addLayer({
                  id: 'fire-points',
                  type: 'circle',
                  source: 'fires',
                  paint: {
                    'circle-radius': 6,
                    'circle-color': '#ff4444',
                    'circle-stroke-color': '#ffffff',
                    'circle-stroke-width': 2,
                    'circle-opacity': 0.8
                  }
                });
              }
            } catch (error) {
              console.error('Error loading fire data:', error);
            }
          } else {
            // Remove fire layers
            ['fire-heat', 'fire-points'].forEach(layerId => {
              if (map.current.getLayer(layerId)) {
                map.current.removeLayer(layerId);
              }
            });
            if (map.current.getSource('fires')) {
              map.current.removeSource('fires');
            }
          }
          break;

        case 'nationalParks':
          if (newState) {
            // Mock national parks data - replace with real GeoJSON from NPS
            const mockParksData = {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Polygon',
                    coordinates: [[
                      [-119.5, 37.5],
                      [-119.5, 38.0],
                      [-119.0, 38.0],
                      [-119.0, 37.5],
                      [-119.5, 37.5]
                    ]]
                  },
                  properties: {
                    name: 'Yosemite National Park',
                    type: 'National Park'
                  }
                },
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Polygon',
                    coordinates: [[
                      [-118.5, 36.0],
                      [-118.5, 36.5],
                      [-118.0, 36.5],
                      [-118.0, 36.0],
                      [-118.5, 36.0]
                    ]]
                  },
                  properties: {
                    name: 'Sequoia National Park',
                    type: 'National Park'
                  }
                }
              ]
            };

            if (!map.current.getSource('national-parks')) {
              map.current.addSource('national-parks', {
                type: 'geojson',
                data: mockParksData as any
              });

              // Fill layer for park areas
              map.current.addLayer({
                id: 'parks-fill',
                type: 'fill',
                source: 'national-parks',
                paint: {
                  'fill-color': '#22c55e',
                  'fill-opacity': 0.15
                }
              });

              // Outline layer for park boundaries
              map.current.addLayer({
                id: 'parks-outline',
                type: 'line',
                source: 'national-parks',
                paint: {
                  'line-color': '#16a34a',
                  'line-width': 2
                }
              });

              // Label layer for park names
              map.current.addLayer({
                id: 'parks-labels',
                type: 'symbol',
                source: 'national-parks',
                layout: {
                  'text-field': ['get', 'name'],
                  'text-size': 12,
                  'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold']
                },
                paint: {
                  'text-color': '#0f766e',
                  'text-halo-color': '#ffffff',
                  'text-halo-width': 1
                }
              });
            }
          } else {
            // Remove park layers
            ['parks-fill', 'parks-outline', 'parks-labels'].forEach(layerId => {
              if (map.current.getLayer(layerId)) {
                map.current.removeLayer(layerId);
              }
            });
            if (map.current.getSource('national-parks')) {
              map.current.removeSource('national-parks');
            }
          }
          break;

        case 'stateForests':
          if (newState) {
            // Mock state forests data
            const mockForestsData = {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Polygon',
                    coordinates: [[
                      [-120.5, 39.0],
                      [-120.5, 39.5],
                      [-120.0, 39.5],
                      [-120.0, 39.0],
                      [-120.5, 39.0]
                    ]]
                  },
                  properties: {
                    name: 'Tahoe National Forest',
                    type: 'State Forest'
                  }
                }
              ]
            };

            if (!map.current.getSource('state-forests')) {
              map.current.addSource('state-forests', {
                type: 'geojson',
                data: mockForestsData as any
              });

              // Fill layer for forest areas (darker green)
              map.current.addLayer({
                id: 'forests-fill',
                type: 'fill',
                source: 'state-forests',
                paint: {
                  'fill-color': '#059669',
                  'fill-opacity': 0.12
                }
              });

              // Outline layer for forest boundaries
              map.current.addLayer({
                id: 'forests-outline',
                type: 'line',
                source: 'state-forests',
                paint: {
                  'line-color': '#047857',
                  'line-width': 1.5,
                  'line-dasharray': [3, 2]
                }
              });

              // Label layer for forest names
              map.current.addLayer({
                id: 'forests-labels',
                type: 'symbol',
                source: 'state-forests',
                layout: {
                  'text-field': ['get', 'name'],
                  'text-size': 11,
                  'text-font': ['Open Sans Semibold', 'Arial Unicode MS Regular']
                },
                paint: {
                  'text-color': '#065f46',
                  'text-halo-color': '#ffffff',
                  'text-halo-width': 1
                }
              });
            }
          } else {
            // Remove forest layers
            ['forests-fill', 'forests-outline', 'forests-labels'].forEach(layerId => {
              if (map.current.getLayer(layerId)) {
                map.current.removeLayer(layerId);
              }
            });
            if (map.current.getSource('state-forests')) {
              map.current.removeSource('state-forests');
            }
          }
          break;

        case 'phoneCoverage':
          if (newState) {
            // Mock phone coverage data for testing
            const mockCoverageData = {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Polygon',
                    coordinates: [[
                      [-122.5, 37.5],
                      [-122.5, 38.5],
                      [-121.5, 38.5],
                      [-121.5, 37.5],
                      [-122.5, 37.5]
                    ]]
                  },
                  properties: {
                    coverage: 'good',
                    provider: 'Multiple'
                  }
                }
              ]
            };

            if (!map.current.getSource('phone-coverage')) {
              map.current.addSource('phone-coverage', {
                type: 'geojson',
                data: mockCoverageData as any
              });

              map.current.addLayer({
                id: 'phone-coverage-fill',
                type: 'fill',
                source: 'phone-coverage',
                paint: {
                  'fill-color': '#22c55e',
                  'fill-opacity': 0.2
                }
              });

              map.current.addLayer({
                id: 'phone-coverage-outline',
                type: 'line',
                source: 'phone-coverage',
                paint: {
                  'line-color': '#16a34a',
                  'line-width': 2,
                  'line-dasharray': [2, 2]
                }
              });
            }
          } else {
            // Remove coverage layers
            ['phone-coverage-fill', 'phone-coverage-outline'].forEach(layerId => {
              if (map.current.getLayer(layerId)) {
                map.current.removeLayer(layerId);
              }
            });
            if (map.current.getSource('phone-coverage')) {
              map.current.removeSource('phone-coverage');
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
  const togglePOIFilter = useCallback(async (poiKey: keyof typeof poiFilters) => {
    if (!map.current) return;
    
    const newState = !poiFilters[poiKey];
    setPoiFilters(prev => ({ ...prev, [poiKey]: newState }));
    
    try {
      const sourceId = `poi-${poiKey}`;
      const layerId = `poi-${poiKey}-markers`;
      
      if (newState) {
        // Add POI markers based on type
        let poiData: any = null;
        
        switch (poiKey) {
          case 'wide_parking':
            // Mock data for wide parking spots suitable for Unimogs
            poiData = {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [-122.4194, 37.7749]
                  },
                  properties: {
                    name: 'Golden Gate Rest Area',
                    description: 'Large vehicle parking available',
                    type: 'wide_parking'
                  }
                },
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [-121.8863, 37.3382]
                  },
                  properties: {
                    name: 'San Jose Truck Stop',
                    description: '24/7 wide vehicle parking',
                    type: 'wide_parking'
                  }
                }
              ]
            };
            break;
            
          case 'pet_stops':
            // Mock data for pet-friendly stops
            poiData = {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [-122.3321, 37.5753]
                  },
                  properties: {
                    name: 'Dog Park Rest Area',
                    description: 'Off-leash area available',
                    type: 'pet_stops'
                  }
                },
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [-121.9552, 37.3541]
                  },
                  properties: {
                    name: 'Pet Relief Station',
                    description: 'Water and waste disposal',
                    type: 'pet_stops'
                  }
                }
              ]
            };
            break;
            
          case 'medical':
            // Mock data for medical facilities
            poiData = {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [-122.4304, 37.7749]
                  },
                  properties: {
                    name: 'SF General Hospital',
                    description: '24/7 Emergency Room',
                    type: 'medical'
                  }
                },
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [-121.8946, 37.3349]
                  },
                  properties: {
                    name: 'Valley Medical Center',
                    description: 'Urgent Care Available',
                    type: 'medical'
                  }
                }
              ]
            };
            break;
            
          case 'farmers_markets':
            // Mock data for farmers markets
            poiData = {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [-122.4194, 37.7749]
                  },
                  properties: {
                    name: 'Ferry Building Market',
                    description: 'Saturdays 8am-2pm',
                    type: 'farmers_markets'
                  }
                },
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [-121.9018, 37.3322]
                  },
                  properties: {
                    name: 'Downtown Farmers Market',
                    description: 'Sundays 9am-1pm',
                    type: 'farmers_markets'
                  }
                }
              ]
            };
            break;
        }
        
        if (poiData) {
          // Add source if it doesn't exist
          if (!map.current.getSource(sourceId)) {
            map.current.addSource(sourceId, {
              type: 'geojson',
              data: poiData
            });
          }
          
          // Add marker layer if it doesn't exist
          if (!map.current.getLayer(layerId)) {
            // Define icon and color based on POI type
            const poiStyles: Record<string, { icon: string; color: string }> = {
              wide_parking: { icon: '🅿️', color: '#3b82f6' },
              pet_stops: { icon: '🐾', color: '#10b981' },
              medical: { icon: '🚑', color: '#ef4444' },
              farmers_markets: { icon: '🥕', color: '#f97316' }
            };
            
            const style = poiStyles[poiKey];
            
            // Add circle marker layer
            map.current.addLayer({
              id: layerId,
              type: 'circle',
              source: sourceId,
              paint: {
                'circle-radius': 8,
                'circle-color': style.color,
                'circle-stroke-color': '#ffffff',
                'circle-stroke-width': 2,
                'circle-opacity': 0.9
              }
            });
            
            // Add text label layer
            map.current.addLayer({
              id: `${layerId}-labels`,
              type: 'symbol',
              source: sourceId,
              layout: {
                'text-field': style.icon,
                'text-size': 16,
                'text-anchor': 'center',
                'text-allow-overlap': true
              }
            });
            
            // Add click handler for popups
            map.current.on('click', layerId, (e) => {
              if (!e.features || e.features.length === 0) return;
              
              const feature = e.features[0];
              const coordinates = (feature.geometry as any).coordinates.slice();
              const properties = feature.properties;
              
              // Create popup content
              const popupContent = `
                <div style="padding: 8px;">
                  <h3 style="margin: 0 0 4px 0; font-weight: bold;">${properties.name}</h3>
                  <p style="margin: 0; color: #666; font-size: 14px;">${properties.description}</p>
                </div>
              `;
              
              // Create and show popup
              new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(popupContent)
                .addTo(map.current!);
            });
            
            // Change cursor on hover
            map.current.on('mouseenter', layerId, () => {
              if (map.current) map.current.getCanvas().style.cursor = 'pointer';
            });
            
            map.current.on('mouseleave', layerId, () => {
              if (map.current) map.current.getCanvas().style.cursor = '';
            });
          }
        }
      } else {
        // Remove POI layers
        const layersToRemove = [layerId, `${layerId}-labels`];
        
        layersToRemove.forEach(id => {
          if (map.current?.getLayer(id)) {
            // Remove click handlers
            map.current.off('click', id);
            map.current.off('mouseenter', id);
            map.current.off('mouseleave', id);
            // Remove layer
            map.current.removeLayer(id);
          }
        });
        
        // Remove source
        if (map.current?.getSource(sourceId)) {
          map.current.removeSource(sourceId);
        }
      }
    } catch (error) {
      console.error(`Error toggling POI ${poiKey}:`, error);
      setPoiFilters(prev => ({ ...prev, [poiKey]: false }));
    }
  }, [map, poiFilters]);

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
          className="flex items-center justify-between px-3 py-2 hover:bg-accent cursor-pointer rounded"
          onClick={() => toggleOverlay('fires')}
        >
          <div className="flex items-center gap-3">
            <Flame className="w-4 h-4 text-orange-500" />
            <div>
              <Label className="text-sm font-medium cursor-pointer">
                Active Fires
              </Label>
              <p className="text-xs text-muted-foreground">
                Wildfire hotspots
              </p>
            </div>
          </div>
          <Switch
            checked={overlays.fires}
            onCheckedChange={() => toggleOverlay('fires')}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Phone Coverage */}
        <div
          className="flex items-center justify-between px-3 py-2 hover:bg-accent cursor-pointer rounded"
          onClick={() => toggleOverlay('phoneCoverage')}
        >
          <div className="flex items-center gap-3">
            <Wifi className="w-4 h-4 text-green-600" />
            <div>
              <Label className="text-sm font-medium cursor-pointer">
                Phone Coverage
              </Label>
              <p className="text-xs text-muted-foreground">
                Cell signal areas
              </p>
            </div>
          </div>
          <Switch
            checked={overlays.phoneCoverage}
            onCheckedChange={() => toggleOverlay('phoneCoverage')}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* National Parks */}
        <div
          className="flex items-center justify-between px-3 py-2 hover:bg-accent cursor-pointer rounded"
          onClick={() => toggleOverlay('nationalParks')}
        >
          <div className="flex items-center gap-3">
            <Trees className="w-4 h-4 text-green-700" />
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
            onCheckedChange={() => toggleOverlay('nationalParks')}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* State Forests */}
        <div
          className="flex items-center justify-between px-3 py-2 hover:bg-accent cursor-pointer rounded"
          onClick={() => toggleOverlay('stateForests')}
        >
          <div className="flex items-center gap-3">
            <Trees className="w-4 h-4 text-emerald-700" />
            <div>
              <Label className="text-sm font-medium cursor-pointer">
                State Forests
              </Label>
              <p className="text-xs text-muted-foreground">
                Forest boundaries
              </p>
            </div>
          </div>
          <Switch
            checked={overlays.stateForests}
            onCheckedChange={() => toggleOverlay('stateForests')}
            onClick={(e) => e.stopPropagation()}
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
        >
          <span className="text-lg mr-2">🅿️</span>
          Wide Parking
        </DropdownMenuCheckboxItem>
        
        <DropdownMenuCheckboxItem
          checked={poiFilters.pet_stops}
          onCheckedChange={() => togglePOIFilter('pet_stops')}
        >
          <span className="text-lg mr-2">🐾</span>
          Pet Stops
        </DropdownMenuCheckboxItem>
        
        <DropdownMenuCheckboxItem
          checked={poiFilters.medical}
          onCheckedChange={() => togglePOIFilter('medical')}
        >
          <span className="text-lg mr-2">🚑</span>
          Medical Facilities
        </DropdownMenuCheckboxItem>
        
        <DropdownMenuCheckboxItem
          checked={poiFilters.farmers_markets}
          onCheckedChange={() => togglePOIFilter('farmers_markets')}
        >
          <span className="text-lg mr-2">🥕</span>
          Farmers Markets
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