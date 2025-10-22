import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { IllustrationReviewCard } from '@/components/admin/rps/IllustrationReviewCard';
import { useRPSReview } from '@/hooks/use-rps-review';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, Edit, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function RPSIllustrationReview() {
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const {
    currentIllustration,
    currentIndex,
    totalIllustrations,
    isLoading,
    stats,
    approve,
    reject,
    skip,
    goToPrevious,
    goToNext,
    hasPrevious,
    hasNext
  } = useRPSReview(groupFilter === 'all' ? undefined : groupFilter);

  // Common group codes for filtering
  const groupCodes = ['all', 'EA', 'EC', 'ED', 'DHA', 'DHB', 'DK', 'FDA', 'FDB', 'FBD', 'FDE', 'HA', 'J', 'JA', 'JB'];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">RPS Illustration Review</h1>
          <p className="text-muted-foreground mt-2">
            Review and correct illustration names from the RPS manual
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{stats.total}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Approved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold">{stats.approved}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Corrected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-blue-600" />
                <span className="text-2xl font-bold">{stats.corrected}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Remaining
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-orange-600" />
                <span className="text-2xl font-bold">{totalIllustrations}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Filter by Group</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={groupFilter} onValueChange={setGroupFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Groups" />
              </SelectTrigger>
              <SelectContent>
                {groupCodes.map((code) => (
                  <SelectItem key={code} value={code}>
                    {code === 'all' ? 'All Groups' : code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Review Card */}
        {isLoading ? (
          <Card>
            <CardContent className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading illustrations...</p>
              </div>
            </CardContent>
          </Card>
        ) : !currentIllustration ? (
          <Alert>
            <AlertDescription>
              {groupFilter !== 'all'
                ? `No illustrations found for group ${groupFilter}. Try selecting a different group or "All Groups".`
                : 'All illustrations have been reviewed! Great work!'}
            </AlertDescription>
          </Alert>
        ) : (
          <IllustrationReviewCard
            illustration={currentIllustration}
            currentIndex={currentIndex}
            total={totalIllustrations}
            onApprove={approve}
            onReject={reject}
            onSkip={skip}
            onPrevious={goToPrevious}
            onNext={goToNext}
            hasPrevious={hasPrevious}
            hasNext={hasNext}
          />
        )}

        {/* Help Text */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-sm">Keyboard Shortcuts</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <div className="flex gap-4">
              <Badge variant="outline">Y</Badge>
              <span>Approve current name</span>
            </div>
            <div className="flex gap-4">
              <Badge variant="outline">N</Badge>
              <span>Reject and rename</span>
            </div>
            <div className="flex gap-4">
              <Badge variant="outline">←</Badge>
              <span>Previous illustration</span>
            </div>
            <div className="flex gap-4">
              <Badge variant="outline">→</Badge>
              <span>Next illustration</span>
            </div>
            <div className="flex gap-4">
              <Badge variant="outline">Enter</Badge>
              <span>Save correction and continue</span>
            </div>
            <div className="flex gap-4">
              <Badge variant="outline">Esc</Badge>
              <span>Cancel rename</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
