
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, UserCheck, UserX, Shield } from 'lucide-react';
import { useAnalytics } from '@/hooks/use-analytics';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase-client';

interface Member {
  id: string;
  user_id: string;
  name: string;
  display_name?: string;
  email?: string;
  isAdmin: boolean;
  isPending: boolean;
  joined_at: string;
}

interface GroupMembershipProps {
  groupId: string;
  isAdmin: boolean;
}

const GroupMembership: React.FC<GroupMembershipProps> = ({ groupId, isAdmin }) => {
  const { trackFeatureUse } = useAnalytics();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real group members from database
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('group_members')
          .select(`
            id,
            user_id,
            role,
            joined_at,
            profiles!inner (
              display_name,
              full_name,
              email
            )
          `)
          .eq('group_id', groupId);

        if (error) {
          console.error('Error fetching members:', error);
          return;
        }

        const formattedMembers: Member[] = (data || []).map(member => ({
          id: member.id,
          user_id: member.user_id,
          name: member.profiles?.display_name || member.profiles?.full_name || 'Unknown User',
          display_name: member.profiles?.display_name,
          email: member.profiles?.email,
          isAdmin: member.role === 'admin',
          isPending: false, // For now, all fetched members are approved
          joined_at: member.joined_at
        }));

        setMembers(formattedMembers);
      } catch (error) {
        console.error('Error fetching group members:', error);
      } finally {
        setLoading(false);
      }
    };

    if (groupId) {
      fetchMembers();
    }
  }, [groupId]);
  
  const handleApprove = (memberId: string) => {
    trackFeatureUse('approve_member', { group_id: groupId, member_id: memberId });
    
    // In a real app, this would call an API to approve the member
    setMembers(members.map(member => 
      member.id === memberId ? { ...member, isPending: false } : member
    ));
    
    toast({
      title: "Member approved",
      description: "The member has been approved to join the group",
    });
  };
  
  const handleReject = (memberId: string) => {
    trackFeatureUse('reject_member', { group_id: groupId, member_id: memberId });
    
    // In a real app, this would call an API to reject the member
    setMembers(members.filter(member => member.id !== memberId));
    
    toast({
      title: "Member rejected",
      description: "The member has been rejected from joining the group",
    });
  };
  
  const handleInvite = () => {
    trackFeatureUse('invite_member', { group_id: groupId });
    
    // In a real app, this would show a dialog to invite members
    toast({
      title: "Invite members",
      description: "This feature would show a dialog to invite members",
    });
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Group Members</CardTitle>
        <CardDescription>
          {isAdmin ? "Manage your group members and invitations" : "Members of this group"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {isAdmin && (
          <div className="mb-4">
            <Button 
              variant="outline" 
              className="w-full flex gap-2 items-center justify-center"
              onClick={handleInvite}
            >
              <UserPlus size={16} />
              <span>Invite Members</span>
            </Button>
          </div>
        )}

        {loading && (
          <div className="text-center py-4 text-sm text-muted-foreground">
            Loading members...
          </div>
        )}

        {!loading && members.length === 0 && (
          <div className="text-center py-4 text-sm text-muted-foreground">
            No members found
          </div>
        )}
        
        {isAdmin && members.some(m => m.isPending) && (
          <div className="mb-3 mt-4">
            <h3 className="text-sm font-medium mb-2">Pending Approval</h3>
            <div className="space-y-2">
              {members.filter(m => m.isPending).map(member => (
                <div key={member.id} className="flex items-center justify-between p-2 rounded-md border bg-muted/50">
                  <span className="text-sm">{member.name}</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleApprove(member.id)}>
                      <UserCheck size={16} className="text-green-500" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleReject(member.id)}>
                      <UserX size={16} className="text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {!loading && members.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Members</h3>
            <div className="space-y-2">
              {members.filter(m => !m.isPending).map(member => (
                <div key={member.id} className="flex items-center justify-between p-2 rounded-md border">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{member.name}</span>
                    {member.isAdmin && (
                      <Shield size={14} className="text-primary" />
                    )}
                  </div>
                  {isAdmin && !member.isAdmin && (
                    <Button variant="ghost" size="sm" onClick={() => handleReject(member.id)}>
                      <UserX size={16} className="text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GroupMembership;
