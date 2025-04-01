
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const DimensionsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dimensions & Clearances</CardTitle>
        <CardDescription>Important measurements for trail planning with your U1700L</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video overflow-hidden rounded-xl mb-6 bg-muted flex items-center justify-center">
          <p className="text-muted-foreground">Unimog U1700L Dimension Diagram</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-md">
            <h3 className="font-medium">Length</h3>
            <p>5.35-5.90 meters (depending on configuration)</p>
          </div>
          <div className="p-4 border rounded-md">
            <h3 className="font-medium">Width</h3>
            <p>2.30 meters (without mirrors)</p>
          </div>
          <div className="p-4 border rounded-md">
            <h3 className="font-medium">Height</h3>
            <p>2.70-3.00 meters (standard configuration)</p>
          </div>
          <div className="p-4 border rounded-md">
            <h3 className="font-medium">Ground Clearance</h3>
            <p>450 mm (center)</p>
          </div>
          <div className="p-4 border rounded-md">
            <h3 className="font-medium">Track Width</h3>
            <p>1.63 meters</p>
          </div>
          <div className="p-4 border rounded-md">
            <h3 className="font-medium">Minimum Turning Radius</h3>
            <p>7.5 meters</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
