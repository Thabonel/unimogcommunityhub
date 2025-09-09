import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { searchPlaces, getCountryFromCoordinates, GeocodingSuggestion } from '@/services/mapboxGeocoding';
import { Loader2, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onLocationSelect?: (location: { name: string; coordinates: [number, number] }) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  userLocation?: { latitude: number; longitude: number };
}

export function LocationAutocomplete({
  value,
  onChange,
  onLocationSelect,
  placeholder = "Enter location",
  className,
  id,
  userLocation
}: LocationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<GeocodingSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  const debouncedValue = useDebounce(value, 300);

  // Get country code from user location
  useEffect(() => {
    if (userLocation && !countryCode) {
      getCountryFromCoordinates(userLocation.longitude, userLocation.latitude)
        .then(code => {
          if (code) {
            setCountryCode(code);
            console.log('Detected country code:', code);
          }
        });
    }
  }, [userLocation, countryCode]);

  // Fetch suggestions when input changes
  useEffect(() => {
    if (debouncedValue.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        const options: any = {
          limit: 5,
          types: ['place', 'locality', 'address', 'poi']
        };

        // Add country filter if available
        if (countryCode) {
          options.country = countryCode;
        }

        // Add proximity bias if user location is available
        if (userLocation) {
          options.proximity = [userLocation.longitude, userLocation.latitude];
        }

        const results = await searchPlaces(debouncedValue, options);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedValue, countryCode, userLocation]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSuggestion = useCallback((suggestion: GeocodingSuggestion) => {
    onChange(suggestion.place_name);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    
    if (onLocationSelect) {
      onLocationSelect({
        name: suggestion.place_name,
        coordinates: suggestion.center
      });
    }
  }, [onChange, onLocationSelect]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  }, [showSuggestions, suggestions, selectedIndex, handleSelectSuggestion]);

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
        <Input
          ref={inputRef}
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder={placeholder}
          className={cn("pl-7 pr-8", className)}
          autoComplete="off"
        />
        {isLoading && (
          <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 animate-spin text-muted-foreground" />
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 mt-1 w-full bg-white rounded-md border shadow-lg max-h-60 overflow-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              type="button"
              className={cn(
                "w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none",
                index === selectedIndex && "bg-gray-100"
              )}
              onClick={() => handleSelectSuggestion(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="flex items-start space-x-2">
                <MapPin className="h-3 w-3 mt-0.5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium">{suggestion.text}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {suggestion.place_name}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}