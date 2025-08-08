
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ActivityTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No activities to display yet.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Your forum posts, marketplace listings, and other activities will show up here.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityTab;
