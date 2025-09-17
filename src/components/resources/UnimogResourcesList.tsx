import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExternalLink, MapPin, Phone, Mail, Globe, Star, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { Badge } from '@/components/ui/badge';

interface UnimogResource {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  country_code: string;
  phone: string;
  email: string;
  website: string;
  type: 'dealership' | 'service' | 'parts' | 'regulations';
  latitude?: number;
  longitude?: number;
  verified: boolean;
  last_verified: string;
}

interface CountryInfo {
  name: string;
  flag: string;
}

const COUNTRIES: Record<string, CountryInfo> = {
  'DE': { name: 'Germany', flag: '🇩🇪' },
  'GB': { name: 'United Kingdom', flag: '🇬🇧' },
  'AU': { name: 'Australia', flag: '🇦🇺' },
  'TR': { name: 'Turkey', flag: '🇹🇷' },
  'AR': { name: 'Argentina', flag: '🇦🇷' }
};

const TYPE_INFO = {
  dealership: {
    title: 'Unimog Dealerships',
    description: 'Official Mercedes-Benz dealers and Unimog specialists',
    icon: '🏢'
  },
  service: {
    title: 'Service Centers',
    description: 'Authorized service centers for maintenance and repairs',
    icon: '🔧'
  },
  parts: {
    title: 'Parts Suppliers',
    description: 'Genuine Unimog parts and accessories suppliers',
    icon: '⚙️'
  },
  regulations: {
    title: 'Regulations & Documentation',
    description: 'Official regulations and technical documentation',
    icon: '📋'
  }
};

export function UnimogResourcesList() {
  const [resources, setResources] = useState<UnimogResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('unimog_resources')
        .select('*')
        .eq('verified', true)
        .order('country_code, type, name');

      if (error) {
        throw error;
      }

      setResources(data || []);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError('Failed to load resources. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Filter resources by selected country
  const filteredResources = selectedCountry === 'all'
    ? resources
    : resources.filter(resource => resource.country_code === selectedCountry);

  // Group resources by type
  const resourcesByType = {
    dealership: filteredResources.filter(r => r.type === 'dealership'),
    service: filteredResources.filter(r => r.type === 'service'),
    parts: filteredResources.filter(r => r.type === 'parts'),
    regulations: filteredResources.filter(r => r.type === 'regulations')
  };

  // Get unique countries from resources
  const availableCountries = Array.from(new Set(resources.map(r => r.country_code)))
    .sort()
    .map(code => ({ code, ...COUNTRIES[code] }))
    .filter(country => country.name); // Only include countries we have info for

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Unimog resources...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unimog Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-destructive mb-4">{error}</p>
            <button
              onClick={fetchResources}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (resources.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unimog Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-muted-foreground">
            No resources available at this time.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Unimog Resources</h1>
        <p className="text-muted-foreground">
          Find official Unimog dealerships, service centers, parts suppliers, and regulations worldwide.
        </p>
      </div>

      {/* Featured Sponsor Section */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary fill-primary" />
            Featured Community Partner
          </CardTitle>
          <CardDescription>
            Proudly supporting the Unimog Community Hub
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
                <img
                  src="https://kycoklimpzkyrecbjecn.supabase.co/storage/v1/object/public/public-assets/beyondlogo-1024x1024.jpg"
                  alt="Beyond RV Logo"
                  className="w-full h-full object-contain p-2"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = '<div class="text-2xl font-bold text-primary">Beyond RV</div>';
                  }}
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-semibold">Beyond RV (Beyond Caravans)</h3>
                <Badge variant="outline" className="text-xs bg-primary/10 border-primary/20">
                  🇦🇺 Australia
                </Badge>
                <Badge variant="outline" className="text-xs bg-orange-100 border-orange-200 text-orange-800">
                  Community Sponsor
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Family-run business specializing in slide-on campers and expedition vehicles. Custom Unimog-compatible slide-on camper manufacturer with over a decade of experience building rugged Australian terrain-ready designs.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>77 Coleyville Rd, Mutdapilly, QLD</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <a href="tel:0430863819" className="hover:text-primary">
                    0430 863 819
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <a href="mailto:beyondcaravans@gmail.com" className="hover:text-primary">
                    beyondcaravans@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <a
                    href="https://beyondrv.com.au/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary flex items-center gap-1"
                  >
                    Visit Website <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Browse All Resources</h2>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-sm">Scroll down to see more</span>
            <ChevronDown className="h-4 w-4 animate-bounce" />
          </div>
        </div>

        {/* Country Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCountry('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCountry === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            All Countries ({resources.length})
          </button>
          {availableCountries.map(country => {
            const count = resources.filter(r => r.country_code === country.code).length;
            return (
              <button
                key={country.code}
                onClick={() => setSelectedCountry(country.code)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCountry === country.code
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {country.flag} {country.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Resource Sections */}
      {Object.entries(resourcesByType).map(([type, typeResources]) => {
        if (typeResources.length === 0) return null;

        const typeInfo = TYPE_INFO[type as keyof typeof TYPE_INFO];

        return (
          <Card key={type}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-xl">{typeInfo.icon}</span>
                {typeInfo.title}
              </CardTitle>
              <CardDescription>
                {typeInfo.description} ({typeResources.length} available)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <ScrollArea className="h-80 pr-4">
                  <div className="space-y-4">
                    {typeResources.map(resource => (
                      <ResourceItem key={resource.id} resource={resource} />
                    ))}
                  </div>
                </ScrollArea>
                {typeResources.length > 3 && (
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none flex items-end justify-center">
                    <div className="text-xs text-muted-foreground pb-1">
                      ↓ Scroll for more resources ↓
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {filteredResources.length === 0 && selectedCountry !== 'all' && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              No resources found for {COUNTRIES[selectedCountry]?.name || selectedCountry}.
            </p>
            <button
              onClick={() => setSelectedCountry('all')}
              className="mt-4 text-primary hover:underline"
            >
              View all countries
            </button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ResourceItem({ resource }: { resource: UnimogResource }) {
  const country = COUNTRIES[resource.country_code];

  return (
    <div className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold">{resource.name}</h3>
            {country && (
              <Badge variant="outline" className="text-xs">
                {country.flag} {country.name}
              </Badge>
            )}
          </div>
          {resource.description && (
            <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        {resource.address && (
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <span>{resource.address}, {resource.city}</span>
          </div>
        )}

        {resource.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <a href={`tel:${resource.phone}`} className="hover:text-primary">
              {resource.phone}
            </a>
          </div>
        )}

        {resource.email && (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <a href={`mailto:${resource.email}`} className="hover:text-primary">
              {resource.email}
            </a>
          </div>
        )}

        {resource.website && (
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <a
              href={resource.website}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary flex items-center gap-1"
            >
              Visit Website <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t">
        <p className="text-xs text-muted-foreground">
          Last verified: {new Date(resource.last_verified).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}