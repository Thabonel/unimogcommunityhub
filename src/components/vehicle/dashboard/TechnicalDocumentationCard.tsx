
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ManualSection } from '@/components/profile/vehicle/ManualSection';

interface TechnicalDocumentationCardProps {
  modelCode: string;
}

export const TechnicalDocumentationCard = ({ modelCode }: TechnicalDocumentationCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Technical Documentation</CardTitle>
        <CardDescription>Access your vehicle's manuals and documentation</CardDescription>
      </CardHeader>
      <CardContent>
        <ManualSection modelCode={modelCode} />
      </CardContent>
    </Card>
  );
};
