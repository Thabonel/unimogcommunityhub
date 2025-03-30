
import { Card, CardContent } from '@/components/ui/card';
import { CommunityHealthMetrics } from '@/services/analytics/types/communityHealthTypes';

interface TopContributorsProps {
  contributors: CommunityHealthMetrics['topContributors'];
}

export function TopContributors({ contributors }: TopContributorsProps) {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-4">Top Contributors</h3>
      {contributors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {contributors.map((contributor, index) => (
            <Card key={contributor.userId} className="overflow-hidden">
              <div className={`h-1.5 ${
                index === 0 ? 'bg-yellow-400' : 
                index === 1 ? 'bg-gray-400' : 
                index === 2 ? 'bg-amber-600' : 'bg-blue-400'
              }`} />
              <CardContent className="pt-4">
                <p className="font-medium">{contributor.displayName}</p>
                <p className="text-sm text-muted-foreground">
                  {contributor.contributions} contributions
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No contributor data available</p>
      )}
    </div>
  );
}
