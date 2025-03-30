
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown, Tag } from 'lucide-react';

export interface Tag {
  id: string;
  label: string;
}

interface FeedHeaderProps {
  feedFilter: string;
  selectedTags: string[];
  onFilterChange: (value: string) => void;
  onToggleTag: (tagId: string) => void;
  onClearTags: () => void;
  availableTags: Tag[];
}

const FeedHeader = ({
  feedFilter,
  selectedTags,
  onFilterChange,
  onToggleTag,
  onClearTags,
  availableTags
}: FeedHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <Tabs defaultValue="all" value={feedFilter} onValueChange={onFilterChange} className="w-full sm:w-auto">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              Filter by Topic
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="space-y-2">
              <p className="text-sm font-medium">Select topics</p>
              <div className="space-y-1">
                {availableTags.map((tag) => (
                  <Button
                    key={tag.id}
                    variant="ghost"
                    className="justify-start w-full"
                    onClick={() => onToggleTag(tag.id)}
                  >
                    {selectedTags.includes(tag.id) && <Check className="mr-2 h-4 w-4" />}
                    <span className={selectedTags.includes(tag.id) ? "font-medium" : ""}>
                      {tag.label}
                    </span>
                  </Button>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={onClearTags}
                >
                  Clear all filters
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default FeedHeader;
