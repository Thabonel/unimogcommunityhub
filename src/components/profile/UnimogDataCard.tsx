
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useUnimogData } from '@/hooks/use-unimog-data';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { WikiDataSection } from './vehicle/WikiDataSection';
import { UnimogSpecsSection } from './vehicle/UnimogSpecsSection';
import { LoadingState, ErrorState, EmptyState } from './vehicle/LoadingErrorStates';

interface UnimogDataCardProps {
  modelCode?: string;
}

// Define a transformation function to convert UnimogModel to UnimogData
const transformToUnimogData = (model: any) => {
  if (!model || !model.specs) return null;
  
  return {
    engine: model.specs.engine || '',
    transmission: model.specs.transmission || '',
    power: model.specs.power || '',
    torque: model.specs.torque || '',
    weight: model.specs.weight || '',
    dimensions: model.specs.dimensions || '',
    features: model.features || []
  };
};

export default function UnimogDataCard({ modelCode }: UnimogDataCardProps) {
  const { user } = useAuth();
  const { unimogData, wikiData, isLoading, error, saveWikiDataToProfile } = useUnimogData(modelCode);
  const [saving, setSaving] = useState(false);

  // Transform the unimogData to the format expected by UnimogSpecsSection
  const formattedUnimogData = unimogData ? transformToUnimogData(unimogData) : null;

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
        {formattedUnimogData && (
          <UnimogSpecsSection 
            unimogData={formattedUnimogData} 
            modelCode={modelCode}
          />
        )}
      </CardContent>
    </Card>
  );
}
