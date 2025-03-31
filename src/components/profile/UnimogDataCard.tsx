
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink, FileText } from 'lucide-react';
import { useUnimogData } from '@/hooks/use-unimog-data';
import { useAuth } from '@/contexts/AuthContext';
import { PdfViewer } from '@/components/knowledge/PdfViewer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface UnimogDataCardProps {
  modelCode?: string;
}

export default function UnimogDataCard({ modelCode }: UnimogDataCardProps) {
  const { user } = useAuth();
  const { unimogData, wikiData, isLoading, error, saveWikiDataToProfile } = useUnimogData(modelCode);
  const [saving, setSaving] = useState(false);
  const [viewingManual, setViewingManual] = useState<string | null>(null);

  // Handle saving the wiki data to the user's profile
  const handleSaveToProfile = async () => {
    if (!user || !user.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save vehicle information to your profile",
        variant: "destructive"
      });
      return;
    }
    
    setSaving(true);
    try {
      await saveWikiDataToProfile(user.id);
      toast({
        title: "Information saved",
        description: "Vehicle information has been saved to your profile"
      });
    } catch (err) {
      console.error('Error saving to profile:', err);
    } finally {
      setSaving(false);
    }
  };

  // Handle opening the owner's manual PDF for U1700L
  const handleOpenOwnerManual = async () => {
    if (modelCode !== 'U1700L') return;
    
    try {
      // Get a signed URL for the file
      const { data, error } = await supabase.storage
        .from('manuals')
        .createSignedUrl('UHB-Unimog-Cargo.pdf', 60 * 60); // 1 hour expiry
      
      if (error) throw error;
      if (!data?.signedUrl) throw new Error("Failed to get manual URL");
      
      setViewingManual(data.signedUrl);
    } catch (err) {
      console.error('Error opening manual:', err);
      toast({
        title: 'Error',
        description: 'Could not open the owner\'s manual',
        variant: 'destructive'
      });
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-500">Failed to load vehicle data.</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!unimogData && !wikiData) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground italic">No information available for this model.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <>
      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Wiki data section */}
          {wikiData && (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium">{wikiData.title}</h3>
                {user && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSaveToProfile}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : "Save to Profile"}
                  </Button>
                )}
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                {wikiData.thumbnail && (
                  <div className="md:w-1/3">
                    <img 
                      src={wikiData.thumbnail.source} 
                      alt={wikiData.title} 
                      className="w-full h-auto rounded-md shadow-md" 
                    />
                  </div>
                )}
                
                <div className={`${wikiData.thumbnail ? 'md:w-2/3' : 'w-full'}`}>
                  <p className="text-sm leading-relaxed">{wikiData.extract}</p>
                  
                  {wikiData.content_urls && (
                    <a 
                      href={wikiData.content_urls.desktop.page} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center mt-4 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Read more on Wikipedia
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Unimog data section */}
          {unimogData && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium">{unimogData.name} Technical Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Model Code</p>
                  <p className="font-medium">{unimogData.model_code}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Series</p>
                  <p className="font-medium">{unimogData.series}</p>
                </div>
              </div>
              
              {Object.keys(unimogData.specs).length > 0 && (
                <div className="pt-2">
                  <p className="text-sm font-medium mb-2">Specifications</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(unimogData.specs).map(([key, value]) => (
                      <div key={key} className="text-sm">
                        <span className="text-muted-foreground capitalize">{key.replace('_', ' ')}: </span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {unimogData.features && unimogData.features.length > 0 && (
                <div className="pt-2">
                  <p className="text-sm font-medium mb-2">Features</p>
                  <div className="flex flex-wrap gap-2">
                    {unimogData.features.map((feature, index) => (
                      <Badge key={index} variant="secondary">{feature}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Owner's Manual section specifically for U1700L */}
              {modelCode === 'U1700L' && (
                <div className="pt-4 mt-4 border-t">
                  <h3 className="text-lg font-medium mb-3">Owner's Manual</h3>
                  <div className="flex items-center gap-4">
                    <FileText className="text-primary" />
                    <div className="flex-grow">
                      <p className="font-medium">UHB-Unimog-Cargo Manual</p>
                      <p className="text-xs text-muted-foreground">Complete operator's guide for the U1700L military model</p>
                    </div>
                    <Button onClick={handleOpenOwnerManual} size="sm">
                      View Manual
                    </Button>
                  </div>
                </div>
              )}
              
              {unimogData.history && (
                <div className="pt-4 mt-2 border-t">
                  <p className="text-sm font-medium mb-2">History</p>
                  <p className="text-sm">{unimogData.history}</p>
                </div>
              )}
              
              {unimogData.capabilities && (
                <div className="pt-2">
                  <p className="text-sm font-medium mb-2">Capabilities</p>
                  <p className="text-sm">{unimogData.capabilities}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* PDF Viewer Modal */}
      {viewingManual && (
        <PdfViewer url={viewingManual} onClose={() => setViewingManual(null)} />
      )}
    </>
  );
}
