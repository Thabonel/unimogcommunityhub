
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useUnimogData } from '@/hooks/use-unimog-data';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { WikiDataSection } from './vehicle/WikiDataSection';
import { UnimogSpecsSection } from './vehicle/UnimogSpecsSection';
import { ManualSection } from './vehicle/ManualSection';
import { LoadingState, ErrorState, EmptyState } from './vehicle/LoadingErrorStates';

interface UnimogDataCardProps {
  modelCode?: string;
}

export default function UnimogDataCard({ modelCode }: UnimogDataCardProps) {
  const { user } = useAuth();
  const { unimogData, wikiData, isLoading, error, saveWikiDataToProfile } = useUnimogData(modelCode);
  const [saving, setSaving] = useState(false);

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
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (error) {
    return <ErrorState />;
  }
  
  if (!unimogData && !wikiData) {
    return <EmptyState />;
  }
  
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        {/* Wiki data section */}
        {wikiData && (
          <WikiDataSection 
            wikiData={wikiData}
            onSave={handleSaveToProfile}
            saving={saving}
            isAuthenticated={!!user}
          />
        )}
        
        {/* Unimog data section */}
        {unimogData && (
          <UnimogSpecsSection unimogData={unimogData} />
        )}
        
        {/* Owner's Manual section specifically for U1700L */}
        {modelCode === 'U1700L' && (
          <ManualSection modelCode={modelCode} />
        )}
      </CardContent>
    </Card>
  );
}
