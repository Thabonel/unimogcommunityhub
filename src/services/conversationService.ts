
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
  console.log('🚀 createConversationOptimistic START', { userId, userProfile });

  try {
    const { data: { user } } = await supabase.auth.getUser();
    console.log('🔐 Auth user:', user?.id);

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Generate temporary ID for optimistic update
    const optimisticId = `temp_${Date.now()}`;
    console.log('⏱️ Generated optimistic ID:', optimisticId);

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
    console.log('💾 Updating React Query cache with optimistic conversation');
    queryClient.setQueryData<Conversation[]>(
      ['conversations'],
      (old = []) => {
        console.log('📋 Current conversations count:', old.length);
        return [optimisticConversation, ...old];
      }
    );

    // Create conversation in database
    console.log('📞 Calling create_conversation RPC with:', { user1_id: user.id, user2_id: userId });
    const { data: conversationId, error } = await supabase.rpc(
      'create_conversation',
      {
        user1_id: user.id,
        user2_id: userId
      }
    );

    console.log('📞 RPC Response:', { conversationId, error });

    if (error) {
      console.error('❌ RPC Error:', error);
      throw error;
    }

    console.log('✅ Conversation created with ID:', conversationId);

    // Replace optimistic conversation with real data
    console.log('🔄 Replacing optimistic ID with real ID in cache');
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
      console.log('🔃 Invalidating queries to fetch complete data');
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }, 100);

    console.log('✨ createConversationOptimistic SUCCESS');
    return { conversationId, isOptimistic: false };
  } catch (error) {
    console.error('💥 createConversationOptimistic ERROR:', error);

    // Rollback optimistic update on error
    console.log('⏪ Rolling back optimistic update');
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

// Function to get all conversations for the current user (optimized)
export const getConversations = async (): Promise<Conversation[]> => {
  const perfStart = performance.now();
  console.log('🚀 [PERF] getConversations START');

  try {
    const t0 = performance.now();
    const { data: { user } } = await supabase.auth.getUser();
    console.log(`⏱️ [PERF] getUser: ${(performance.now() - t0).toFixed(2)}ms`);

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Optimized: Single query to get all participant data with conversation IDs
    const t1 = performance.now();
    const { data: participantData, error: participantError } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', user.id);
    console.log(`⏱️ [PERF] fetch participants: ${(performance.now() - t1).toFixed(2)}ms`);

    if (participantError) {
      console.error('Error fetching participants:', participantError);
      throw participantError;
    }

    if (!participantData || participantData.length === 0) {
      console.log(`✅ [PERF] TOTAL (no conversations): ${(performance.now() - perfStart).toFixed(2)}ms`);
      return [];
    }

    const conversationIds = participantData.map(p => p.conversation_id);

    // Optimized: Get conversations with basic data in single query
    const t2 = performance.now();
    const { data: conversationsData, error: conversationsError } = await supabase
      .from('conversations')
      .select('id, updated_at')
      .in('id', conversationIds)
      .order('updated_at', { ascending: false });
    console.log(`⏱️ [PERF] fetch conversations: ${(performance.now() - t2).toFixed(2)}ms`);

    if (conversationsError) {
      console.error('Error fetching conversations:', conversationsError);
      throw conversationsError;
    }

    if (!conversationsData || conversationsData.length === 0) {
      console.log(`✅ [PERF] TOTAL (no data): ${(performance.now() - perfStart).toFixed(2)}ms`);
      return [];
    }

    // Optimized: Fetch ALL messages and participants in parallel (not in a loop)
    const t3 = performance.now();
    const [allMessagesResult, allParticipantsResult] = await Promise.all([
      // Get all messages for current user in one query
      supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at'),

      // Get all participants for all conversations in one query
      supabase
        .from('conversation_participants')
        .select('conversation_id, user_id')
        .in('conversation_id', conversationIds)
        .neq('user_id', user.id)
    ]);
    console.log(`⏱️ [PERF] fetch messages+participants (parallel): ${(performance.now() - t3).toFixed(2)}ms`);

    const allMessages = allMessagesResult.data || [];
    const allParticipants = allParticipantsResult.data || [];

    // Build participant map (conversation_id -> other_user_id)
    const participantMap = new Map<string, string>();
    allParticipants.forEach(p => {
      participantMap.set(p.conversation_id, p.user_id);
    });

    // Group messages by conversation
    const conversationsWithMessages = conversationsData.map(conv => {
      const otherUserId = participantMap.get(conv.id);

      if (!otherUserId) {
        return { ...conv, messages: [] };
      }

      // Filter messages for this specific conversation (user <-> otherUser)
      const conversationMessages = allMessages.filter(msg =>
        (msg.sender_id === user.id && msg.recipient_id === otherUserId) ||
        (msg.sender_id === otherUserId && msg.recipient_id === user.id)
      );

      return { ...conv, messages: conversationMessages };
    });

    // Get unique participant IDs and fetch their profiles in one query
    const t4 = performance.now();
    const participantIds = new Set(Array.from(participantMap.values()));
    const userProfileMap = await fetchUserProfiles(participantIds);
    console.log(`⏱️ [PERF] fetch user profiles: ${(performance.now() - t4).toFixed(2)}ms`);

    // Map conversations to the required format
    const t5 = performance.now();
    const result = await mapConversationsToViewModel(conversationsWithMessages, user.id, userProfileMap);
    console.log(`⏱️ [PERF] map to view model: ${(performance.now() - t5).toFixed(2)}ms`);

    console.log(`✅ [PERF] TOTAL getConversations: ${(performance.now() - perfStart).toFixed(2)}ms`);
    return result;

  } catch (error) {
    console.error('Error fetching conversations:', error);
    console.log(`❌ [PERF] TOTAL (error): ${(performance.now() - perfStart).toFixed(2)}ms`);
    return [];
  }
};
