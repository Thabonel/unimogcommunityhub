
import { Button } from '@/components/ui/button';
import { ExternalLink, Loader2 } from 'lucide-react';
import { WikipediaData } from '@/hooks/use-unimog-data';

interface WikiDataSectionProps {
  wikiData: WikipediaData;
  onSave: () => void;
  saving: boolean;
  isAuthenticated: boolean;
}

export const WikiDataSection = ({ wikiData, onSave, saving, isAuthenticated }: WikiDataSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium">{wikiData.title}</h3>
        {isAuthenticated && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onSave}
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
  );
};
