
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useUnimogData } from '@/hooks/use-unimog-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, ExternalLink, AlertCircle, Save } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface UnimogDataCardProps {
  modelCode: string;
}

export default function UnimogDataCard({ modelCode }: UnimogDataCardProps) {
  const { user } = useAuth();
  const { unimogData, wikiData, isLoading, saveWikiDataToProfile } = useUnimogData(modelCode);
  
  if (isLoading) {
    return (
      <Card className="border border-border/50">
        <CardHeader>
          <Skeleton className="h-8 w-1/3 mb-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-32 w-full mb-2" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!unimogData && !wikiData) {
    return (
      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle>Vehicle Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-amber-600">
            <AlertCircle size={20} />
            <p>No information available for this Unimog model.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const handleSaveToProfile = async () => {
    if (user) {
      await saveWikiDataToProfile(user.id);
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle>{unimogData?.name || wikiData?.title || `Unimog ${modelCode}`}</CardTitle>
        </CardHeader>
        
        {wikiData?.thumbnail && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="px-6 mb-4"
          >
            <div className="overflow-hidden rounded-lg">
              <img 
                src={wikiData.thumbnail.source} 
                alt={`${wikiData.title} vehicle image`} 
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          </motion.div>
        )}
        
        <CardContent className="space-y-4">
          {wikiData?.extract && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-foreground/80 leading-relaxed text-base">{wikiData.extract}</p>
            </motion.div>
          )}
          
          {unimogData && (
            <>
              <Separator />
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                {unimogData.history && (
                  <div>
                    <h3 className="font-semibold mb-1">History</h3>
                    <p className="text-sm text-foreground/80">{unimogData.history}</p>
                  </div>
                )}
                
                {unimogData.capabilities && (
                  <div>
                    <h3 className="font-semibold mb-1">Capabilities</h3>
                    <p className="text-sm text-foreground/80">{unimogData.capabilities}</p>
                  </div>
                )}
                
                {unimogData.specs && Object.keys(unimogData.specs).length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-1">Specifications</h3>
                    <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-sm">
                      {Object.entries(unimogData.specs).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-muted-foreground capitalize">{key.replace('_', ' ')}:</span>
                          <span className="font-medium">{value as string}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {unimogData.features && Array.isArray(unimogData.features) && unimogData.features.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-1">Features</h3>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {unimogData.features.map((feature, index) => (
                        <li key={index} className="text-foreground/80">{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {wikiData?.content_urls?.desktop?.page && (
            <motion.a
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              href={wikiData.content_urls.desktop.page}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Read more about Unimog on Wikipedia"
              className="inline-flex items-center gap-2 text-unimog-500 hover:text-unimog-700 dark:text-unimog-300 dark:hover:text-unimog-200 text-sm font-medium transition-colors"
            >
              Read more on Wikipedia
              <ExternalLink size={14} />
            </motion.a>
          )}
          
          <Button 
            size="sm"
            variant="outline"
            onClick={handleSaveToProfile}
            className="gap-2"
            disabled={!user}
          >
            <Save size={14} /> Save to My Profile
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
