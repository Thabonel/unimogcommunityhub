
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const DimensionsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dimensions & Clearances</CardTitle>
        <CardDescription>Important measurements for trail planning with your U1700L</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-hidden rounded-xl mb-6 bg-white border">
          <img
            src="/images/u1700l-dimensions.png"
            alt="U1700L Technical Dimension Diagram"
            className="w-full h-auto"
            style={{ maxHeight: '500px', objectFit: 'contain' }}
          />
          <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
            U1700L Official Technical Drawing
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-md">
            <h3 className="font-medium">Length</h3>
            <p>5,540mm (without winch)</p>
            <p className="text-xs text-muted-foreground">5,870mm with winch</p>
          </div>
          <div className="p-4 border rounded-md">
            <h3 className="font-medium">Width</h3>
            <p>2,300mm (without mirrors)</p>
            <p className="text-xs text-muted-foreground">2,465mm with mirrors</p>
          </div>
          <div className="p-4 border rounded-md">
            <h3 className="font-medium">Height</h3>
            <p>2,830mm (unladen)</p>
            <p className="text-xs text-muted-foreground">Varies with tire configuration</p>
          </div>
          <div className="p-4 border rounded-md">
            <h3 className="font-medium">Ground Clearance</h3>
            <p>470mm (convex surface)</p>
            <p className="text-xs text-muted-foreground">440mm front/rear axle (laden)</p>
          </div>
          <div className="p-4 border rounded-md">
            <h3 className="font-medium">Track Width</h3>
            <p>1,860mm (front & rear)</p>
            <p className="text-xs text-muted-foreground">Standard 12.5-20 tires</p>
          </div>
          <div className="p-4 border rounded-md">
            <h3 className="font-medium">Turning Circle</h3>
            <p>13,800mm diameter</p>
            <p className="text-xs text-muted-foreground">Track circle: 12,890mm</p>
          </div>
          <div className="p-4 border rounded-md">
            <h3 className="font-medium">Wheelbase</h3>
            <p>3,250mm</p>
            <p className="text-xs text-muted-foreground">Distance between axle centers</p>
          </div>
          <div className="p-4 border rounded-md">
            <h3 className="font-medium">Wading Depth</h3>
            <p>1,220mm</p>
            <p className="text-xs text-muted-foreground">Maximum safe water depth</p>
          </div>
          <div className="p-4 border rounded-md">
            <h3 className="font-medium">Loading Height</h3>
            <p>1,290mm (unladen)</p>
            <p className="text-xs text-muted-foreground">Platform height above ground</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
