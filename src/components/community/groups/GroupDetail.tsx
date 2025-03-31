
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users, Shield, Lock, LockOpen } from 'lucide-react';
import { useAnalytics } from '@/hooks/use-analytics';
import { useAuth } from '@/contexts/AuthContext';
import GroupMembership from './GroupMembership';
import { toast } from '@/hooks/use-toast';

interface GroupDetailProps {
  onBack: () => void;
  group: {
    id: string;
    name: string;
    description?: string;
    memberCount: number;
    isPrivate: boolean;
    createdBy: string;
  };
}

const GroupDetail: React.FC<GroupDetailProps> = ({ onBack, group }) => {
  const { trackFeatureUse } = useAnalytics();
  const { user } = useAuth();
  const [isRequesting, setIsRequesting] = useState(false);
  
  // In a real app, these would come from the backend
  const isAdmin = user?.id === group.createdBy;
  const isMember = true;
  
  const handleJoinRequest = () => {
    trackFeatureUse('request_join_group', { group_id: group.id });
    setIsRequesting(true);
    
    // In a real app, this would call an API to request to join the group
    setTimeout(() => {
      toast({
        title: "Request sent",
        description: "Your request to join the group has been sent to the admin",
      });
      setIsRequesting(false);
    }, 1000);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft size={16} />
        </Button>
        <h2 className="text-xl font-bold">{group.name}</h2>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Group Details</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users size={16} />
              <span>{group.memberCount} members</span>
              {group.isPrivate ? <Lock size={16} /> : <LockOpen size={16} />}
              <span>{group.isPrivate ? 'Private' : 'Public'}</span>
            </div>
          </div>
          {isAdmin && (
            <div className="flex items-center gap-1 text-sm text-primary">
              <Shield size={14} />
              <span>You are the admin</span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {group.description && (
            <p className="text-sm text-muted-foreground mb-4">{group.description}</p>
          )}
          
          {!isMember && group.isPrivate && (
            <Button
              className="w-full mt-2"
              disabled={isRequesting}
              onClick={handleJoinRequest}
            >
              {isRequesting ? "Sending Request..." : "Request to Join"}
            </Button>
          )}
          
          {!isMember && !group.isPrivate && (
            <Button
              className="w-full mt-2"
              disabled={isRequesting}
              onClick={handleJoinRequest}
            >
              {isRequesting ? "Joining..." : "Join Group"}
            </Button>
          )}
        </CardContent>
      </Card>
      
      {isMember && (
        <GroupMembership groupId={group.id} isAdmin={isAdmin} />
      )}
    </div>
  );
};

export default GroupDetail;
