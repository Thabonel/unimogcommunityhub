
import { supabase } from '@/integrations/supabase/client';
import { DBMessage, DBConversation, Message, Conversation, User } from '@/types/message';
import { toast } from '@/hooks/use-toast';

// Get user profile by ID
export const getUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .eq('id', userId)
      .single();

    if (error) throw error;

    if (!data) return null;

    return {
      id: data.id,
      name: data.full_name || 'Unknown User',
      avatar: data.avatar_url,
      online: false // We'll implement online presence separately
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

// Get conversations for the current user
export const getConversations = async (): Promise<Conversation[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get conversations where the user is a participant
    const { data: conversationsData, error } = await supabase
      .from('conversation_participants')
      .select(`
        conversation:conversation_id (
          id,
          updated_at,
          participants:conversation_participants (user_id)
        )
      `)
      .eq('user_id', user.id);

    if (error) throw error;

    if (!conversationsData || conversationsData.length === 0) {
      return [];
    }

    // Transform and fetch additional data for each conversation
    const conversationsPromises = conversationsData.map(async (item) => {
      const conversation = item.conversation as unknown as DBConversation;
      
      // Find the other participant (not the current user)
      const otherParticipant = conversation.participants.find(
        (p) => p.user_id !== user.id
      );

      if (!otherParticipant) {
        return null; // Skip if no other participant found
      }

      // Get the user profile of the other participant
      const otherUser = await getUserProfile(otherParticipant.user_id);
      
      if (!otherUser) {
        return null; // Skip if user profile not found
      }

      // Get the last message in the conversation
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .or(`sender_id.eq.${otherParticipant.user_id},recipient_id.eq.${otherParticipant.user_id}`)
        .order('created_at', { ascending: false })
        .limit(1);

      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        return null;
      }

      // Count unread messages
      const { count: unreadCount, error: countError } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_id', user.id)
        .eq('sender_id', otherParticipant.user_id)
        .eq('is_read', false);

      if (countError) {
        console.error('Error counting unread messages:', countError);
        return null;
      }

      const lastMessage = messages && messages.length > 0 ? messages[0].content : 'No messages yet';
      
      return {
        id: conversation.id,
        user: otherUser,
        lastMessage,
        timestamp: messages && messages.length > 0 
          ? new Date(messages[0].created_at) 
          : new Date(conversation.updated_at),
        unread: unreadCount || 0
      } as Conversation;
    });

    // Wait for all promises to resolve and filter out nulls
    const conversations = (await Promise.all(conversationsPromises)).filter(
      (c) => c !== null
    ) as Conversation[];

    // Sort conversations by timestamp (newest first)
    return conversations.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
  } catch (error) {
    console.error('Error fetching conversations:', error);
    toast({
      title: 'Error',
      description: 'Failed to load conversations',
      variant: 'destructive',
    });
    return [];
  }
};

// Get messages for a specific conversation
export const getMessages = async (conversationId: string): Promise<Message[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get all messages for this conversation
    const { data: messagesData, error } = await supabase
      .from('messages')
      .select(`
        id,
        sender_id,
        recipient_id,
        content,
        created_at,
        is_read
      `)
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order('created_at', { ascending: true });

    if (error) throw error;

    if (!messagesData) {
      return [];
    }

    // Mark all received messages as read
    const unreadMessages = messagesData
      .filter(msg => msg.recipient_id === user.id && !msg.is_read)
      .map(msg => msg.id);
    
    if (unreadMessages.length > 0) {
      await supabase.rpc('mark_conversation_as_read', {
        conversation_id: conversationId
      });
    }

    // Convert to our Message interface format
    return messagesData.map(msg => ({
      id: msg.id,
      sender: msg.sender_id,
      content: msg.content,
      timestamp: new Date(msg.created_at),
      isCurrentUser: msg.sender_id === user.id
    }));
  } catch (error) {
    console.error('Error fetching messages:', error);
    toast({
      title: 'Error',
      description: 'Failed to load messages',
      variant: 'destructive',
    });
    return [];
  }
};

// Send a message in a conversation
export const sendMessage = async (
  recipientId: string,
  content: string
): Promise<Message | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Create or get conversation between the two users
    const { data: conversationId, error: convError } = await supabase.rpc(
      'create_conversation',
      {
        user1_id: user.id,
        user2_id: recipientId
      }
    );

    if (convError) throw convError;

    // Insert the message
    const { data: messageData, error: msgError } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        recipient_id: recipientId,
        content
      })
      .select('*')
      .single();

    if (msgError) throw msgError;

    // Update the conversation's timestamp
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    return {
      id: messageData.id,
      sender: messageData.sender_id,
      content: messageData.content,
      timestamp: new Date(messageData.created_at),
      isCurrentUser: true
    };
  } catch (error) {
    console.error('Error sending message:', error);
    toast({
      title: 'Error',
      description: 'Failed to send message',
      variant: 'destructive',
    });
    return null;
  }
};

// Create a new conversation with another user
export const createConversation = async (userId: string): Promise<string | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Create conversation between the two users
    const { data: conversationId, error } = await supabase.rpc(
      'create_conversation',
      {
        user1_id: user.id,
        user2_id: userId
      }
    );

    if (error) throw error;

    return conversationId;
  } catch (error) {
    console.error('Error creating conversation:', error);
    toast({
      title: 'Error',
      description: 'Failed to create conversation',
      variant: 'destructive',
    });
    return null;
  }
};

// Get a list of users for starting new conversations
export const getUsers = async (): Promise<User[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get all user profiles except the current user
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .neq('id', user.id);

    if (error) throw error;

    if (!profiles) {
      return [];
    }

    return profiles.map(profile => ({
      id: profile.id,
      name: profile.full_name || 'Unknown User',
      avatar: profile.avatar_url,
      online: false // We'll implement online presence separately
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    toast({
      title: 'Error',
      description: 'Failed to load users',
      variant: 'destructive',
    });
    return [];
  }
};
