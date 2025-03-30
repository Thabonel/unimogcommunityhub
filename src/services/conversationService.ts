
import { supabase } from '@/integrations/supabase/client';
import { Conversation } from '@/types/message';
import { getUserProfiles, mapProfileToUser } from './userProfileService';
import { toast } from '@/hooks/use-toast';
import { fetchConversationParticipants, fetchUserProfiles, mapConversationsToViewModel } from './conversationHelpers';

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

// Function to get all conversations for the current user
export const getConversations = async (): Promise<Conversation[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get conversations where the current user is a participant
    const { data: conversationsData, error: conversationsError } = await supabase
      .from('conversations')
      .select(`
        id,
        updated_at,
        conversation_participants!inner(user_id),
        messages(
          id,
          sender_id,
          recipient_id,
          content,
          created_at,
          is_read
        )
      `)
      .eq('conversation_participants.user_id', user.id)
      .order('updated_at', { ascending: false });

    if (conversationsError) {
      throw conversationsError;
    }

    if (!conversationsData || conversationsData.length === 0) {
      return [];
    }

    // Extract participants and fetch their profiles
    const participantIds = await fetchConversationParticipants(conversationsData, user.id);
    
    // Fetch all user profiles at once
    const userProfileMap = await fetchUserProfiles(participantIds);

    // Map conversations to the required format
    return await mapConversationsToViewModel(conversationsData, user.id, userProfileMap);
    
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
};
