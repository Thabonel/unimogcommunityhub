
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { useAnalytics } from '@/hooks/use-analytics';

// Mock data for groups - in a real app, this would come from your backend
const mockGroups = [
  {
    id: '1',
    name: 'Unimog U1700L Owners',
    memberCount: 24,
    isPrivate: false
  },
  {
    id: '2',
    name: 'Off-road Adventures',
    memberCount: 18,
    isPrivate: false
  },
  {
    id: '3',
    name: 'Vintage Unimog Restoration',
    memberCount: 12,
    isPrivate: true
  }
];

const GroupsList: React.FC = () => {
  const { trackFeatureUse } = useAnalytics();

  const handleGroupClick = (groupId: string) => {
    trackFeatureUse('view_group', { group_id: groupId });
    // In a real app, this would navigate to the group page
    console.log(`Viewing group: ${groupId}`);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Groups</CardTitle>
        <CardDescription>
          Connect with like-minded enthusiasts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockGroups.map((group) => (
          <Button
            key={group.id}
            variant="ghost"
            className="w-full justify-start text-left h-auto py-2 px-3"
            onClick={() => handleGroupClick(group.id)}
          >
            <div className="flex items-start gap-2">
              <Users size={18} className="mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">{group.name}</p>
                <p className="text-xs text-muted-foreground">
                  {group.memberCount} members
                  {group.isPrivate && " • Private"}
                </p>
              </div>
            </div>
          </Button>
        ))}
        
        <div className="pt-2">
          <Button variant="link" className="w-full text-xs" size="sm">
            View all groups
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupsList;
