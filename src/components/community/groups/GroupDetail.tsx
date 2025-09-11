
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users, Shield, Lock, LockOpen } from 'lucide-react';
import { useAnalytics } from '@/hooks/use-analytics';
import { useAuth } from '@/contexts/AuthContext';
import GroupMembership from './GroupMembership';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase-client';

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
  const [memberCount, setMemberCount] = useState(group.memberCount);
  
  // Fetch real member count from database
  useEffect(() => {
    const fetchMemberCount = async () => {
      try {
        const { count, error } = await supabase
          .from('group_members')
          .select('*', { count: 'exact', head: true })
          .eq('group_id', group.id);

        if (error) {
          console.error('Error fetching member count:', error);
          return;
        }

        setMemberCount(count || 0);
      } catch (error) {
        console.error('Error fetching member count:', error);
      }
    };

    fetchMemberCount();
  }, [group.id]);
  
  const isAdmin = user?.id === group.createdBy;
  const isMember = true; // For now, assume user is a member if they can see the group
  
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
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-lg">Group Details</CardTitle>
            <div className="flex flex-col items-end gap-1 text-sm text-muted-foreground min-w-0 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span>{memberCount} members</span>
              </div>
              <div className="flex items-center gap-2">
                {group.isPrivate ? <Lock size={16} /> : <LockOpen size={16} />}
                <span className="whitespace-nowrap">{group.isPrivate ? 'Private' : 'Public'}</span>
              </div>
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
