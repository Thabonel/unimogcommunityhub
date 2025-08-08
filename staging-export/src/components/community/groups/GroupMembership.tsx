
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, UserCheck, UserX, Shield } from 'lucide-react';
import { useAnalytics } from '@/hooks/use-analytics';
import { toast } from '@/hooks/use-toast';

interface Member {
  id: string;
  name: string;
  isAdmin: boolean;
  isPending: boolean;
}

// Mock data for group members - in a real app, this would come from your backend
const mockMembers: Member[] = [
  { id: '1', name: 'John Doe', isAdmin: true, isPending: false },
  { id: '2', name: 'Jane Smith', isAdmin: false, isPending: false },
  { id: '3', name: 'Alex Johnson', isAdmin: false, isPending: true },
  { id: '4', name: 'Sarah Williams', isAdmin: false, isPending: true },
];

interface GroupMembershipProps {
  groupId: string;
  isAdmin: boolean;
}

const GroupMembership: React.FC<GroupMembershipProps> = ({ groupId, isAdmin }) => {
  const { trackFeatureUse } = useAnalytics();
  const [members, setMembers] = useState<Member[]>(mockMembers);
  
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
      </CardContent>
    </Card>
  );
};

export default GroupMembership;
