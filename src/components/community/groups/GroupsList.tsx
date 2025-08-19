import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Plus, Lock, Loader2 } from 'lucide-react';
import { useAnalytics } from '@/hooks/use-analytics';
import { CreateGroupDialog } from './CreateGroupDialog';
import GroupDetail from './GroupDetail';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Group {
  id: string;
  name: string;
  description: string | null;
  is_private: boolean;
  created_by: string;
  created_at: string;
  member_count?: number;
  metadata?: any;
}

const GroupsList: React.FC = () => {
  const { trackFeatureUse } = useAnalytics();
  const { user } = useAuth();
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchGroups();
    
    // Subscribe to real-time updates for groups
    const channel = supabase
      .channel('community_groups')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'community_groups' },
        () => {
          fetchGroups(); // Refresh groups when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      // First try to fetch groups with member count (if table exists)
      let groupsData: any[] | null = null;
      let groupsError: any = null;
      
      // Try with join first (in case tables exist)
      const { data: dataWithJoin, error: errorWithJoin } = await supabase
        .from('community_groups')
        .select(`
          *,
          community_group_members!community_group_members_group_id_fkey(count)
        `)
        .order('created_at', { ascending: false })
        .limit(showAll ? 100 : 4);
      
      if (errorWithJoin?.message?.includes('relation') || errorWithJoin?.message?.includes('does not exist')) {
        // Fallback: fetch without join if members table doesn't exist
        const { data: dataSimple, error: errorSimple } = await supabase
          .from('community_groups')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(showAll ? 100 : 4);
        
        groupsData = dataSimple;
        groupsError = errorSimple;
      } else {
        groupsData = dataWithJoin;
        groupsError = errorWithJoin;
      }

      if (groupsError) throw groupsError;

      // Process the data to include member count
      const processedGroups = (groupsData || []).map((group: any) => ({
        id: group.id,
        name: group.name,
        description: group.description,
        is_private: group.is_private || false,
        created_by: group.created_by,
        created_at: group.created_at,
        member_count: group.community_group_members?.[0]?.count || 0,
        metadata: group.metadata
      }));

      setGroups(processedGroups);
    } catch (error: any) {
      console.error('Error fetching groups:', error);
      // Only show error toast for real errors, not missing tables
      if (user && !error?.message?.includes('does not exist')) {
        toast({
          title: "Failed to load groups",
          description: "Unable to fetch community groups",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGroupClick = (groupId: string) => {
    trackFeatureUse('view_group', { group_id: groupId });
    setSelectedGroup(groupId);
  };

  const handleCreateGroup = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a group",
        variant: "destructive"
      });
      return;
    }
    trackFeatureUse('create_group', { action: 'open_dialog' });
    setIsCreateGroupOpen(true);
  };

  const handleViewAllGroups = () => {
    trackFeatureUse('view_all_groups', { current_count: groups.length });
    setShowAll(true);
    fetchGroups(); // Re-fetch with no limit
  };

  const currentGroup = groups.find(group => group.id === selectedGroup);

  if (selectedGroup && currentGroup) {
    return (
      <GroupDetail 
        group={{
          ...currentGroup,
          memberCount: currentGroup.member_count || 0,
          isPrivate: currentGroup.is_private,
          createdBy: currentGroup.created_by
        }} 
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
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : groups.length > 0 ? (
          <>
            {groups.map((group) => (
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
                      <p className="font-medium text-xs truncate">{group.name}</p>
                      {group.is_private && (
                        <Lock size={10} className="text-muted-foreground flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {group.member_count || 0} members
                      {group.is_private && " • Private"}
                    </p>
                  </div>
                </div>
              </Button>
            ))}
            
            {!showAll && groups.length >= 4 && (
              <div className="pt-2">
                <Button 
                  variant="link" 
                  className="w-full text-xs" 
                  size="sm"
                  onClick={handleViewAllGroups}
                >
                  View all groups
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-2">No groups yet</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateGroup}
              className="text-xs"
            >
              <Plus size={12} className="mr-1" />
              Create the first group
            </Button>
          </div>
        )}
      </CardContent>
      
      <CreateGroupDialog 
        open={isCreateGroupOpen} 
        onOpenChange={(open) => {
          setIsCreateGroupOpen(open);
          if (!open) {
            // Refresh groups when dialog closes
            fetchGroups();
          }
        }}
      />
    </Card>
  );
};

export default GroupsList;