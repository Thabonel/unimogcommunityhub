
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Plus, Lock } from 'lucide-react';
import { useAnalytics } from '@/hooks/use-analytics';
import { CreateGroupDialog } from './CreateGroupDialog';
import GroupDetail from './GroupDetail';

// Extended mock data for groups - in a real app, this would come from your backend
const mockGroups = [
  {
    id: '1',
    name: 'Unimog U1700L Owners',
    memberCount: 24,
    isPrivate: false,
    description: 'A group for owners of the Unimog U1700L model to share experiences and tips.',
    createdBy: 'user-1'
  },
  {
    id: '2',
    name: 'Off-road Adventures',
    memberCount: 18,
    isPrivate: false,
    description: 'Plan and share your off-road adventures with other Unimog enthusiasts.',
    createdBy: 'user-2'
  },
  {
    id: '3',
    name: 'Vintage Unimog Restoration',
    memberCount: 12,
    isPrivate: true,
    description: 'A private group for vintage Unimog restoration experts.',
    createdBy: 'user-3'
  },
  {
    id: '4',
    name: 'Unimog Technical Support',
    memberCount: 32,
    isPrivate: true,
    description: 'Get technical help from experienced Unimog mechanics.',
    createdBy: 'user-1'
  }
];

const GroupsList: React.FC = () => {
  const { trackFeatureUse } = useAnalytics();
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const handleGroupClick = (groupId: string) => {
    trackFeatureUse('view_group', { group_id: groupId });
    setSelectedGroup(groupId);
  };

  const handleCreateGroup = () => {
    trackFeatureUse('create_group', { action: 'open_dialog' });
    setIsCreateGroupOpen(true);
  };

  const currentGroup = mockGroups.find(group => group.id === selectedGroup);

  if (selectedGroup && currentGroup) {
    return (
      <GroupDetail 
        group={currentGroup} 
        onBack={() => setSelectedGroup(null)} 
      />
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Groups</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 gap-1"
            onClick={handleCreateGroup}
          >
            <Plus size={14} />
            <span>Create</span>
          </Button>
        </div>
        <CardDescription>
          Connect with like-minded enthusiasts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockGroups.map((group) => (
          <Button
            key={group.id}
            variant="ghost"
            className="w-full justify-start text-left h-auto py-2 px-3 min-w-0"
            onClick={() => handleGroupClick(group.id)}
          >
            <div className="flex items-start gap-2 w-full min-w-0">
              <Users size={18} className="mt-0.5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="font-medium text-sm truncate">{group.name}</p>
                  {group.isPrivate && (
                    <Lock size={12} className="text-muted-foreground flex-shrink-0" />
                  )}
                </div>
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
      
      <CreateGroupDialog 
        open={isCreateGroupOpen} 
        onOpenChange={setIsCreateGroupOpen}
      />
    </Card>
  );
};

export default GroupsList;
