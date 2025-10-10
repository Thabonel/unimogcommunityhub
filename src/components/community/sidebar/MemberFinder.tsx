import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { useAnalytics } from '@/hooks/use-analytics';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { createConversationOptimistic } from '@/services/messageService';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

interface SuggestedUser {
  id: string;
  display_name?: string;
  full_name?: string;
  email: string;
  avatar_url?: string;
  unimog_model?: string;
}

const MemberFinder = () => {
  const { t } = useTranslation('community');
  const { trackFeatureUse } = useAnalytics();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [searchResults, setSearchResults] = useState<SuggestedUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [connectionRequests, setConnectionRequests] = useState<Set<string>>(new Set());
  const [creatingConversation, setCreatingConversation] = useState<Set<string>>(new Set());

  // Fetch suggested users on mount
  useEffect(() => {
    fetchSuggestedUsers();
  }, [user]);

  const fetchSuggestedUsers = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Get random users (excluding current user)
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, full_name, email, avatar_url, unimog_model')
        .neq('id', user.id)
        .limit(3);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setSuggestedUsers(data as SuggestedUser[]);
      }
    } catch (error) {
      console.error('Error fetching suggested users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    trackFeatureUse('search', { type: 'member_search', query });
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, full_name, email, avatar_url, unimog_model')
        .neq('id', user?.id || '')
        .or(`display_name.ilike.%${query}%,full_name.ilike.%${query}%,email.ilike.%${query}%`)
        .limit(5);
      
      if (error) throw error;
      
      setSearchResults(data as SuggestedUser[] || []);
    } catch (error) {
      console.error('Error searching users:', error);
      toast({
        title: t('errors.search_failed'),
        description: t('errors.search_failed'),
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleConnect = async (targetUser: SuggestedUser) => {
    if (!user) {
      toast({
        title: t('errors.auth_required'),
        description: t('errors.sign_in_to_connect'),
        variant: "destructive"
      });
      return;
    }

    const userName = targetUser.display_name || targetUser.full_name || targetUser.email.split('@')[0];
    trackFeatureUse('connection_request', { target_user_id: targetUser.id, target_user_name: userName });

    // Add to creating state
    setCreatingConversation(prev => new Set(prev).add(targetUser.id));

    try {
      // Create conversation with optimistic update
      const { conversationId } = await createConversationOptimistic(
        targetUser.id,
        queryClient,
        {
          name: userName,
          avatar: targetUser.avatar_url,
          unimogModel: targetUser.unimog_model
        }
      );

      if (conversationId) {
        // Navigate to messages page with the conversation ID
        navigate('/messages', { state: { conversationId } });
      } else {
        throw new Error('Failed to create conversation');
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: t('toast.error'),
        description: t('errors.failed_conversation'),
        variant: "destructive"
      });
    } finally {
      // Remove from creating state
      setCreatingConversation(prev => {
        const newSet = new Set(prev);
        newSet.delete(targetUser.id);
        return newSet;
      });
    }
  };

  const getUserDisplayName = (user: SuggestedUser) => {
    return user.display_name || user.full_name || user.email?.split('@')[0] || 'User';
  };

  const getUserInitials = (user: SuggestedUser) => {
    const name = getUserDisplayName(user);
    return name.substring(0, 2).toUpperCase();
  };

  const displayUsers = searchQuery.trim().length >= 2 ? searchResults : suggestedUsers;
  const isShowingSearchResults = searchQuery.trim().length >= 2;

  return (
    <Card className="mb-6" aria-label={t('sidebar.member_finder.title')}>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">{t('sidebar.member_finder.title')}</h3>
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('sidebar.member_finder.search_placeholder')}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {isSearching && (
            <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>

        <h4 className="text-sm font-medium mb-2">
          {isShowingSearchResults ? t('sidebar.member_finder.search_results') : t('sidebar.member_finder.suggested_connections')}
        </h4>
        
        {isLoading && !isShowingSearchResults ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : displayUsers.length > 0 ? (
          <div className="space-y-3">
            {displayUsers.map((member) => (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Avatar className="h-8 w-8">
                    {member.avatar_url ? (
                      <AvatarImage src={member.avatar_url} alt={getUserDisplayName(member)} />
                    ) : null}
                    <AvatarFallback>{getUserInitials(member)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{getUserDisplayName(member)}</p>
                    {member.unimog_model && (
                      <p className="text-xs text-muted-foreground truncate">{member.unimog_model}</p>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={creatingConversation.has(member.id)}
                  onClick={() => handleConnect(member)}
                >
                  {creatingConversation.has(member.id) ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      {t('sidebar.member_finder.starting')}
                    </>
                  ) : (
                    t('sidebar.member_finder.message')
                  )}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            {isShowingSearchResults ? t('sidebar.member_finder.no_members_found') : t('sidebar.member_finder.no_suggestions')}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default MemberFinder;