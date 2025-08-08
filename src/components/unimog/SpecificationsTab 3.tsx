
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Specification {
  label: string;
  value: string;
}

interface SpecificationsTabProps {
  specifications: Specification[];
  searchQuery: string;
}

export const SpecificationsTab = ({ specifications, searchQuery }: SpecificationsTabProps) => {
  const filterData = (data: Specification[], query: string) => {
    if (!query) return data;
    return data.filter(item => 
      Object.values(item).some(
        value => value.toString().toLowerCase().includes(query.toLowerCase())
      )
    );
  };
  
  const filteredSpecs = filterData(specifications, searchQuery);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Technical Specifications</CardTitle>
        <CardDescription>Detailed specifications for the Unimog U1700L military model</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSpecs.map((spec, index) => (
            <div key={index} className="flex flex-col p-4 border rounded-md">
              <span className="text-sm text-muted-foreground">{spec.label}</span>
              <span className="font-medium">{spec.value}</span>
            </div>
          ))}
        </div>

        {filteredSpecs.length === 0 && (
          <p className="text-center py-8 text-muted-foreground">No specifications match your search criteria.</p>
        )}
      </CardContent>
    </Card>
  );
};
