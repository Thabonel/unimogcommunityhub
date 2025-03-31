
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MaintenanceRecommendations() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <p className="font-medium mb-1">Next Oil Change</p>
            <p className="text-sm text-muted-foreground">
              Based on your vehicle's history, consider scheduling an oil change in the next 500 miles.
            </p>
          </div>
          
          <div className="rounded-lg bg-muted p-4">
            <p className="font-medium mb-1">Tire Rotation Due</p>
            <p className="text-sm text-muted-foreground">
              Your last tire rotation was 5,000 miles ago. Consider scheduling this maintenance soon.
            </p>
          </div>
          
          <div className="rounded-lg bg-muted p-4">
            <p className="font-medium mb-1">Cost Optimization</p>
            <p className="text-sm text-muted-foreground">
              You could save approximately $120 annually by adjusting your maintenance schedule based on actual usage patterns.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
