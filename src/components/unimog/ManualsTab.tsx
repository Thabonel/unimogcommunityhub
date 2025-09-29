
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Wrench, FileText, Ruler } from 'lucide-react';
import { ManualSection } from '@/components/profile/vehicle/ManualSection';

export const ManualsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Technical Documentation</CardTitle>
        <CardDescription>Official manuals and technical documentation for the U1700L</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Working Manual */}
          <div className="p-6 border rounded-md flex flex-col items-center text-center bg-muted/20">
            <BookOpen className="h-12 w-12 mb-4 text-primary" />
            <h3 className="font-medium text-lg mb-2">Owner's Manual</h3>
            <p className="text-muted-foreground mb-4">Complete operator's guide for the U1700L military model</p>
            <ManualSection modelCode="U1700L" />
          </div>

          {/* Coming Soon Notice */}
          <div className="p-6 border border-dashed rounded-md text-center">
            <div className="flex justify-center space-x-4 mb-4">
              <Wrench className="h-8 w-8 text-muted-foreground" />
              <FileText className="h-8 w-8 text-muted-foreground" />
              <Ruler className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-lg mb-2">Additional Manuals Coming Soon</h3>
            <p className="text-muted-foreground mb-4">
              Service Manual, Parts Catalog, and Military Conversion Guide will be available soon.
            </p>
            <p className="text-sm text-muted-foreground">
              In the meantime, visit our{' '}
              <Button variant="link" className="p-0 h-auto font-normal text-primary" asChild>
                <a href="/knowledge">Knowledge Base</a>
              </Button>
              {' '}for additional technical resources and manuals.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
