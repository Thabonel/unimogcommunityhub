import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MapPin, Navigation, X, Loader2 } from 'lucide-react';
import { searchPlaces, GeocodingSuggestion } from '@/services/mapboxGeocoding';
import { cn } from '@/lib/utils';

interface LocationSearchCardProps {
  onOriginSelect: (location: GeocodingSuggestion) => void;
  onDestinationSelect: (location: GeocodingSuggestion) => void;
  onCalculateRoute: () => void;
  userLocation?: { longitude: number; latitude: number } | null;
  className?: string;
}

interface SearchInputProps {
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (suggestion: GeocodingSuggestion) => void;
  onClear: () => void;
  suggestions: GeocodingSuggestion[];
  isLoading: boolean;
  showSuggestions: boolean;
  onFocus: () => void;
  onBlur: () => void;
  userLocation?: { longitude: number; latitude: number } | null;
  iconColor: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  label,
  icon,
  placeholder,
  value,
  onChange,
  onSelect,
  onClear,
  suggestions,
  isLoading,
  showSuggestions,
  onFocus,
  onBlur,
  iconColor,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-1">
        <span className={cn("flex-shrink-0", iconColor)}>{icon}</span>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
      </div>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          className="w-full px-3 py-3 pr-10 border border-gray-200 rounded-lg text-base
                     focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                     bg-white placeholder-gray-400"
        />
        {value && (
          <button
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Floating Card with Suggestions */}
      {showSuggestions && (value.length >= 2 || isLoading) && (
        <div
          ref={cardRef}
          className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200
                     overflow-hidden z-[100000]
                     max-h-[60vh] md:max-h-[300px] overflow-y-auto"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-green-600" />
              <span className="ml-2 text-gray-500">Searching...</span>
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {suggestions.map((suggestion) => (
                <li key={suggestion.id}>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onSelect(suggestion);
                    }}
                    className="w-full px-4 py-4 text-left hover:bg-gray-50 active:bg-gray-100
                               flex items-start gap-3 transition-colors"
                  >
                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{suggestion.text}</p>
                      <p className="text-sm text-gray-500 truncate">{suggestion.place_name}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : value.length >= 2 ? (
            <div className="py-8 text-center text-gray-500">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>No locations found</p>
              <p className="text-sm">Try a different search term</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export const LocationSearchCard: React.FC<LocationSearchCardProps> = ({
  onOriginSelect,
  onDestinationSelect,
  onCalculateRoute,
  userLocation,
  className,
}) => {
  // Origin state
  const [originValue, setOriginValue] = useState('');
  const [originSuggestions, setOriginSuggestions] = useState<GeocodingSuggestion[]>([]);
  const [isOriginLoading, setIsOriginLoading] = useState(false);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [selectedOrigin, setSelectedOrigin] = useState<GeocodingSuggestion | null>(null);

  // Destination state
  const [destValue, setDestValue] = useState('');
  const [destSuggestions, setDestSuggestions] = useState<GeocodingSuggestion[]>([]);
  const [isDestLoading, setIsDestLoading] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);
  const [selectedDest, setSelectedDest] = useState<GeocodingSuggestion | null>(null);

  // Debounce refs
  const originTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const destTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Search origin
  const searchOrigin = useCallback(async (query: string) => {
    if (query.length < 2) {
      setOriginSuggestions([]);
      return;
    }

    setIsOriginLoading(true);
    try {
      const results = await searchPlaces(query, {
        limit: 5,
        proximity: userLocation ? [userLocation.longitude, userLocation.latitude] : undefined,
      });
      setOriginSuggestions(results);
    } catch (error) {
      console.error('Origin search error:', error);
      setOriginSuggestions([]);
    } finally {
      setIsOriginLoading(false);
    }
  }, [userLocation]);

  // Search destination
  const searchDest = useCallback(async (query: string) => {
    if (query.length < 2) {
      setDestSuggestions([]);
      return;
    }

    setIsDestLoading(true);
    try {
      const results = await searchPlaces(query, {
        limit: 5,
        proximity: userLocation ? [userLocation.longitude, userLocation.latitude] : undefined,
      });
      setDestSuggestions(results);
    } catch (error) {
      console.error('Destination search error:', error);
      setDestSuggestions([]);
    } finally {
      setIsDestLoading(false);
    }
  }, [userLocation]);

  // Handle origin change with debounce
  const handleOriginChange = useCallback((value: string) => {
    setOriginValue(value);
    setSelectedOrigin(null);

    if (originTimeoutRef.current) {
      clearTimeout(originTimeoutRef.current);
    }

    originTimeoutRef.current = setTimeout(() => {
      searchOrigin(value);
    }, 300);
  }, [searchOrigin]);

  // Handle destination change with debounce
  const handleDestChange = useCallback((value: string) => {
    setDestValue(value);
    setSelectedDest(null);

    if (destTimeoutRef.current) {
      clearTimeout(destTimeoutRef.current);
    }

    destTimeoutRef.current = setTimeout(() => {
      searchDest(value);
    }, 300);
  }, [searchDest]);

  // Handle origin select
  const handleOriginSelect = useCallback((suggestion: GeocodingSuggestion) => {
    setOriginValue(suggestion.place_name);
    setSelectedOrigin(suggestion);
    setShowOriginSuggestions(false);
    setOriginSuggestions([]);
    onOriginSelect(suggestion);
  }, [onOriginSelect]);

  // Handle destination select
  const handleDestSelect = useCallback((suggestion: GeocodingSuggestion) => {
    setDestValue(suggestion.place_name);
    setSelectedDest(suggestion);
    setShowDestSuggestions(false);
    setDestSuggestions([]);
    onDestinationSelect(suggestion);
  }, [onDestinationSelect]);

  // Clear handlers
  const clearOrigin = useCallback(() => {
    setOriginValue('');
    setSelectedOrigin(null);
    setOriginSuggestions([]);
  }, []);

  const clearDest = useCallback(() => {
    setDestValue('');
    setSelectedDest(null);
    setDestSuggestions([]);
  }, []);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (originTimeoutRef.current) clearTimeout(originTimeoutRef.current);
      if (destTimeoutRef.current) clearTimeout(destTimeoutRef.current);
    };
  }, []);

  const canCalculate = selectedOrigin && selectedDest;

  return (
    <div className={cn(
      "bg-white rounded-xl shadow-lg border border-gray-200 p-4 space-y-4",
      className
    )}>
      {/* Origin Input */}
      <SearchInput
        label="Start"
        icon={<div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">A</div>}
        placeholder="Enter starting location"
        value={originValue}
        onChange={handleOriginChange}
        onSelect={handleOriginSelect}
        onClear={clearOrigin}
        suggestions={originSuggestions}
        isLoading={isOriginLoading}
        showSuggestions={showOriginSuggestions}
        onFocus={() => setShowOriginSuggestions(true)}
        onBlur={() => setTimeout(() => setShowOriginSuggestions(false), 200)}
        userLocation={userLocation}
        iconColor="text-green-500"
      />

      {/* Destination Input */}
      <SearchInput
        label="Destination"
        icon={<div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">B</div>}
        placeholder="Enter destination"
        value={destValue}
        onChange={handleDestChange}
        onSelect={handleDestSelect}
        onClear={clearDest}
        suggestions={destSuggestions}
        isLoading={isDestLoading}
        showSuggestions={showDestSuggestions}
        onFocus={() => setShowDestSuggestions(true)}
        onBlur={() => setTimeout(() => setShowDestSuggestions(false), 200)}
        userLocation={userLocation}
        iconColor="text-red-500"
      />

      {/* Calculate Route Button */}
      <button
        onClick={onCalculateRoute}
        disabled={!canCalculate}
        className={cn(
          "w-full py-3 px-4 rounded-lg font-semibold text-white transition-all",
          "flex items-center justify-center gap-2",
          canCalculate
            ? "bg-green-600 hover:bg-green-700 active:bg-green-800"
            : "bg-gray-300 cursor-not-allowed"
        )}
      >
        <Navigation className="w-5 h-5" />
        Calculate Route
      </button>
    </div>
  );
};

export default LocationSearchCard;
