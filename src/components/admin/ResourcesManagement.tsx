import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';
import {
  Plus,
  Pencil,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Globe,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download
} from 'lucide-react';

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
  verification_notes?: string;
  created_at: string;
  updated_at: string;
}

const COUNTRIES = {
  'US': { name: 'United States', flag: '🇺🇸' },
  'CA': { name: 'Canada', flag: '🇨🇦' },
  'DE': { name: 'Germany', flag: '🇩🇪' },
  'GB': { name: 'United Kingdom', flag: '🇬🇧' },
  'BE': { name: 'Belgium', flag: '🇧🇪' },
  'NL': { name: 'Netherlands', flag: '🇳🇱' },
  'SI': { name: 'Slovenia', flag: '🇸🇮' },
  'AU': { name: 'Australia', flag: '🇦🇺' },
  'TR': { name: 'Turkey', flag: '🇹🇷' },
  'AR': { name: 'Argentina', flag: '🇦🇷' }
};

const RESOURCE_TYPES = [
  { value: 'dealership', label: 'Dealership', icon: '🏢' },
  { value: 'service', label: 'Service Center', icon: '🔧' },
  { value: 'parts', label: 'Parts Supplier', icon: '⚙️' },
  { value: 'regulations', label: 'Regulations', icon: '📋' }
];

const ResourcesManagement = () => {
  const [resources, setResources] = useState<UnimogResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [editingResource, setEditingResource] = useState<UnimogResource | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [allowDialogClose, setAllowDialogClose] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('unimog_resources')
        .select('*')
        .order('country_code, type, name');

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveResource = async (resourceData: Partial<UnimogResource>) => {
    try {
      if (editingResource) {
        // Update existing resource
        const { error } = await supabase
          .from('unimog_resources')
          .update(resourceData)
          .eq('id', editingResource.id);

        if (error) throw error;
        toast.success('Resource updated successfully');
      } else {
        // Create new resource
        const { error } = await supabase
          .from('unimog_resources')
          .insert(resourceData);

        if (error) throw error;
        toast.success('Resource created successfully');
      }

      setIsDialogOpen(false);
      setEditingResource(null);
      fetchResources();
    } catch (error) {
      console.error('Error saving resource:', error);
      toast.error('Failed to save resource');
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;

    try {
      const { error } = await supabase
        .from('unimog_resources')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Resource deleted successfully');
      fetchResources();
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast.error('Failed to delete resource');
    }
  };

  const handleVerifyResource = async (id: string, verified: boolean) => {
    setVerifyingId(id);
    try {
      const { error } = await supabase
        .from('unimog_resources')
        .update({
          verified,
          last_verified: new Date().toISOString(),
          verification_notes: verified ? 'Verified by admin' : 'Marked as unverified'
        })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Resource ${verified ? 'verified' : 'unverified'} successfully`);
      fetchResources();
    } catch (error) {
      console.error('Error updating verification:', error);
      toast.error('Failed to update verification status');
    } finally {
      setVerifyingId(null);
    }
  };

  const exportResources = () => {
    const csv = [
      ['Name', 'Type', 'Country', 'City', 'Address', 'Phone', 'Email', 'Website', 'Verified', 'Last Verified'].join(','),
      ...filteredResources.map(resource => [
        `"${resource.name}"`,
        resource.type,
        resource.country_code,
        `"${resource.city}"`,
        `"${resource.address}"`,
        resource.phone,
        resource.email,
        resource.website,
        resource.verified,
        resource.last_verified
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'unimog-resources.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Filter resources
  const filteredResources = resources.filter(resource => {
    const typeMatch = selectedType === 'all' || resource.type === selectedType;
    const countryMatch = selectedCountry === 'all' || resource.country_code === selectedCountry;
    return typeMatch && countryMatch;
  });

  // Get statistics
  const stats = {
    total: resources.length,
    verified: resources.filter(r => r.verified).length,
    unverified: resources.filter(r => !r.verified).length,
    byType: RESOURCE_TYPES.map(type => ({
      ...type,
      count: resources.filter(r => r.type === type.value).length
    })),
    byCountry: Object.entries(COUNTRIES).map(([code, info]) => ({
      code,
      ...info,
      count: resources.filter(r => r.country_code === code).length
    }))
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Unimog Resources Management</h2>
            <p className="text-muted-foreground">
              Manage dealerships, service centers, parts suppliers, and regulations worldwide
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportResources} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              // Only allow closing via explicit user actions, not tab switching
              if (!open && allowDialogClose) {
                setIsDialogOpen(false);
              }
            }}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingResource(null);
                  setAllowDialogClose(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Resource
                </Button>
              </DialogTrigger>
              <ResourceDialog
                resource={editingResource}
                onSave={handleSaveResource}
                onClose={() => {
                  setAllowDialogClose(true);
                  setIsDialogOpen(false);
                }}
                onFormInteraction={() => setAllowDialogClose(false)}
              />
            </Dialog>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Verified</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-600">Unverified</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.unverified}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Countries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.byCountry.filter(c => c.count > 0).length}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types ({stats.total})</SelectItem>
            {stats.byType.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.icon} {type.label} ({type.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedCountry} onValueChange={setSelectedCountry}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries ({stats.total})</SelectItem>
            {stats.byCountry.filter(c => c.count > 0).map(country => (
              <SelectItem key={country.code} value={country.code}>
                {country.flag} {country.name} ({country.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={fetchResources} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Resources List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Resources ({filteredResources.length})
          </CardTitle>
          <CardDescription>
            Showing {filteredResources.length} of {stats.total} resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading resources...</div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No resources found
            </div>
          ) : (
            <div className="space-y-4">
              {filteredResources.map(resource => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  onEdit={(resource) => {
                    setEditingResource(resource);
                    setAllowDialogClose(true);
                    setIsDialogOpen(true);
                  }}
                  onDelete={handleDeleteResource}
                  onVerify={handleVerifyResource}
                  isVerifying={verifyingId === resource.id}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Resource Card Component
const ResourceCard = ({
  resource,
  onEdit,
  onDelete,
  onVerify,
  isVerifying
}: {
  resource: UnimogResource;
  onEdit: (resource: UnimogResource) => void;
  onDelete: (id: string) => void;
  onVerify: (id: string, verified: boolean) => void;
  isVerifying: boolean;
}) => {
  const country = COUNTRIES[resource.country_code as keyof typeof COUNTRIES];
  const typeInfo = RESOURCE_TYPES.find(t => t.value === resource.type);

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold">{resource.name}</h3>
            <Badge variant="outline">
              {typeInfo?.icon} {typeInfo?.label}
            </Badge>
            {country && (
              <Badge variant="outline">
                {country.flag} {country.name}
              </Badge>
            )}
            <Badge variant={resource.verified ? "default" : "secondary"}>
              {resource.verified ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3 mr-1" />
                  Unverified
                </>
              )}
            </Badge>
          </div>
          {resource.description && (
            <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onVerify(resource.id, !resource.verified)}
            disabled={isVerifying}
          >
            {isVerifying ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : resource.verified ? (
              <XCircle className="h-4 w-4" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
          </Button>
          <Button size="sm" variant="outline" onClick={() => onEdit(resource)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete(resource.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        {resource.address && (
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <span>{resource.address}, {resource.city}</span>
          </div>
        )}
        {resource.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{resource.phone}</span>
          </div>
        )}
        {resource.email && (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{resource.email}</span>
          </div>
        )}
        {resource.website && (
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{resource.website}</span>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
        Last verified: {new Date(resource.last_verified).toLocaleDateString()}
        {resource.verification_notes && (
          <span className="ml-4">Notes: {resource.verification_notes}</span>
        )}
      </div>
    </div>
  );
};

// Resource Dialog Component
const ResourceDialog = ({
  resource,
  onSave,
  onClose,
  onFormInteraction
}: {
  resource: UnimogResource | null;
  onSave: (data: Partial<UnimogResource>) => void;
  onClose: () => void;
  onFormInteraction?: () => void;
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'dealership' as const,
    country_code: 'DE',
    city: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
    verified: true
  });

  const [urlInput, setUrlInput] = useState('');
  const [isScrapingUrl, setIsScrapingUrl] = useState(false);
  const [scrapingConfidence, setScrapingConfidence] = useState<number | null>(null);

  useEffect(() => {
    if (resource) {
      setFormData({
        name: resource.name || '',
        description: resource.description || '',
        type: resource.type,
        country_code: resource.country_code,
        city: resource.city || '',
        address: resource.address || '',
        phone: resource.phone || '',
        email: resource.email || '',
        website: resource.website || '',
        latitude: resource.latitude,
        longitude: resource.longitude,
        verified: resource.verified
      });
    }
  }, [resource]);

  const handleScrapeUrl = async () => {
    if (!urlInput.trim()) {
      toast.error('Please enter a URL to scrape');
      return;
    }

    if (!urlInput.startsWith('http://') && !urlInput.startsWith('https://')) {
      toast.error('Please enter a valid URL starting with http:// or https://');
      return;
    }

    setIsScrapingUrl(true);
    setScrapingConfidence(null);

    try {
      const { data, error } = await supabase.functions.invoke('scrape-supplier-info', {
        body: { url: urlInput.trim() }
      });

      if (error) throw error;

      if (data.success) {
        const scrapedData = data.data;
        setScrapingConfidence(scrapedData.confidence);

        // Auto-fill the form with scraped data
        setFormData({
          ...formData,
          name: scrapedData.name || formData.name,
          description: scrapedData.description || formData.description,
          type: scrapedData.type || formData.type,
          country_code: scrapedData.country_code || formData.country_code,
          city: scrapedData.city || formData.city,
          address: scrapedData.address || formData.address,
          phone: scrapedData.phone || formData.phone,
          email: scrapedData.email || formData.email,
          website: urlInput.trim(),
        });

        toast.success(`Information scraped successfully! Confidence: ${Math.round(scrapedData.confidence * 100)}%`);
      } else {
        throw new Error(data.error || 'Failed to scrape website');
      }
    } catch (error) {
      console.error('Scraping error:', error);
      toast.error('Failed to scrape website information. Please fill in manually.');
    } finally {
      setIsScrapingUrl(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {resource ? 'Edit Resource' : 'Add New Resource'}
        </DialogTitle>
        <DialogDescription>
          {resource ? 'Update the resource information' : 'Add a new Unimog resource to the database'}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* URL Scraping Section */}
        {!resource && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-blue-600" />
              <h3 className="font-medium text-blue-900">Auto-fill from Website</h3>
            </div>
            <p className="text-sm text-blue-700">
              Paste a website URL to automatically extract business information
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="https://www.example.com"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleScrapeUrl}
                disabled={isScrapingUrl || !urlInput.trim()}
                className="whitespace-nowrap"
              >
                {isScrapingUrl ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                    Scraping...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-1" />
                    Auto-fill
                  </>
                )}
              </Button>
            </div>
            {scrapingConfidence !== null && (
              <div className="flex items-center gap-2 text-sm">
                <Badge variant={scrapingConfidence > 0.7 ? "default" : scrapingConfidence > 0.5 ? "secondary" : "destructive"}>
                  {Math.round(scrapingConfidence * 100)}% confidence
                </Badge>
                <span className="text-gray-600">
                  Please review and correct the auto-filled information below
                </span>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                onFormInteraction?.();
              }}
              required
            />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RESOURCE_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
              onFormInteraction?.();
            }}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="country">Country</Label>
            <Select value={formData.country_code} onValueChange={(value) => setFormData({ ...formData, country_code: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(COUNTRIES).map(([code, info]) => (
                  <SelectItem key={code} value={code}>
                    {info.flag} {info.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => {
                setFormData({ ...formData, city: e.target.value });
                onFormInteraction?.();
              }}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="latitude">Latitude (optional)</Label>
            <Input
              id="latitude"
              type="number"
              step="any"
              value={formData.latitude || ''}
              onChange={(e) => setFormData({ ...formData, latitude: e.target.value ? parseFloat(e.target.value) : undefined })}
            />
          </div>
          <div>
            <Label htmlFor="longitude">Longitude (optional)</Label>
            <Input
              id="longitude"
              type="number"
              step="any"
              value={formData.longitude || ''}
              onChange={(e) => setFormData({ ...formData, longitude: e.target.value ? parseFloat(e.target.value) : undefined })}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {resource ? 'Update Resource' : 'Add Resource'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default ResourcesManagement;