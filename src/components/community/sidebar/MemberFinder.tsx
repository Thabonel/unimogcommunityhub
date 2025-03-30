
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useAnalytics } from '@/hooks/use-analytics';

const MemberFinder = () => {
  const { trackFeatureUse } = useAnalytics();

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">Find Members</h3>
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search people..." 
            className="pl-8" 
            onChange={() => trackFeatureUse('search', { type: 'member_search' })}
          />
        </div>
        <h4 className="text-sm font-medium mb-2">Suggested Connections</h4>
        <div className="space-y-3">
          {['Alex Weber', 'Sarah Johnson', 'Mike Thompson'].map((name, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{name}</span>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => trackFeatureUse('connection_request', { user: name })}
              >
                Connect
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberFinder;
