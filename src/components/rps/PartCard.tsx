import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, FileText } from 'lucide-react';

interface PartCardProps {
  part: {
    niin: string;
    nsn?: string;
    group_code: string;
    item_number: string;
    description: string;
    rps_number: string;
    quantity?: number;
    repair_grade?: 'L' | 'M' | 'H';
    page_number?: number;
    figure_reference?: string;
    callout?: string;
    group?: {
      group_code: string;
      group_name: string;
    };
  };
}

export function PartCard({ part }: PartCardProps) {
  const repairGradeLabel = {
    L: 'Light',
    M: 'Medium',
    H: 'Heavy',
  }[part.repair_grade || 'L'];

  const repairGradeColor = {
    L: 'bg-green-100 text-green-800',
    M: 'bg-yellow-100 text-yellow-800',
    H: 'bg-red-100 text-red-800',
  }[part.repair_grade || 'L'];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="font-mono text-xs">
                {part.group_code}
              </Badge>
              <Badge variant="secondary" className="font-mono text-xs">
                Item {part.item_number}
              </Badge>
              {part.repair_grade && (
                <Badge className={repairGradeColor}>
                  {repairGradeLabel} Repair
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg">{part.description}</CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Part Numbers */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground font-medium">NIIN</p>
            <p className="font-mono font-semibold">{part.niin}</p>
          </div>
          {part.nsn && (
            <div>
              <p className="text-muted-foreground font-medium">NSN</p>
              <p className="font-mono text-sm">{part.nsn}</p>
            </div>
          )}
          {part.quantity && (
            <div>
              <p className="text-muted-foreground font-medium">Quantity</p>
              <p className="font-semibold">{part.quantity}</p>
            </div>
          )}
          {part.group?.group_name && (
            <div>
              <p className="text-muted-foreground font-medium">Group</p>
              <p className="font-semibold">{part.group.group_name}</p>
            </div>
          )}
        </div>

        {/* Figure Reference */}
        {part.figure_reference && (
          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm font-medium mb-1">Illustration</p>
            <p className="text-sm">
              Figure {part.figure_reference}
              {part.callout && `, callout ${part.callout}`}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t">
          {part.page_number && (
            <Button variant="outline" size="sm" className="flex-1">
              <FileText className="h-4 w-4 mr-2" />
              Page {part.page_number}
            </Button>
          )}
          <Button variant="outline" size="sm" className="flex-1">
            <ExternalLink className="h-4 w-4 mr-2" />
            RPS {part.rps_number}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
