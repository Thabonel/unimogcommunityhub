
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import { KnowledgeNavigation } from '@/components/knowledge/KnowledgeNavigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, FileText, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ArticleSubmissionDialog } from '@/components/knowledge/ArticleSubmissionDialog';
import { useAuth } from '@/contexts/AuthContext';
import { FEATURES } from '@/config/features';

const Knowledge = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const { user } = useAuth();
  
  // Get the category from URL query params
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category');
  
  
  return (
    <Layout isLoggedIn={!!user}>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-unimog-800 dark:text-unimog-200 mb-2">
              Knowledge Base
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Explore our collection of articles, guides, and resources to help you get the most out of your Unimog.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2" asChild>
              <Link to="/knowledge/manuals">
                <FileText size={16} />
                <span>Vehicle Manuals</span>
              </Link>
            </Button>
            {FEATURES.WIS_ENABLED && (
              <Button variant="outline" className="flex items-center gap-2 border-military-green text-military-green" asChild>
                <Link to="/knowledge/wis">
                  <Wrench size={16} />
                  <span>WIS System (Dev)</span>
                </Link>
              </Button>
            )}
            <Button 
              className="bg-primary"
              onClick={() => setSubmissionDialogOpen(true)}
            >
              <BookOpen size={16} className="mr-2" />
              New Article
            </Button>
          </div>
        </div>
        
        <KnowledgeNavigation />
        
        <div className="py-10 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Knowledge Base
          </h2>
          <p className="text-muted-foreground mb-6">
            Browse through our technical resources, manuals, and guides for your Unimog.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link to="/knowledge/manuals">
                Browse Manuals
              </Link>
            </Button>
            {FEATURES.WIS_ENABLED && (
              <Button asChild variant="outline">
                <Link to="/knowledge/wis">
                  Access WIS System
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Article Submission Dialog */}
      <ArticleSubmissionDialog 
        open={submissionDialogOpen} 
        onOpenChange={setSubmissionDialogOpen} 
      />
    </Layout>
  );
};

export default Knowledge;
