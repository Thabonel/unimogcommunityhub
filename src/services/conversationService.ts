
import { supabase } from '@/lib/supabase-client';
import { Conversation } from '@/types/message';
import { getUserProfiles, mapProfileToUser } from './userProfileService';
import { toast } from '@/hooks/use-toast';
import { fetchConversationParticipants, fetchUserProfiles, mapConversationsToViewModel } from './conversationHelpers';
import { QueryClient } from '@tanstack/react-query';

// Function to create a new conversation with another user
export const createConversation = async (userId: string): Promise<string | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Call the create_conversation function in Supabase
    const { data: conversationId, error } = await supabase.rpc(
      'create_conversation',
      {
        user1_id: user.id,
        user2_id: userId
      }
    );

    if (error) {
      throw error;
    }

    return conversationId;
  } catch (error) {
    console.error('Error creating conversation:', error);
    toast({
      title: 'Error',
      description: 'Failed to create conversation',
      variant: 'destructive'
    });
    return null;
  }
};

// Optimistic conversation creation with instant UI updates
export const createConversationOptimistic = async (
  userId: string,
  queryClient: QueryClient,
  userProfile?: { name: string; avatar?: string; unimogModel?: string }
): Promise<{ conversationId: string | null; isOptimistic: boolean }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Generate temporary ID for optimistic update
    const optimisticId = `temp_${Date.now()}`;

    // Create optimistic conversation object
    const optimisticConversation: Conversation = {
      id: optimisticId,
      user: {
        id: userId,
        name: userProfile?.name || 'Loading...',
        avatar: userProfile?.avatar,
        unimogModel: userProfile?.unimogModel,
        online: false
      },
      lastMessage: null,
      unreadCount: 0,
      _isOptimistic: true
    };

    // Immediately update React Query cache
    queryClient.setQueryData<Conversation[]>(
      ['conversations'],
      (old = []) => [optimisticConversation, ...old]
    );

    // Create conversation in database
    const { data: conversationId, error } = await supabase.rpc(
      'create_conversation',
      {
        user1_id: user.id,
        user2_id: userId
      }
    );

    if (error) {
      throw error;
    }

    // Replace optimistic conversation with real data
    queryClient.setQueryData<Conversation[]>(
      ['conversations'],
      (old = []) => old.map(conv =>
        conv.id === optimisticId
          ? { ...conv, id: conversationId, _isOptimistic: false }
          : conv
      )
    );

    // Invalidate to fetch complete data
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }, 100);

    return { conversationId, isOptimistic: false };
  } catch (error) {
    console.error('Error creating conversation:', error);

    // Rollback optimistic update on error
    queryClient.setQueryData<Conversation[]>(
      ['conversations'],
      (old = []) => old.filter(conv => !conv._isOptimistic)
    );

    toast({
      title: 'Error',
      description: 'Failed to create conversation',
      variant: 'destructive'
    });

    return { conversationId: null, isOptimistic: true };
  }
};

// Function to get all conversations for the current user
export const getConversations = async (): Promise<Conversation[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // First, get conversations where the current user is a participant
    const { data: conversationsData, error: conversationsError } = await supabase
      .from('conversations')
      .select(`
        id,
        updated_at,
        conversation_participants!inner(user_id)
      `)
      .eq('conversation_participants.user_id', user.id)
      .order('updated_at', { ascending: false });

    if (conversationsError) {
      throw conversationsError;
    }

    if (!conversationsData || conversationsData.length === 0) {
      return [];
    }

    // Now get messages for each conversation separately
    const conversationsWithMessages = await Promise.all(
      conversationsData.map(async (conv) => {
        // Get messages for this conversation
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
          .order('created_at');

        if (messagesError) {
          console.error('Error fetching messages for conversation:', messagesError);
          return { ...conv, messages: [] };
        }

        // Filter messages to only include those from this conversation
        const otherParticipants = await fetchConversationParticipants([conv], user.id);
        
        if (otherParticipants.size === 0) {
          return { ...conv, messages: [] };
        }
        
        const otherUserId = Array.from(otherParticipants)[0];
        
        const conversationMessages = messagesData.filter(msg => {
          return (
            (msg.sender_id === user.id && msg.recipient_id === otherUserId) ||
            (msg.sender_id === otherUserId && msg.recipient_id === user.id)
          );
        });

        return { ...conv, messages: conversationMessages };
      })
    );

    // Extract participants and fetch their profiles
    const participantIds = await fetchConversationParticipants(conversationsData, user.id);
    
    // Fetch all user profiles at once
    const userProfileMap = await fetchUserProfiles(participantIds);

    // Map conversations to the required format
    return await mapConversationsToViewModel(conversationsWithMessages, user.id, userProfileMap);
    
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
};
