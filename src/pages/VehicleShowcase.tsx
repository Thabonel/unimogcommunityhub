import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Globe, TrendingUp, Eye, Heart, Search, Filter, Shuffle } from 'lucide-react';
import VehicleCard from '@/components/community/VehicleCard';
import CountrySelector from '@/components/community/CountrySelector';
import AddToShowcaseButton from '@/components/community/AddToShowcaseButton';
import { useVehicleShowcase } from '@/hooks/use-vehicle-showcase';
import { VehicleShowcaseInfo } from '@/hooks/vehicle-maintenance/types';

const VehicleShowcase = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filter states
  const [selectedCountry, setSelectedCountry] = useState<string>(searchParams.get('country') || 'all');
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'trending');
  const [modelFilter, setModelFilter] = useState<string>(searchParams.get('model') || 'all');
  const [yearFilter, setYearFilter] = useState<string>(searchParams.get('year') || 'all');
  
  // Data states
  const [vehicles, setVehicles] = useState<VehicleShowcaseInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVehicles: 0,
    totalCountries: 0,
    totalViews: 0,
    totalLikes: 0
  });

  const { 
    fetchShowcaseVehicles, 
    getGlobalStats, 
    getCountryStats 
  } = useVehicleShowcase();

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCountry !== 'all') params.set('country', selectedCountry);
    if (searchQuery) params.set('search', searchQuery);
    if (sortBy !== 'trending') params.set('sort', sortBy);
    if (modelFilter !== 'all') params.set('model', modelFilter);
    if (yearFilter !== 'all') params.set('year', yearFilter);
    
    setSearchParams(params);
  }, [selectedCountry, searchQuery, sortBy, modelFilter, yearFilter, setSearchParams]);

  // Fetch vehicles when filters change
  useEffect(() => {
    loadVehicles();
  }, [selectedCountry, searchQuery, sortBy, modelFilter, yearFilter]);

  // Load global stats on mount
  useEffect(() => {
    loadStats();
  }, []);

  const loadVehicles = async () => {
    setIsLoading(true);
    try {
      const filters = {
        country: selectedCountry !== 'all' ? selectedCountry : undefined,
        search: searchQuery || undefined,
        model: modelFilter !== 'all' ? modelFilter : undefined,
        year: yearFilter !== 'all' ? yearFilter : undefined
      };
      
      const data = await fetchShowcaseVehicles(filters, sortBy, 50);
      setVehicles(data);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const globalStats = await getGlobalStats();
      setStats(globalStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleRandomCountry = () => {
    const countries = ['DE', 'US', 'AU', 'GB', 'CA', 'ZA', 'AT', 'CH', 'NL', 'BR'];
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    setSelectedCountry(randomCountry);
  };

  const handleClearFilters = () => {
    setSelectedCountry('all');
    setSearchQuery('');
    setModelFilter('all');
    setYearFilter('all');
    setSortBy('trending');
  };

  return (
    <Layout isLoggedIn={!!user}>
      <div className="container py-6 space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Globe className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-unimog-800 dark:text-unimog-200">
              Global Unimog Showcase
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover amazing Unimog builds from around the world. Get inspired, connect with owners, and showcase your own masterpiece.
          </p>
          
          {/* Add Your Vehicle Button */}
          <div className="pt-2">
            <AddToShowcaseButton size="lg" className="font-semibold" />
          </div>
          
          {/* Global Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">{stats.totalVehicles}</div>
                <div className="text-sm text-muted-foreground">Vehicles</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">{stats.totalCountries}</div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">{stats.totalViews.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Views</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">{stats.totalLikes.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Likes</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search and Country */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search vehicles, owners, modifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <CountrySelector
                value={selectedCountry}
                onChange={setSelectedCountry}
                showAll={true}
                placeholder="All Countries"
              />
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleRandomCountry} className="flex-1">
                  <Shuffle className="w-4 h-4 mr-2" />
                  Random Country
                </Button>
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear All
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={modelFilter} onValueChange={setModelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Models" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Models</SelectItem>
                  <SelectItem value="U1700L">U1700L</SelectItem>
                  <SelectItem value="U1300L">U1300L</SelectItem>
                  <SelectItem value="U2150L">U2150L</SelectItem>
                  <SelectItem value="U4000">U4000</SelectItem>
                  <SelectItem value="U5000">U5000</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="2020s">2020s</SelectItem>
                  <SelectItem value="2010s">2010s</SelectItem>
                  <SelectItem value="2000s">2000s</SelectItem>
                  <SelectItem value="1990s">1990s</SelectItem>
                  <SelectItem value="1980s">1980s</SelectItem>
                  <SelectItem value="older">Older</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trending">🔥 Trending</SelectItem>
                  <SelectItem value="newest">🆕 Newest First</SelectItem>
                  <SelectItem value="most_liked">❤️ Most Liked</SelectItem>
                  <SelectItem value="most_viewed">👁️ Most Viewed</SelectItem>
                  <SelectItem value="random">🎲 Random</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Active Filters */}
        {(selectedCountry !== 'all' || searchQuery || modelFilter !== 'all' || yearFilter !== 'all') && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {selectedCountry !== 'all' && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCountry('all')}>
                Country: {selectedCountry} ×
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchQuery('')}>
                Search: "{searchQuery}" ×
              </Badge>
            )}
            {modelFilter !== 'all' && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setModelFilter('all')}>
                Model: {modelFilter} ×
              </Badge>
            )}
            {yearFilter !== 'all' && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setYearFilter('all')}>
                Year: {yearFilter} ×
              </Badge>
            )}
          </div>
        )}

        {/* Results Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">
              {isLoading ? 'Loading...' : `${vehicles.length} Vehicles Found`}
            </h2>
            {selectedCountry !== 'all' && (
              <Badge variant="outline">
                Showing: {selectedCountry}
              </Badge>
            )}
          </div>
          <Badge variant="secondary">
            Sorted by: {sortBy.replace('_', ' ')}
          </Badge>
        </div>

        {/* Vehicle Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-muted rounded-t-lg" />
                <CardContent className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Vehicles Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || selectedCountry !== 'all' || modelFilter !== 'all' || yearFilter !== 'all'
                  ? 'Try adjusting your filters to see more results.'
                  : 'Be the first to showcase your Unimog!'}
              </p>
              <Button onClick={handleClearFilters} variant="outline">
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {vehicles.length > 0 && vehicles.length % 50 === 0 && !isLoading && (
          <div className="text-center">
            <Button onClick={loadVehicles} variant="outline" size="lg">
              Load More Vehicles
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default VehicleShowcase;