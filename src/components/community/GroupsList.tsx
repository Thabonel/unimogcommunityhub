
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search, Plus, Users } from 'lucide-react';

// Mock data for community groups
const MOCK_GROUPS = [
  {
    id: '1',
    name: 'Unimog Modifications',
    members: 243,
    description: 'Share your Unimog modification ideas, projects, and results with fellow enthusiasts.',
    recentActivity: true,
    category: 'Mechanical',
  },
  {
    id: '2',
    name: 'Off-road Adventures',
    members: 189,
    description: 'Plan trips, share experiences, and post photos of your Unimog conquering challenging terrains.',
    recentActivity: false,
    category: 'Travel',
  },
  {
    id: '3',
    name: 'Maintenance Tips',
    members: 156,
    description: 'Exchange maintenance tips, troubleshooting advice, and repair guides for all Unimog models.',
    recentActivity: true,
    category: 'Maintenance',
  },
  {
    id: '4',
    name: 'Vintage Unimogs',
    members: 98,
    description: 'For enthusiasts of classic and vintage Unimog models. Discuss restoration, parts, and history.',
    recentActivity: false,
    category: 'History',
  },
  {
    id: '5',
    name: 'Unimog Marketplace',
    members: 327,
    description: 'Buy, sell, and trade Unimog vehicles, parts, accessories, and tools.',
    recentActivity: true,
    category: 'Marketplace',
  },
];

const GroupsList = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h3 className="text-lg font-semibold">Unimog Community Groups</h3>
          <p className="text-sm text-muted-foreground">
            Join groups based on your interests and connect with other enthusiasts
          </p>
        </div>
        
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          Create Group
        </Button>
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          type="search" 
          placeholder="Search for groups..." 
          className="pl-8" 
        />
      </div>
      
      <div className="space-y-4">
        {MOCK_GROUPS.map((group) => (
          <Card key={group.id}>
            <CardHeader className="pb-2 flex flex-row justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-lg">{group.name}</h4>
                  {group.recentActivity && (
                    <Badge variant="secondary" className="ml-2">New activity</Badge>
                  )}
                </div>
                <div className="flex items-center text-sm text-muted-foreground gap-2 mt-1">
                  <Badge variant="outline">{group.category}</Badge>
                  <div className="flex items-center">
                    <Users size={14} className="mr-1" />
                    {group.members} members
                  </div>
                </div>
              </div>
              
              <Avatar className="h-12 w-12 rounded-md bg-primary/10 border border-primary/20">
                <AvatarFallback className="text-primary bg-transparent">
                  {group.name.substring(0, 1)}
                </AvatarFallback>
              </Avatar>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm">{group.description}</p>
            </CardContent>
            
            <CardFooter className="border-t pt-3 flex justify-between">
              <Button variant="outline">View Group</Button>
              <Button>Join</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GroupsList;
