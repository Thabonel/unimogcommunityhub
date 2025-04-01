
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

interface Issue {
  title: string;
  description: string;
}

interface CommonIssuesTabProps {
  issues: Issue[];
  searchQuery: string;
}

export const CommonIssuesTab = ({ issues, searchQuery }: CommonIssuesTabProps) => {
  const filterData = (data: Issue[], query: string) => {
    if (!query) return data;
    return data.filter(item => 
      Object.values(item).some(
        value => value.toString().toLowerCase().includes(query.toLowerCase())
      )
    );
  };
  
  const filteredIssues = filterData(issues, searchQuery);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Common Issues & Solutions</CardTitle>
        <CardDescription>Frequently encountered problems with the ex-military U1700L Unimog</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredIssues.map((issue, index) => (
            <div key={index} className="p-4 border rounded-md">
              <h3 className="font-medium text-lg mb-2">{issue.title}</h3>
              <p className="text-muted-foreground">{issue.description}</p>
            </div>
          ))}
        </div>

        {filteredIssues.length === 0 && (
          <p className="text-center py-8 text-muted-foreground">No issues match your search criteria.</p>
        )}
        
        <div className="mt-6 flex justify-center">
          <Button className="bg-primary text-primary-foreground">
            <BookOpen className="mr-2 h-4 w-4" />
            View Full Repair Guide
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
