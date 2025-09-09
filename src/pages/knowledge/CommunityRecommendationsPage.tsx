import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CommunityRecommendationsList } from '@/components/knowledge/CommunityRecommendationsList';
import { RecommendationSubmissionDialog } from '@/components/knowledge/RecommendationSubmissionDialog';
import { CategoryFilter } from '@/components/knowledge/CategoryFilter';
import { useAuth } from '@/hooks/use-auth';

export default function CommunityRecommendationsPage() {
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { user } = useAuth();

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Community Recommendations</h1>
          <p className="text-muted-foreground">
            Discover tips, guides, and recommendations from the Unimog community
          </p>
        </div>
        {user && (
          <Button onClick={() => setIsSubmitDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Submit Recommendation
          </Button>
        )}
      </div>

      <CategoryFilter 
        selectedCategory={selectedCategory} 
        onCategoryChange={handleCategoryChange}
      />

      <CommunityRecommendationsList />
      
      <RecommendationSubmissionDialog 
        open={isSubmitDialogOpen} 
        onOpenChange={setIsSubmitDialogOpen}
      />
    </div>
  );
}