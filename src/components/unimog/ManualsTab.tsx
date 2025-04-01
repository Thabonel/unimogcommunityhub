
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-md flex flex-col items-center text-center">
            <BookOpen className="h-12 w-12 mb-4 text-primary" />
            <h3 className="font-medium text-lg mb-2">Owner's Manual</h3>
            <p className="text-muted-foreground mb-4">Complete operator's guide for the U1700L military model</p>
            <ManualSection modelCode="U1700L" />
          </div>
          
          <div className="p-6 border rounded-md flex flex-col items-center text-center">
            <Wrench className="h-12 w-12 mb-4 text-primary" />
            <h3 className="font-medium text-lg mb-2">Service Manual</h3>
            <p className="text-muted-foreground mb-4">Detailed repair and maintenance procedures</p>
            <Button>Download PDF</Button>
          </div>
          
          <div className="p-6 border rounded-md flex flex-col items-center text-center">
            <FileText className="h-12 w-12 mb-4 text-primary" />
            <h3 className="font-medium text-lg mb-2">Parts Catalog</h3>
            <p className="text-muted-foreground mb-4">Complete parts listing with diagrams</p>
            <Button>Download PDF</Button>
          </div>
          
          <div className="p-6 border rounded-md flex flex-col items-center text-center">
            <Ruler className="h-12 w-12 mb-4 text-primary" />
            <h3 className="font-medium text-lg mb-2">Military Conversion Guide</h3>
            <p className="text-muted-foreground mb-4">Guide for converting ex-military models to civilian use</p>
            <Button>Download PDF</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
