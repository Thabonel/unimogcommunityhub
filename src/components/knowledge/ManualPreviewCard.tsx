import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Eye, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ManualPreviewCardProps {
  manualTitle: string;
  description?: string;
  totalPages: number;
  publicPages: number;
  coverImageUrl?: string;
  manualSlug: string;
}

export function ManualPreviewCard({
  manualTitle,
  description,
  totalPages,
  publicPages,
  coverImageUrl,
  manualSlug
}: ManualPreviewCardProps) {
  const navigate = useNavigate();

  const previewPercentage = Math.round((publicPages / totalPages) * 100);

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      {coverImageUrl && (
        <div className="aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={coverImageUrl}
            alt={manualTitle}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base line-clamp-2 flex-1">
            {manualTitle}
          </CardTitle>
          <Badge variant="secondary" className="text-xs flex-shrink-0">
            {previewPercentage}% Free
          </Badge>
        </div>
        {description && (
          <CardDescription className="line-clamp-2">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow pb-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Total Pages</p>
              <p className="font-medium">{totalPages}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Preview</p>
              <p className="font-medium">{publicPages} pages</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => navigate(`/manuals/preview/${manualSlug}`)}
        >
          <Eye className="h-4 w-4 mr-1" />
          View Preview
        </Button>
        <Button
          size="sm"
          className="flex-1 bg-military-green hover:bg-military-green/90"
          onClick={() => navigate('/pricing')}
        >
          <Lock className="h-4 w-4 mr-1" />
          Unlock Full
        </Button>
      </CardFooter>
    </Card>
  );
}
