
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

// Define the interface for the transformed data that UnimogSpecsSection expects
interface UnimogData {
  engine: string;
  transmission: string;
  power: string;
  torque: string;
  weight: string;
  dimensions: string;
  features: string[];
}

export default function UnimogDataCard({ modelCode }: UnimogDataCardProps) {
  const { user } = useAuth();
  const { unimogData, wikiData, isLoading, error, saveWikiDataToProfile } = useUnimogData(modelCode);
  const [saving, setSaving] = useState(false);

  // Transform unimogData from UnimogModel to UnimogData format
  const transformToUnimogData = (data: any): UnimogData | null => {
    if (!data) return null;
    
    // Extract specs from the unimogModel data
    const specs = data.specs || {};
    
    // Return data in the format UnimogSpecsSection expects
    return {
      engine: specs.engine || 'Not specified',
      transmission: specs.transmission || 'Not specified',
      power: specs.power || 'Not specified',
      torque: specs.torque || 'Not specified',
      weight: specs.weight || 'Not specified',
      dimensions: specs.dimensions || 'Not specified',
      features: data.features || []
    };
  };

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
  
  // Transform the unimogData to the format expected by UnimogSpecsSection
  const transformedUnimogData = transformToUnimogData(unimogData);
  
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
        {transformedUnimogData && (
          <UnimogSpecsSection unimogData={transformedUnimogData} modelCode={modelCode} />
        )}
      </CardContent>
    </Card>
  );
}
