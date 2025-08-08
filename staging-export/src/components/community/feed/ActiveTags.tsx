
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tag } from './FeedHeader';

interface ActiveTagsProps {
  selectedTags: string[];
  onToggleTag: (tagId: string) => void;
  onClearTags: () => void;
  availableTags: Tag[];
}

const ActiveTags = ({
  selectedTags,
  onToggleTag,
  onClearTags,
  availableTags
}: ActiveTagsProps) => {
  if (selectedTags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {selectedTags.map(tagId => {
        const tag = availableTags.find(t => t.id === tagId);
        return (
          <Badge key={tagId} variant="secondary" className="px-3 py-1">
            {tag?.label || tagId}
            <button 
              className="ml-1 text-xs"
              onClick={() => onToggleTag(tagId)}
            >
              ×
            </button>
          </Badge>
        );
      })}
      <Button variant="ghost" size="sm" onClick={onClearTags}>
        Clear all
      </Button>
    </div>
  );
};

export default ActiveTags;
