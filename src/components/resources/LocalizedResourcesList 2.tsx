
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExternalLink } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  countries: string[];
  type: 'dealership' | 'service' | 'parts' | 'regulation';
}

export function LocalizedResourcesList() {
  const { t } = useTranslation();
  const { country } = useLocalization();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResources() {
      setLoading(true);
      try {
        // In a real app, this would be an API call to fetch resources based on country
        // For demo, we'll use static data
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data - in a real app this would come from the server
        const mockResources: Resource[] = [
          {
            id: '1',
            title: 'Mercedes-Benz Dealership',
            description: 'Official Mercedes-Benz dealership with Unimog vehicles',
            url: 'https://example.com/dealer',
            countries: ['GB', 'DE'],
            type: 'dealership'
          },
          {
            id: '2',
            title: 'Specialized Service Center',
            description: 'Expert Unimog mechanics and maintenance',
            url: 'https://example.com/service',
            countries: ['GB', 'DE', 'AU'],
            type: 'service'
          },
          {
            id: '3',
            title: 'OEM Parts Supplier',
            description: 'Official parts and accessories for Unimog vehicles',
            url: 'https://example.com/parts',
            countries: ['GB', 'DE', 'AU', 'TR', 'AR'],
            type: 'parts'
          },
          {
            id: '4',
            title: 'Highway Regulations for Heavy Vehicles',
            description: 'Official regulations for operating Unimog on public roads',
            url: 'https://example.com/regulations',
            countries: ['DE'],
            type: 'regulation'
          },
          {
            id: '5',
            title: 'Turkish Unimog Club & Service',
            description: 'Community and servicing center for Unimog owners',
            url: 'https://example.com/tr-service',
            countries: ['TR'],
            type: 'service'
          }
        ];
        
        // Filter resources by country
        const filteredResources = mockResources.filter(
          resource => resource.countries.includes(country)
        );
        
        setResources(filteredResources);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchResources();
  }, [country]);
  
  const resourcesByType = {
    dealership: resources.filter(r => r.type === 'dealership'),
    service: resources.filter(r => r.type === 'service'),
    parts: resources.filter(r => r.type === 'parts'),
    regulation: resources.filter(r => r.type === 'regulation')
  };

  if (loading) {
    return (
      <div className="h-48 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary"></div>
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('resources.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-muted-foreground">
            {t('No localized resources available for your country yet.')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">{t('resources.title')}</h1>
      
      {resourcesByType.dealership.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('resources.dealerships')}</CardTitle>
            <CardDescription>
              {t('Official Unimog dealerships in your region')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-72">
              <div className="space-y-4">
                {resourcesByType.dealership.map(resource => (
                  <ResourceItem key={resource.id} resource={resource} />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
      
      {resourcesByType.service.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('resources.service_centers')}</CardTitle>
            <CardDescription>
              {t('Authorized service centers for maintenance and repairs')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-72">
              <div className="space-y-4">
                {resourcesByType.service.map(resource => (
                  <ResourceItem key={resource.id} resource={resource} />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
      
      {resourcesByType.parts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('resources.spare_parts')}</CardTitle>
            <CardDescription>
              {t('Where to find genuine Unimog parts')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-72">
              <div className="space-y-4">
                {resourcesByType.parts.map(resource => (
                  <ResourceItem key={resource.id} resource={resource} />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
      
      {resourcesByType.regulation.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('resources.regulations')}</CardTitle>
            <CardDescription>
              {t('Local laws and regulations for Unimog vehicles')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-72">
              <div className="space-y-4">
                {resourcesByType.regulation.map(resource => (
                  <ResourceItem key={resource.id} resource={resource} />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ResourceItem({ resource }: { resource: Resource }) {
  return (
    <a 
      href={resource.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block p-4 border rounded-md hover:bg-accent transition-colors"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{resource.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
        </div>
        <ExternalLink className="h-4 w-4 text-muted-foreground" />
      </div>
    </a>
  );
}
