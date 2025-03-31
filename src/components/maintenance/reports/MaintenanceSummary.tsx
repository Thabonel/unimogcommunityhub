
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MaintenanceSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between border-b pb-2">
            <span>Total maintenance costs:</span>
            <span className="font-medium">$1,400.00</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span>Number of maintenance events:</span>
            <span className="font-medium">9</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span>Most common service:</span>
            <span className="font-medium">Oil Change (3)</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span>Most expensive service:</span>
            <span className="font-medium">Engine Repair ($1,200)</span>
          </div>
          <div className="flex justify-between pb-2">
            <span>Average cost per service:</span>
            <span className="font-medium">$155.56</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
