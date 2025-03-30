
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface FullReportViewProps {
  reportText: string | null;
  showFullReport: boolean;
  reportDate?: Date;
}

export function FullReportView({ 
  reportText, 
  showFullReport,
  reportDate = new Date() 
}: FullReportViewProps) {
  if (!showFullReport || !reportText) {
    return null;
  }

  const downloadReport = () => {
    if (!reportText) return;
    
    const element = document.createElement('a');
    const file = new Blob([reportText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `community_health_report_${reportDate.toISOString().split('T')[0]}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: 'Report Downloaded',
      description: 'The community health report has been downloaded.'
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Community Health Report</CardTitle>
          <Button variant="outline" size="sm" onClick={downloadReport}>
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
        <CardDescription>
          Generated on {reportDate.toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-muted p-4 rounded-md whitespace-pre-wrap font-mono text-sm">
          {reportText}
        </div>
      </CardContent>
    </Card>
  );
}
