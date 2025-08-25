
import { supabase } from '@/lib/supabase-client';
import { Conversation, DBConversation } from '@/types/message';
import { UserProfile } from '@/types/user';
import { getUserProfiles, mapProfileToUser } from './userProfileService';

// Helper function to fetch conversation participants
export const fetchConversationParticipants = async (
  conversationsData: any[],
  currentUserId: string
): Promise<Set<string>> => {
  const participantIds = new Set<string>();
  
  for (const conv of conversationsData) {
    // Get the other participants (not the current user)
    const { data: participants } = await supabase
      .from('conversation_participants')
      .select('user_id')
      .eq('conversation_id', conv.id)
      .neq('user_id', currentUserId);
      
    if (participants) {
      participants.forEach(p => participantIds.add(p.user_id));
    }
  }
  
  return participantIds;
};

// Helper function to fetch and map user profiles
export const fetchUserProfiles = async (
  participantIds: Set<string>
): Promise<Map<string, UserProfile>> => {
  const userProfiles = await getUserProfiles(Array.from(participantIds));
  return new Map(userProfiles.map(profile => [profile.id, profile]));
};

// Helper function to find the other participant in a conversation
export const findOtherParticipant = async (
  conversationId: string, 
  currentUserId: string
): Promise<string | null> => {
  const { data: otherParticipant } = await supabase
    .from('conversation_participants')
    .select('user_id')
    .eq('conversation_id', conversationId)
    .neq('user_id', currentUserId)
    .single();

  return otherParticipant ? otherParticipant.user_id : null;
};

// Helper function to count unread messages
export const countUnreadMessages = (
  messages: any[], 
  currentUserId: string
): number => {
  return messages.filter(
    msg => msg.recipient_id === currentUserId && !msg.is_read
  ).length;
};

// Helper function to get the last message details
export const getLastMessageDetails = (messages: any[]): { content: string, timestamp: Date } => {
  let lastMessage = '';
  let timestamp = new Date();

  if (messages && Array.isArray(messages) && messages.length > 0) {
    const sortedMessages = [...messages].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    if (sortedMessages[0]) {
      lastMessage = sortedMessages[0].content;
      timestamp = new Date(sortedMessages[0].created_at);
    }
  }

  return { content: lastMessage, timestamp };
};

// Helper function to map conversations to view model
export const mapConversationsToViewModel = async (
  conversationsData: any[],
  currentUserId: string,
  userProfileMap: Map<string, UserProfile>
): Promise<Conversation[]> => {
  const conversations: Conversation[] = await Promise.all(
    conversationsData.map(async (conv) => {
      // Find the other participant (not the current user)
      const otherUserId = await findOtherParticipant(conv.id, currentUserId);
      
      if (!otherUserId) {
        throw new Error('Could not find conversation participant');
      }

      const userProfile = userProfileMap.get(otherUserId);
      const otherUser = mapProfileToUser(userProfile || null);

      // Get the last message and timestamp
      const { content: lastMessage, timestamp } = getLastMessageDetails(conv.messages || []);
      
      // Count unread messages
      const unreadCount = countUnreadMessages(conv.messages || [], currentUserId);

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
};
