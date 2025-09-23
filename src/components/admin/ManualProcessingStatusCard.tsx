import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Book, Play, CheckCircle, AlertCircle } from 'lucide-react';
import { useManualStatus } from '@/hooks/use-manual-status';
import { useAdmin } from '@/contexts/AdminContext';

export function ManualProcessingStatusCard() {
  const { unprocessedCount, totalManuals, isLoading, error } = useManualStatus();
  const { setCurrentSection } = useAdmin();

  const handleProcessManuals = () => {
    setCurrentSection('manuals');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Manual Processing</CardTitle>
          <Book className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Loading...</div>
          <p className="text-xs text-muted-foreground">Checking manual status</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Manual Processing</CardTitle>
          <AlertCircle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">Error</div>
          <p className="text-xs text-muted-foreground">Failed to load status</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={unprocessedCount > 0 ? "border-amber-200 bg-amber-50" : "border-green-200 bg-green-50"}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Manual Processing</CardTitle>
        <Book className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold flex items-center gap-2">
              {unprocessedCount}
              {unprocessedCount > 0 && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  Need Processing
                </Badge>
              )}
              {unprocessedCount === 0 && (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {unprocessedCount === 0
                ? `All ${totalManuals} manuals processed for Barry AI`
                : `of ${totalManuals} manuals need chunking for Barry AI`
              }
            </p>
          </div>
          {unprocessedCount > 0 && (
            <Button
              size="sm"
              onClick={handleProcessManuals}
              className="ml-4"
            >
              <Play className="h-4 w-4 mr-1" />
              Process Now
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}