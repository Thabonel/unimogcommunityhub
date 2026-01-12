import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';
import { CommunityRecommendationsList } from '@/components/knowledge/CommunityRecommendationsList';
import { RecommendationSubmissionDialog } from '@/components/knowledge/RecommendationSubmissionDialog';
import { CategoryFilter } from '@/components/knowledge/CategoryFilter';
import { useAuth } from '@/hooks/use-auth';

export default function CommunityRecommendationsPage() {
  const navigate = useNavigate();
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { user } = useAuth();

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        onClick={() => navigate(-1)}
        variant="outline"
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Community Recommendations</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Discover tips, guides, and recommendations from the Unimog community
          </p>
        </div>
        {user && (
          <Button
            onClick={() => setIsSubmitDialogOpen(true)}
            className="w-full sm:w-auto min-w-0 shrink-0"
          >
            <Plus className="h-4 w-4 shrink-0" />
            <span className="truncate">Submit</span>
          </Button>
        )}
      </div>

      <CategoryFilter 
        selectedCategory={selectedCategory} 
        onCategoryChange={handleCategoryChange}
      />

      <CommunityRecommendationsList category={selectedCategory} />
      
      <RecommendationSubmissionDialog 
        open={isSubmitDialogOpen} 
        onOpenChange={setIsSubmitDialogOpen}
      />
    </div>
  );
}