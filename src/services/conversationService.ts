
import { supabase } from '@/integrations/supabase/client';
import { Conversation } from '@/types/message';
import { getUserProfiles, mapProfileToUser } from './userProfileService';
import { toast } from '@/hooks/use-toast';

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

    // Extract all unique user IDs from the conversations
    const participantIds = new Set<string>();
    
    for (const conv of conversationsData) {
      // Get the other participants (not the current user)
      const { data: participants } = await supabase
        .from('conversation_participants')
        .select('user_id')
        .eq('conversation_id', conv.id)
        .neq('user_id', user.id);
        
      if (participants) {
        participants.forEach(p => participantIds.add(p.user_id));
      }
    }
    
    // Fetch all user profiles at once
    const userProfiles = await getUserProfiles(Array.from(participantIds));
    const userProfileMap = new Map(userProfiles.map(profile => [profile.id, profile]));

    // Map conversations to the required format
    const conversations: Conversation[] = await Promise.all(
      conversationsData.map(async (conv) => {
        // Find the other participant (not the current user)
        const { data: otherParticipant } = await supabase
          .from('conversation_participants')
          .select('user_id')
          .eq('conversation_id', conv.id)
          .neq('user_id', user.id)
          .single();

        if (!otherParticipant) {
          throw new Error('Could not find conversation participant');
        }

        const otherUserId = otherParticipant.user_id;
        const userProfile = userProfileMap.get(otherUserId);
        const otherUser = mapProfileToUser(userProfile || null);

        // Get the last message in the conversation
        let lastMessage = '';
        let timestamp = new Date(conv.updated_at);
        let unreadCount = 0;

        if (conv.messages && Array.isArray(conv.messages) && conv.messages.length > 0) {
          const sortedMessages = [...conv.messages].sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          
          if (sortedMessages[0]) {
            lastMessage = sortedMessages[0].content;
            timestamp = new Date(sortedMessages[0].created_at);
          }

          // Count unread messages (where recipient is current user and is_read is false)
          unreadCount = conv.messages.filter(
            msg => msg.recipient_id === user.id && !msg.is_read
          ).length;
        }

        return {
          id: conv.id,
          user: otherUser,
          lastMessage,
          timestamp,
          unread: unreadCount
        };
      })
    );

    // Sort conversations by the timestamp of the most recent message
    return conversations.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
};
