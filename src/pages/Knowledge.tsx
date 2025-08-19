
import Layout from '@/components/Layout';
import { KnowledgeNavigation } from '@/components/knowledge/KnowledgeNavigation';
import { Button } from '@/components/ui/button';
import { FileText, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Knowledge = () => {
  const { user } = useAuth();
  
  return (
    <Layout isLoggedIn={!!user}>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-unimog-800 dark:text-unimog-200 mb-2">
              Knowledge Base
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Explore our collection of manuals, guides, and resources to help you get the most out of your Unimog.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2" asChild>
              <Link to="/knowledge/manuals">
                <FileText size={16} />
                <span>Vehicle Manuals</span>
              </Link>
            </Button>
          </div>
        </div>
        
        <KnowledgeNavigation />
        
        <div className="py-10 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-4">
            Knowledge Base
          </h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Browse through our comprehensive collection of Unimog manuals and technical documentation.
            Select a category above or explore our vehicle manuals.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link to="/knowledge/manuals">
                Browse Vehicle Manuals
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Knowledge;
