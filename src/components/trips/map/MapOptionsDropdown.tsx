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
import { searchPOIsByCategory, convertPOIsToGeoJSON, getFallbackPOIData, SearchBounds } from '@/services/mapboxSearchService';
import {
  fetchActiveFires,
  fetchNationalParks,
  fetchStateForests,
  fetchMobileCoverage,
  MOBILE_CARRIERS,
  CarrierKey
} from '@/services/australianOverlaysService';
import {
  Layers,
  Mountain,
  Globe,
  Satellite,
  Map,
  CheckCircle,
  Flame,
  Trees,
  MapPin,
  Users,
  Car,
  X,
  Info,
  Loader2,
  Signal
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
    phoneCoverage: false,
    nationalParks: false,
    stateForests: false
  });

  // State for loading indicators
  const [loading, setLoading] = useState({
    fires: false,
    nationalParks: false,
    stateForests: false,
    phoneCoverage: false
  });

  // State for individual mobile carrier toggles
  const [carrierToggles, setCarrierToggles] = useState<Record<CarrierKey, boolean>>({
    telstra_4g: false,
    telstra_5g: false,
    optus_4g: false,
    optus_5g: false,
    tpg_4g: false,
    tpg_5g: false
  });

  // State for POI filters
  const [poiFilters, setPoiFilters] = useState({
    wide_parking: false,
    pet_stops: false,
    medical: false,
    farmers_markets: false,
    user_pois: false
  });

  // State for social layers
  const [socialLayers, setSocialLayers] = useState({
    friends: false,
    community: false
  });

  // Map styles configuration - Off-road focused styles compatible with Directions plugin
  const mapStyles = [
    {
      id: 'mapbox://styles/mapbox/outdoors-v12',
      name: 'Outdoors',
      icon: Mountain,
      description: 'Primary off-road with topography'
    },
    {
      id: 'mapbox://styles/mapbox/satellite-streets-v12',
      name: 'Satellite',
      icon: Satellite,
      description: 'Satellite imagery with street data'
    }
  ];

  // Handle style change
  const handleStyleChange = useCallback((styleId: string) => {
    if (!map.current) return;
    
    // Store current states
    const currentOverlays = { ...overlays };
    const currentPOIs = { ...poiFilters };
    const currentSocial = { ...socialLayers };
    
    // Change the style
    onStyleChange(styleId);
    
    // Reapply all active layers after style loads
    map.current.once('styledata', () => {
      // Reapply active overlays
      Object.entries(currentOverlays).forEach(([key, enabled]) => {
        if (enabled) {
          toggleOverlay(key as keyof typeof overlays, true);
        }
      });
      
      // Reapply active POI filters
      Object.entries(currentPOIs).forEach(([key, enabled]) => {
        if (enabled) {
          togglePOIFilter(key as keyof typeof poiFilters);
        }
      });
      
      // Reapply active social layers
      Object.entries(currentSocial).forEach(([key, enabled]) => {
        if (enabled) {
          toggleSocialLayer(key as keyof typeof socialLayers);
        }
      });
    });
  }, [map, onStyleChange, overlays, poiFilters, socialLayers]);

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
            // Fetch real fire data from NASA FIRMS API
            setLoading(prev => ({ ...prev, fires: true }));
            try {
              const fireData = await fetchActiveFires(2); // Last 2 days

              if (!map.current) return;

              if (map.current.getSource('fires')) {
                // Update existing source
                (map.current.getSource('fires') as mapboxgl.GeoJSONSource).setData(fireData as any);
              } else {
                map.current.addSource('fires', {
                  type: 'geojson',
                  data: fireData as any
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
                      250, 0,
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
                    'heatmap-radius': 25,
                    'heatmap-opacity': 0.7
                  }
                });

                // Add point markers for individual fires
                map.current.addLayer({
                  id: 'fire-points',
                  type: 'circle',
                  source: 'fires',
                  paint: {
                    'circle-radius': [
                      'interpolate',
                      ['linear'],
                      ['get', 'frp'],
                      0, 4,
                      50, 8,
                      100, 12
                    ],
                    'circle-color': [
                      'case',
                      ['==', ['get', 'confidence'], 'high'], '#ff0000',
                      ['==', ['get', 'confidence'], 'nominal'], '#ff6600',
                      '#ffaa00'
                    ],
                    'circle-stroke-color': '#ffffff',
                    'circle-stroke-width': 2,
                    'circle-opacity': 0.9
                  }
                });

                // Add popup on click
                map.current.on('click', 'fire-points', (e) => {
                  if (!e.features || !e.features[0]) return;
                  const props = e.features[0].properties;
                  const coords = (e.features[0].geometry as any).coordinates;

                  new mapboxgl.Popup()
                    .setLngLat(coords)
                    .setHTML(`
                      <div class="p-2">
                        <strong class="text-red-600">Active Fire</strong><br/>
                        <span>Brightness: ${props?.brightness || 'N/A'}</span><br/>
                        <span>Confidence: ${props?.confidence || 'N/A'}</span><br/>
                        <span>Date: ${props?.acq_date || 'N/A'}</span><br/>
                        <span>Satellite: ${props?.satellite || 'VIIRS'}</span>
                      </div>
                    `)
                    .addTo(map.current!);
                });

                map.current.on('mouseenter', 'fire-points', () => {
                  if (map.current) map.current.getCanvas().style.cursor = 'pointer';
                });
                map.current.on('mouseleave', 'fire-points', () => {
                  if (map.current) map.current.getCanvas().style.cursor = '';
                });
              }

              console.log(`[Fires] Displayed ${fireData.features.length} active fires`);
            } catch (error) {
              console.error('Error loading fire data:', error);
            } finally {
              setLoading(prev => ({ ...prev, fires: false }));
            }
          } else {
            // Remove fire layers
            ['fire-heat', 'fire-points'].forEach(layerId => {
              if (map.current?.getLayer(layerId)) {
                map.current.removeLayer(layerId);
              }
            });
            if (map.current?.getSource('fires')) {
              map.current.removeSource('fires');
            }
          }
          break;

        case 'nationalParks':
          if (newState) {
            // Fetch real data from CAPAD (Australian Protected Areas)
            setLoading(prev => ({ ...prev, nationalParks: true }));
            try {
              const parksData = await fetchNationalParks();

              if (!map.current) return;

              if (map.current.getSource('national-parks')) {
                (map.current.getSource('national-parks') as mapboxgl.GeoJSONSource).setData(parksData as any);
              } else {
                map.current.addSource('national-parks', {
                  type: 'geojson',
                  data: parksData as any
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
                    'text-field': ['get', 'NAME'],
                    'text-size': 12,
                    'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold']
                  },
                  paint: {
                    'text-color': '#0f766e',
                    'text-halo-color': '#ffffff',
                    'text-halo-width': 1
                  }
                });

                // Add popup on click
                map.current.on('click', 'parks-fill', (e) => {
                  if (!e.features || !e.features[0]) return;
                  const props = e.features[0].properties;

                  new mapboxgl.Popup()
                    .setLngLat(e.lngLat)
                    .setHTML(`
                      <div class="p-2">
                        <strong class="text-green-700">${props?.NAME || 'Protected Area'}</strong><br/>
                        <span>Type: ${props?.TYPE || 'N/A'}</span><br/>
                        <span>State: ${props?.STATE || 'N/A'}</span><br/>
                        ${props?.AREA_KM2 ? `<span>Area: ${Math.round(props.AREA_KM2)} km²</span>` : ''}
                      </div>
                    `)
                    .addTo(map.current!);
                });

                map.current.on('mouseenter', 'parks-fill', () => {
                  if (map.current) map.current.getCanvas().style.cursor = 'pointer';
                });
                map.current.on('mouseleave', 'parks-fill', () => {
                  if (map.current) map.current.getCanvas().style.cursor = '';
                });
              }

              console.log(`[Parks] Displayed ${parksData.features?.length || 0} national parks`);
            } catch (error) {
              console.error('Error loading parks data:', error);
            } finally {
              setLoading(prev => ({ ...prev, nationalParks: false }));
            }
          } else {
            // Remove park layers
            ['parks-fill', 'parks-outline', 'parks-labels'].forEach(layerId => {
              if (map.current?.getLayer(layerId)) {
                map.current.removeLayer(layerId);
              }
            });
            if (map.current?.getSource('national-parks')) {
              map.current.removeSource('national-parks');
            }
          }
          break;

        case 'stateForests':
          if (newState) {
            // Fetch real data from ABARES Forests of Australia
            setLoading(prev => ({ ...prev, stateForests: true }));
            try {
              const forestsData = await fetchStateForests();

              if (!map.current) return;

              if (map.current.getSource('state-forests')) {
                (map.current.getSource('state-forests') as mapboxgl.GeoJSONSource).setData(forestsData as any);
              } else {
                map.current.addSource('state-forests', {
                  type: 'geojson',
                  data: forestsData as any
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
                    'text-field': ['get', 'TENURE'],
                    'text-size': 11,
                    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Regular']
                  },
                  paint: {
                    'text-color': '#065f46',
                    'text-halo-color': '#ffffff',
                    'text-halo-width': 1
                  }
                });

                // Add popup on click
                map.current.on('click', 'forests-fill', (e) => {
                  if (!e.features || !e.features[0]) return;
                  const props = e.features[0].properties;

                  new mapboxgl.Popup()
                    .setLngLat(e.lngLat)
                    .setHTML(`
                      <div class="p-2">
                        <strong class="text-emerald-700">${props?.TENURE || 'State Forest'}</strong><br/>
                        <span>Type: ${props?.FOREST_TYP || 'N/A'}</span><br/>
                        <span>State: ${props?.STATE || 'N/A'}</span>
                      </div>
                    `)
                    .addTo(map.current!);
                });

                map.current.on('mouseenter', 'forests-fill', () => {
                  if (map.current) map.current.getCanvas().style.cursor = 'pointer';
                });
                map.current.on('mouseleave', 'forests-fill', () => {
                  if (map.current) map.current.getCanvas().style.cursor = '';
                });
              }

              console.log(`[Forests] Displayed ${forestsData.features?.length || 0} state forests`);
            } catch (error) {
              console.error('Error loading forests data:', error);
            } finally {
              setLoading(prev => ({ ...prev, stateForests: false }));
            }
          } else {
            // Remove forest layers
            ['forests-fill', 'forests-outline', 'forests-labels'].forEach(layerId => {
              if (map.current?.getLayer(layerId)) {
                map.current.removeLayer(layerId);
              }
            });
            if (map.current?.getSource('state-forests')) {
              map.current.removeSource('state-forests');
            }
          }
          break;

        case 'phoneCoverage':
          if (newState) {
            // Fetch real mobile coverage data from ACCC API for Australian carriers
            setLoading(prev => ({ ...prev, phoneCoverage: true }));

            try {
              // Load all enabled carriers (or default to Telstra 4G if none selected)
              const activeCarriers = Object.entries(carrierToggles)
                .filter(([_, enabled]) => enabled)
                .map(([key]) => key as CarrierKey);

              // If no carriers selected, enable Telstra 4G by default
              const carriersToLoad = activeCarriers.length > 0
                ? activeCarriers
                : ['telstra_4g' as CarrierKey];

              if (activeCarriers.length === 0) {
                setCarrierToggles(prev => ({ ...prev, telstra_4g: true }));
              }

              // Get current map bounds for Australia-focused query
              const bounds = map.current.getBounds();
              const queryBounds = {
                west: Math.max(bounds.getWest(), 110),
                south: Math.max(bounds.getSouth(), -45),
                east: Math.min(bounds.getEast(), 155),
                north: Math.min(bounds.getNorth(), -10)
              };

              // Load coverage for each carrier
              for (const carrier of carriersToLoad) {
                const carrierInfo = MOBILE_CARRIERS[carrier];
                const sourceId = `coverage-${carrier}`;
                const fillLayerId = `coverage-${carrier}-fill`;
                const outlineLayerId = `coverage-${carrier}-outline`;

                // Remove existing layers if present
                [fillLayerId, outlineLayerId].forEach(id => {
                  if (map.current?.getLayer(id)) map.current.removeLayer(id);
                });
                if (map.current?.getSource(sourceId)) map.current.removeSource(sourceId);

                // Fetch data from ACCC API
                const coverageData = await fetchMobileCoverage(carrier, queryBounds);

                if (coverageData.features && coverageData.features.length > 0) {
                  map.current.addSource(sourceId, {
                    type: 'geojson',
                    data: coverageData as any
                  });

                  // Fill layer with carrier-specific color
                  map.current.addLayer({
                    id: fillLayerId,
                    type: 'fill',
                    source: sourceId,
                    paint: {
                      'fill-color': carrierInfo.color,
                      'fill-opacity': 0.25
                    }
                  });

                  // Outline layer
                  map.current.addLayer({
                    id: outlineLayerId,
                    type: 'line',
                    source: sourceId,
                    paint: {
                      'line-color': carrierInfo.color,
                      'line-width': 1.5
                    }
                  });

                  // Popup on click
                  map.current.on('click', fillLayerId, (e: any) => {
                    if (!e.features || e.features.length === 0) return;

                    const feature = e.features[0];
                    const props = feature.properties || {};

                    new mapboxgl.Popup({ closeButton: true, maxWidth: '300px' })
                      .setLngLat(e.lngLat)
                      .setHTML(`
                        <div class="p-2">
                          <div class="font-bold text-sm" style="color: ${carrierInfo.color}">${carrierInfo.name}</div>
                          <div class="text-xs text-gray-600 mt-1">Mobile Coverage Area</div>
                          ${props.signal_strength ? `<div class="text-xs mt-1">Signal: ${props.signal_strength}</div>` : ''}
                        </div>
                      `)
                      .addTo(map.current!);
                  });

                  // Cursor on hover
                  map.current.on('mouseenter', fillLayerId, () => {
                    if (map.current) map.current.getCanvas().style.cursor = 'pointer';
                  });

                  map.current.on('mouseleave', fillLayerId, () => {
                    if (map.current) map.current.getCanvas().style.cursor = '';
                  });

                  console.log(`[Coverage] Loaded ${coverageData.features.length} areas for ${carrierInfo.name}`);
                } else {
                  console.log(`[Coverage] No coverage data available for ${carrierInfo.name}`);
                }
              }
            } catch (error) {
              console.error('Error loading coverage data:', error);
            } finally {
              setLoading(prev => ({ ...prev, phoneCoverage: false }));
            }
          } else {
            // Remove ALL carrier coverage layers
            Object.keys(MOBILE_CARRIERS).forEach(carrier => {
              const sourceId = `coverage-${carrier}`;
              const fillLayerId = `coverage-${carrier}-fill`;
              const outlineLayerId = `coverage-${carrier}-outline`;

              [fillLayerId, outlineLayerId].forEach(id => {
                if (map.current?.getLayer(id)) {
                  map.current.removeLayer(id);
                }
              });

              if (map.current?.getSource(sourceId)) {
                map.current.removeSource(sourceId);
              }
            });

            // Reset carrier toggles
            setCarrierToggles({
              telstra_4g: false,
              telstra_5g: false,
              optus_4g: false,
              optus_5g: false,
              tpg_4g: false,
              tpg_5g: false
            });
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
  }, [map, overlays, carrierToggles]);

  // Toggle individual carrier coverage
  const toggleCarrier = useCallback(async (carrier: CarrierKey) => {
    if (!map.current) return;

    const newState = !carrierToggles[carrier];
    setCarrierToggles(prev => ({ ...prev, [carrier]: newState }));

    const carrierInfo = MOBILE_CARRIERS[carrier];
    const sourceId = `coverage-${carrier}`;
    const fillLayerId = `coverage-${carrier}-fill`;
    const outlineLayerId = `coverage-${carrier}-outline`;

    if (newState) {
      // Add this carrier's coverage
      try {
        const bounds = map.current.getBounds();
        const queryBounds = {
          west: Math.max(bounds.getWest(), 110),
          south: Math.max(bounds.getSouth(), -45),
          east: Math.min(bounds.getEast(), 155),
          north: Math.min(bounds.getNorth(), -10)
        };

        const coverageData = await fetchMobileCoverage(carrier, queryBounds);

        if (coverageData.features && coverageData.features.length > 0) {
          // Remove existing if present
          [fillLayerId, outlineLayerId].forEach(id => {
            if (map.current?.getLayer(id)) map.current.removeLayer(id);
          });
          if (map.current?.getSource(sourceId)) map.current.removeSource(sourceId);

          map.current.addSource(sourceId, {
            type: 'geojson',
            data: coverageData as any
          });

          map.current.addLayer({
            id: fillLayerId,
            type: 'fill',
            source: sourceId,
            paint: {
              'fill-color': carrierInfo.color,
              'fill-opacity': 0.25
            }
          });

          map.current.addLayer({
            id: outlineLayerId,
            type: 'line',
            source: sourceId,
            paint: {
              'line-color': carrierInfo.color,
              'line-width': 1.5
            }
          });

          map.current.on('click', fillLayerId, (e: any) => {
            if (!e.features || e.features.length === 0) return;

            new mapboxgl.Popup({ closeButton: true, maxWidth: '300px' })
              .setLngLat(e.lngLat)
              .setHTML(`
                <div class="p-2">
                  <div class="font-bold text-sm" style="color: ${carrierInfo.color}">${carrierInfo.name}</div>
                  <div class="text-xs text-gray-600 mt-1">Mobile Coverage Area</div>
                </div>
              `)
              .addTo(map.current!);
          });

          map.current.on('mouseenter', fillLayerId, () => {
            if (map.current) map.current.getCanvas().style.cursor = 'pointer';
          });

          map.current.on('mouseleave', fillLayerId, () => {
            if (map.current) map.current.getCanvas().style.cursor = '';
          });

          console.log(`[Coverage] Toggled ON: ${carrierInfo.name}`);
        }
      } catch (error) {
        console.error(`Error loading ${carrier} coverage:`, error);
        setCarrierToggles(prev => ({ ...prev, [carrier]: false }));
      }
    } else {
      // Remove this carrier's coverage
      [fillLayerId, outlineLayerId].forEach(id => {
        if (map.current?.getLayer(id)) map.current.removeLayer(id);
      });
      if (map.current?.getSource(sourceId)) map.current.removeSource(sourceId);
      console.log(`[Coverage] Toggled OFF: ${carrierInfo.name}`);
    }
  }, [map, carrierToggles]);

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

        // Handle different POI types
        if (poiKey === 'user_pois') {
          // Load user-created POIs from database
          try {
            if (map.current) {
              const bounds = map.current.getBounds();
              const boundsObj = {
                north: bounds.getNorth(),
                south: bounds.getSouth(),
                east: bounds.getEast(),
                west: bounds.getWest()
              };

              // Import the POI service dynamically to avoid circular dependencies
              const { getPOIsInBounds, POI_ICONS } = await import('@/services/poiService');
              const userPOIs = await getPOIsInBounds(boundsObj);

              // Convert POIs to GeoJSON format
              poiData = {
                type: 'FeatureCollection',
                features: userPOIs.map(poi => ({
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: poi.coordinates
                  },
                  properties: {
                    id: poi.id,
                    name: poi.name,
                    description: poi.description || '',
                    type: poi.type,
                    created_by: poi.created_by,
                    rating: poi.rating,
                    icon: POI_ICONS[poi.type]?.icon || '📍',
                    color: POI_ICONS[poi.type]?.color || '#64748b'
                  }
                }))
              };
            }
          } catch (error) {
            console.error('Error loading user POIs:', error);
            // Create empty feature collection if error
            poiData = {
              type: 'FeatureCollection',
              features: []
            };
          }
        } else {
          // Use Mapbox Search API for other POI types
          try {
            if (map.current) {
              const bounds = map.current.getBounds();
              const searchBounds: SearchBounds = {
                north: bounds.getNorth(),
                south: bounds.getSouth(),
                east: bounds.getEast(),
                west: bounds.getWest()
              };

              const pois = await searchPOIsByCategory(poiKey, searchBounds, 50);

              if (pois.length > 0) {
                poiData = convertPOIsToGeoJSON(pois, poiKey);
              } else {
                // Fallback to mock data if no results from API
                console.log(`No POIs found for ${poiKey}, using fallback data`);
                poiData = getFallbackPOIData(poiKey);
              }
            }
          } catch (error) {
            console.error(`Error loading Mapbox POIs for ${poiKey}:`, error);
            // Use fallback data on error
            poiData = getFallbackPOIData(poiKey);
          }
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
              farmers_markets: { icon: '🥕', color: '#f97316' },
              user_pois: { icon: '📍', color: '#8b5cf6' }
            };
            
            const style = poiStyles[poiKey];
            
            // Add circle marker layer
            if (poiKey === 'user_pois') {
              // For user POIs, use property-based styling
              map.current.addLayer({
                id: layerId,
                type: 'circle',
                source: sourceId,
                paint: {
                  'circle-radius': 8,
                  'circle-color': ['get', 'color'],
                  'circle-stroke-color': '#ffffff',
                  'circle-stroke-width': 2,
                  'circle-opacity': 0.9
                }
              });

              // Add text label layer with individual icons
              map.current.addLayer({
                id: `${layerId}-labels`,
                type: 'symbol',
                source: sourceId,
                layout: {
                  'text-field': ['get', 'icon'],
                  'text-size': 16,
                  'text-anchor': 'center',
                  'text-allow-overlap': true
                }
              });
            } else {
              // For other POI types, use fixed styling
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
            }
            
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
  const toggleSocialLayer = useCallback(async (layerKey: keyof typeof socialLayers) => {
    if (!map.current) return;
    
    const newState = !socialLayers[layerKey];
    setSocialLayers(prev => ({ ...prev, [layerKey]: newState }));
    
    try {
      const sourceId = `social-${layerKey}`;
      const layerId = `social-${layerKey}-markers`;
      
      if (newState) {
        switch (layerKey) {
          case 'friends':
            // Mock data for friends' locations - in production would fetch from Supabase
            const friendsData = {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [-122.4, 37.8]
                  },
                  properties: {
                    name: 'John\'s Unimog',
                    status: 'On trail - Tahoe National Forest',
                    lastUpdate: '5 minutes ago',
                    vehicleType: '1300L',
                    avatar: '👤'
                  }
                },
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [-121.9, 37.4]
                  },
                  properties: {
                    name: 'Sarah\'s Unimog',
                    status: 'Camping - Yosemite',
                    lastUpdate: '1 hour ago',
                    vehicleType: '416 Doka',
                    avatar: '👥'
                  }
                },
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [-122.2, 37.6]
                  },
                  properties: {
                    name: 'Mike\'s Unimog',
                    status: 'Maintenance stop',
                    lastUpdate: '30 minutes ago',
                    vehicleType: 'U5000',
                    avatar: '🔧'
                  }
                }
              ]
            };
            
            if (!map.current.getSource(sourceId)) {
              map.current.addSource(sourceId, {
                type: 'geojson',
                data: friendsData as any
              });
            }
            
            if (!map.current.getLayer(layerId)) {
              // Add pulsing circle for live locations
              map.current.addLayer({
                id: `${layerId}-pulse`,
                type: 'circle',
                source: sourceId,
                paint: {
                  'circle-radius': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    5, 20,
                    10, 30
                  ],
                  'circle-color': '#3b82f6',
                  'circle-opacity': 0.2,
                  'circle-blur': 0.5
                }
              });
              
              // Add friend marker
              map.current.addLayer({
                id: layerId,
                type: 'circle',
                source: sourceId,
                paint: {
                  'circle-radius': 10,
                  'circle-color': '#3b82f6',
                  'circle-stroke-color': '#ffffff',
                  'circle-stroke-width': 3,
                  'circle-opacity': 1
                }
              });
              
              // Add avatar/icon layer
              map.current.addLayer({
                id: `${layerId}-icons`,
                type: 'symbol',
                source: sourceId,
                layout: {
                  'text-field': ['get', 'avatar'],
                  'text-size': 14,
                  'text-anchor': 'center',
                  'text-allow-overlap': true
                }
              });
              
              // Add name labels
              map.current.addLayer({
                id: `${layerId}-labels`,
                type: 'symbol',
                source: sourceId,
                layout: {
                  'text-field': ['get', 'name'],
                  'text-size': 11,
                  'text-anchor': 'top',
                  'text-offset': [0, 1.5],
                  'text-font': ['Open Sans Semibold', 'Arial Unicode MS Regular']
                },
                paint: {
                  'text-color': '#1e40af',
                  'text-halo-color': '#ffffff',
                  'text-halo-width': 2
                }
              });
              
              // Add click handler for friend details
              map.current.on('click', layerId, (e) => {
                if (!e.features || e.features.length === 0) return;
                
                const feature = e.features[0];
                const coordinates = (feature.geometry as any).coordinates.slice();
                const props = feature.properties;
                
                const popupContent = `
                  <div style="padding: 10px; min-width: 200px;">
                    <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #1e40af;">
                      ${props.avatar} ${props.name}
                    </h3>
                    <div style="font-size: 14px; color: #666; margin-bottom: 6px;">
                      <strong>Vehicle:</strong> ${props.vehicleType}
                    </div>
                    <div style="font-size: 14px; color: #666; margin-bottom: 6px;">
                      <strong>Status:</strong> ${props.status}
                    </div>
                    <div style="font-size: 12px; color: #999;">
                      <em>Updated ${props.lastUpdate}</em>
                    </div>
                    <button style="
                      margin-top: 10px;
                      width: 100%;
                      padding: 6px 12px;
                      background: #3b82f6;
                      color: white;
                      border: none;
                      border-radius: 4px;
                      cursor: pointer;
                      font-size: 14px;
                    " onclick="alert('Message feature coming soon!')">
                      Send Message
                    </button>
                  </div>
                `;
                
                new mapboxgl.Popup({ closeButton: true })
                  .setLngLat(coordinates)
                  .setHTML(popupContent)
                  .addTo(map.current!);
              });
              
              // Cursor on hover
              map.current.on('mouseenter', layerId, () => {
                if (map.current) map.current.getCanvas().style.cursor = 'pointer';
              });
              
              map.current.on('mouseleave', layerId, () => {
                if (map.current) map.current.getCanvas().style.cursor = '';
              });
            }
            break;
            
          case 'community':
            // Mock data for community members
            const communityData = {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [-122.3, 37.7]
                  },
                  properties: {
                    type: 'event',
                    name: 'Unimog Meetup',
                    description: 'Monthly gathering',
                    date: 'This Saturday',
                    attendees: 12
                  }
                },
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [-121.8, 37.3]
                  },
                  properties: {
                    type: 'workshop',
                    name: 'Joe\'s Unimog Service',
                    description: 'Specialized Unimog repair',
                    rating: '4.8 ⭐',
                    attendees: 0
                  }
                }
              ]
            };
            
            if (!map.current.getSource(sourceId)) {
              map.current.addSource(sourceId, {
                type: 'geojson',
                data: communityData as any
              });
            }
            
            if (!map.current.getLayer(layerId)) {
              // Community markers
              map.current.addLayer({
                id: layerId,
                type: 'circle',
                source: sourceId,
                paint: {
                  'circle-radius': 8,
                  'circle-color': [
                    'case',
                    ['==', ['get', 'type'], 'event'], '#10b981',
                    ['==', ['get', 'type'], 'workshop'], '#f59e0b',
                    '#6b7280'
                  ],
                  'circle-stroke-color': '#ffffff',
                  'circle-stroke-width': 2
                }
              });
              
              // Community labels
              map.current.addLayer({
                id: `${layerId}-labels`,
                type: 'symbol',
                source: sourceId,
                layout: {
                  'text-field': ['get', 'name'],
                  'text-size': 10,
                  'text-anchor': 'top',
                  'text-offset': [0, 1],
                  'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular']
                },
                paint: {
                  'text-color': '#374151',
                  'text-halo-color': '#ffffff',
                  'text-halo-width': 1
                }
              });
            }
            break;
        }
      } else {
        // Remove social layers
        const layersToRemove = [
          `${layerId}-pulse`,
          `${layerId}-icons`,
          `${layerId}-labels`,
          layerId
        ];

        layersToRemove.forEach(id => {
          if (map.current?.getLayer(id)) {
            map.current.removeLayer(id);
          }
        });

        if (map.current?.getSource(sourceId)) {
          map.current.removeSource(sourceId);
        }
      }
    } catch (error) {
      console.error(`Error toggling social layer ${layerKey}:`, error);
      setSocialLayers(prev => ({ ...prev, [layerKey]: false }));
    }
  }, [map, socialLayers]);

  // Clear all overlays function
  const clearAllOverlays = useCallback(() => {
    // Clear all overlays
    Object.keys(overlays).forEach(key => {
      if (overlays[key as keyof typeof overlays]) {
        toggleOverlay(key as keyof typeof overlays, false);
      }
    });
    
    // Clear all POI filters
    Object.keys(poiFilters).forEach(key => {
      if (poiFilters[key as keyof typeof poiFilters]) {
        togglePOIFilter(key as keyof typeof poiFilters);
      }
    });
    
    // Clear all social layers
    Object.keys(socialLayers).forEach(key => {
      if (socialLayers[key as keyof typeof socialLayers]) {
        toggleSocialLayer(key as keyof typeof socialLayers);
      }
    });
    
    // Reset states
    setOverlays({
      traffic: false,
      fires: false,
      phoneCoverage: false,
      nationalParks: false,
      stateForests: false
    });
    
    setPoiFilters({
      wide_parking: false,
      pet_stops: false,
      medical: false,
      farmers_markets: false,
      user_pois: false
    });
    
    setSocialLayers({
      friends: false,
      community: false
    });

    // Reset carrier toggles
    setCarrierToggles({
      telstra_4g: false,
      telstra_5g: false,
      optus_4g: false,
      optus_5g: false,
      tpg_4g: false,
      tpg_5g: false
    });
  }, [overlays, poiFilters, socialLayers]);
  
  // Count active layers
  const activeLayerCount = React.useMemo(() => {
    const overlayCount = Object.values(overlays).filter(Boolean).length;
    const poiCount = Object.values(poiFilters).filter(Boolean).length;
    const socialCount = Object.values(socialLayers).filter(Boolean).length;
    return overlayCount + poiCount + socialCount;
  }, [overlays, poiFilters, socialLayers]);

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
        <Button variant="outline" size="sm" className="gap-2 relative">
          <Layers className="w-4 h-4" />
          <span className="hidden sm:inline">Map Options</span>
          {activeLayerCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeLayerCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-80 max-h-[600px] overflow-y-auto"
        align="end"
        sideOffset={5}
      >
        {/* Clear All Button - only show if layers are active */}
        {activeLayerCount > 0 && (
          <>
            <div className="px-2 py-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                onClick={clearAllOverlays}
              >
                <X className="w-4 h-4" />
                Clear All Layers ({activeLayerCount})
              </Button>
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        {/* Map Styles Section */}
        <DropdownMenuLabel className="flex items-center gap-2">
          <Map className="w-4 h-4" />
          Map Styles
        </DropdownMenuLabel>
        <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-md mx-2 mt-2">
          <div className="flex items-center gap-2">
            <Info className="w-3 h-3 text-blue-600" />
            <span className="text-xs text-blue-700 font-medium">
              Trips can only be created in the Outdoors Map
            </span>
          </div>
        </div>
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

        {/* Trip Creation Notice */}
        <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-md mx-2 mt-2">
          <div className="flex items-center gap-2">
            <Info className="w-3 h-3 text-blue-600" />
            <span className="text-xs text-blue-700 font-medium">
              Trips can only be created in the Outdoors Map
            </span>
          </div>
        </div>

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
                Active Fires {loading.fires && <Loader2 className="w-3 h-3 inline animate-spin ml-1" />}
              </Label>
              <p className="text-xs text-muted-foreground">
                NASA FIRMS satellite data
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
            <Signal className="w-4 h-4 text-green-600" />
            <div>
              <Label className="text-sm font-medium cursor-pointer">
                Phone Coverage {loading.phoneCoverage && <Loader2 className="w-3 h-3 inline animate-spin ml-1" />}
              </Label>
              <p className="text-xs text-muted-foreground">
                Australian mobile coverage (ACCC)
              </p>
            </div>
          </div>
          <Switch
            checked={overlays.phoneCoverage}
            onCheckedChange={() => toggleOverlay('phoneCoverage')}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Carrier Toggles - shown when phone coverage is enabled */}
        {overlays.phoneCoverage && (
          <div className="ml-6 pl-3 border-l-2 border-gray-200 space-y-1 py-1">
            <p className="text-xs text-muted-foreground px-2 mb-2">Select carriers to display:</p>

            {/* Telstra */}
            <div className="px-2 py-1.5 hover:bg-accent rounded">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MOBILE_CARRIERS.telstra_4g.color }} />
                  <span className="text-xs font-medium">Telstra 4G</span>
                </div>
                <Switch
                  checked={carrierToggles.telstra_4g}
                  onCheckedChange={() => toggleCarrier('telstra_4g')}
                  className="scale-75"
                />
              </div>
            </div>
            <div className="px-2 py-1.5 hover:bg-accent rounded">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MOBILE_CARRIERS.telstra_5g.color }} />
                  <span className="text-xs font-medium">Telstra 5G</span>
                </div>
                <Switch
                  checked={carrierToggles.telstra_5g}
                  onCheckedChange={() => toggleCarrier('telstra_5g')}
                  className="scale-75"
                />
              </div>
            </div>

            {/* Optus */}
            <div className="px-2 py-1.5 hover:bg-accent rounded">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MOBILE_CARRIERS.optus_4g.color }} />
                  <span className="text-xs font-medium">Optus 4G</span>
                </div>
                <Switch
                  checked={carrierToggles.optus_4g}
                  onCheckedChange={() => toggleCarrier('optus_4g')}
                  className="scale-75"
                />
              </div>
            </div>
            <div className="px-2 py-1.5 hover:bg-accent rounded">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MOBILE_CARRIERS.optus_5g.color }} />
                  <span className="text-xs font-medium">Optus 5G</span>
                </div>
                <Switch
                  checked={carrierToggles.optus_5g}
                  onCheckedChange={() => toggleCarrier('optus_5g')}
                  className="scale-75"
                />
              </div>
            </div>

            {/* TPG/Vodafone */}
            <div className="px-2 py-1.5 hover:bg-accent rounded">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MOBILE_CARRIERS.tpg_4g.color }} />
                  <span className="text-xs font-medium">TPG/Vodafone 4G</span>
                </div>
                <Switch
                  checked={carrierToggles.tpg_4g}
                  onCheckedChange={() => toggleCarrier('tpg_4g')}
                  className="scale-75"
                />
              </div>
            </div>
            <div className="px-2 py-1.5 hover:bg-accent rounded">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MOBILE_CARRIERS.tpg_5g.color }} />
                  <span className="text-xs font-medium">TPG/Vodafone 5G</span>
                </div>
                <Switch
                  checked={carrierToggles.tpg_5g}
                  onCheckedChange={() => toggleCarrier('tpg_5g')}
                  className="scale-75"
                />
              </div>
            </div>

            <p className="text-xs text-gray-400 px-2 pt-1 italic">
              Areas without coverage shown as gaps
            </p>
          </div>
        )}

        {/* National Parks */}
        <div
          className="flex items-center justify-between px-3 py-2 hover:bg-accent cursor-pointer rounded"
          onClick={() => toggleOverlay('nationalParks')}
        >
          <div className="flex items-center gap-3">
            <Trees className="w-4 h-4 text-green-700" />
            <div>
              <Label className="text-sm font-medium cursor-pointer">
                National Parks {loading.nationalParks && <Loader2 className="w-3 h-3 inline animate-spin ml-1" />}
              </Label>
              <p className="text-xs text-muted-foreground">
                Australian CAPAD data
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
                State Forests {loading.stateForests && <Loader2 className="w-3 h-3 inline animate-spin ml-1" />}
              </Label>
              <p className="text-xs text-muted-foreground">
                ABARES forest data
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
        
        {/* Wide Parking */}
        <div
          className="flex items-center justify-between px-3 py-2 hover:bg-accent cursor-pointer rounded"
          onClick={() => togglePOIFilter('wide_parking')}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">🅿️</span>
            <div>
              <Label className="text-sm font-medium cursor-pointer">
                Wide Parking
              </Label>
              <p className="text-xs text-muted-foreground">
                Large vehicle parking spots
              </p>
            </div>
          </div>
          <Switch
            checked={poiFilters.wide_parking}
            onCheckedChange={() => togglePOIFilter('wide_parking')}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Pet Stops */}
        <div
          className="flex items-center justify-between px-3 py-2 hover:bg-accent cursor-pointer rounded"
          onClick={() => togglePOIFilter('pet_stops')}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">🐾</span>
            <div>
              <Label className="text-sm font-medium cursor-pointer">
                Pet Stops
              </Label>
              <p className="text-xs text-muted-foreground">
                Pet-friendly rest areas
              </p>
            </div>
          </div>
          <Switch
            checked={poiFilters.pet_stops}
            onCheckedChange={() => togglePOIFilter('pet_stops')}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Medical Facilities */}
        <div
          className="flex items-center justify-between px-3 py-2 hover:bg-accent cursor-pointer rounded"
          onClick={() => togglePOIFilter('medical')}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">🚑</span>
            <div>
              <Label className="text-sm font-medium cursor-pointer">
                Medical Facilities
              </Label>
              <p className="text-xs text-muted-foreground">
                Hospitals and urgent care
              </p>
            </div>
          </div>
          <Switch
            checked={poiFilters.medical}
            onCheckedChange={() => togglePOIFilter('medical')}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Farmers Markets */}
        <div
          className="flex items-center justify-between px-3 py-2 hover:bg-accent cursor-pointer rounded"
          onClick={() => togglePOIFilter('farmers_markets')}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">🥕</span>
            <div>
              <Label className="text-sm font-medium cursor-pointer">
                Farmers Markets
              </Label>
              <p className="text-xs text-muted-foreground">
                Local markets and fresh produce
              </p>
            </div>
          </div>
          <Switch
            checked={poiFilters.farmers_markets}
            onCheckedChange={() => togglePOIFilter('farmers_markets')}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* My POIs */}
        <div
          className="flex items-center justify-between px-3 py-2 hover:bg-accent cursor-pointer rounded"
          onClick={() => togglePOIFilter('user_pois')}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">📍</span>
            <div>
              <Label className="text-sm font-medium cursor-pointer">
                My POIs
              </Label>
              <p className="text-xs text-muted-foreground">
                Your saved points of interest
              </p>
            </div>
          </div>
          <Switch
            checked={poiFilters.user_pois}
            onCheckedChange={() => togglePOIFilter('user_pois')}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        <DropdownMenuSeparator />

        {/* Social Layers Section */}
        <DropdownMenuLabel className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          Social Layers
        </DropdownMenuLabel>
        
        <div
          className="flex items-center justify-between px-3 py-2 hover:bg-accent cursor-pointer rounded"
          onClick={() => toggleSocialLayer('friends')}
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
            onCheckedChange={() => toggleSocialLayer('friends')}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        
        <div
          className="flex items-center justify-between px-3 py-2 hover:bg-accent cursor-pointer rounded"
          onClick={() => toggleSocialLayer('community')}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">🏕️</span>
            <div>
              <Label className="text-sm font-medium cursor-pointer">
                Community
              </Label>
              <p className="text-xs text-muted-foreground">
                Events & workshops
              </p>
            </div>
          </div>
          <Switch
            checked={socialLayers.community}
            onCheckedChange={() => toggleSocialLayer('community')}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}