
import { supabase } from '@/lib/supabase-client';
import { Message } from '@/types/message';
import { toast } from '@/hooks/use-toast';

// Function to get all messages for a conversation
export const getMessages = async (conversationId: string): Promise<Message[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get all messages for the conversation
    const { data: messagesData, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order('created_at');

    if (messagesError) {
      throw messagesError;
    }

    if (!messagesData) {
      return [];
    }

    // Filter messages to only include those from the selected conversation
    // This is a workaround since we don't have a direct way to query by conversation
    const conversationMessages = messagesData.filter(msg => {
      const isBetweenParticipants = (
        (msg.sender_id === user.id && msg.recipient_id === conversationId) ||
        (msg.sender_id === conversationId && msg.recipient_id === user.id)
      );
      return isBetweenParticipants;
    });

    // Mark unread messages as read
    const unreadMessages = conversationMessages.filter(
      msg => msg.recipient_id === user.id && !msg.is_read
    );

    if (unreadMessages.length > 0) {
      await Promise.all(unreadMessages.map(msg =>
        supabase
          .from('messages')
          .update({ is_read: true })
          .eq('id', msg.id)
      ));
    }

    // Map messages to the required format
    const messages: Message[] = conversationMessages.map((msg) => ({
      id: msg.id,
      sender: msg.sender_id,
      content: msg.content,
      timestamp: new Date(msg.created_at),
      isCurrentUser: msg.sender_id === user.id
    }));

    return messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

// Function to send a message
export const sendMessage = async (recipientId: string, content: string): Promise<Message | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Create or get conversation between users
    const { data: conversationId } = await supabase.rpc(
      'create_conversation',
      { 
        user1_id: user.id,
        user2_id: recipientId
      }
    );

    if (!conversationId) {
      throw new Error('Failed to create or find conversation');
    }

    // Insert the new message
    const { data: messageData, error: messageError } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        recipient_id: recipientId,
        content
      })
      .select()
      .single();

    if (messageError) {
      throw messageError;
    }

    // Update the conversation's updated_at timestamp
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    // Return the new message in the required format
    return {
      id: messageData.id,
      sender: user.id,
      content: messageData.content,
      timestamp: new Date(messageData.created_at),
      isCurrentUser: true
    };
  } catch (error) {
    console.error('Error sending message:', error);
    toast({
      title: 'Message not sent',
      description: error instanceof Error ? error.message : 'An unknown error occurred',
      variant: 'destructive'
    });
    return null;
  }
};
