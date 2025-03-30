
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ConversationSidebar from '@/components/messages/ConversationSidebar';
import MessageHeader from '@/components/messages/MessageHeader';
import MessageThread from '@/components/messages/MessageThread';
import MessageInput from '@/components/messages/MessageInput';
import { Conversation, Message } from '@/types/message';
import { getConversations, getMessages, sendMessage } from '@/services/messageService';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPresence } from '@/hooks/use-user-presence';

const Messages = () => {
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const { user, session } = useAuth();

  // Use the presence hook to track user's online status
  useUserPresence();
  
  // Fetch conversations using React Query
  const { 
    data: conversations = [],
    isLoading: conversationsLoading,
    error: conversationsError,
    refetch: refetchConversations
  } = useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
    enabled: !!session
  });

  // Set the first conversation as active when conversations are loaded
  useEffect(() => {
    if (conversations.length > 0 && !activeConversation) {
      setActiveConversation(conversations[0]);
    }
  }, [conversations, activeConversation]);

  // Fetch messages for the active conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (activeConversation) {
        const fetchedMessages = await getMessages(activeConversation.user.id);
        setMessages(fetchedMessages);
      }
    };

    fetchMessages();
  }, [activeConversation]);

  // Handle sending a new message
  const handleSendMessage = async (messageText: string) => {
    if (!activeConversation) return;
    
    // Optimistically update the UI
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      sender: 'current-user',
      content: messageText,
      timestamp: new Date(),
      isCurrentUser: true
    };
    setMessages([...messages, tempMessage]);

    // Send the message to the server
    const sentMessage = await sendMessage(activeConversation.user.id, messageText);
    
    if (sentMessage) {
      // Update the messages with the actual sent message
      setMessages(messages => 
        messages
          .filter(m => m.id !== tempMessage.id) // Remove the temp message
          .concat(sentMessage) // Add the real message
      );
      
      // Update the conversation list
      refetchConversations();
    } else {
      // Remove the temp message if sending failed
      setMessages(messages => 
        messages.filter(m => m.id !== tempMessage.id)
      );
      toast({
        title: "Message not sent",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
  };

  // Show error if conversations failed to load
  if (conversationsError) {
    return (
      <Layout isLoggedIn={true} user={user ? {
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        avatarUrl: user.user_metadata?.avatar_url,
        unimogModel: user.user_metadata?.unimog_model
      } : undefined}>
        <div className="container py-6">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-500 mb-2">Error Loading Conversations</h2>
              <p className="text-muted-foreground mb-4">
                There was a problem loading your conversations. Please try again later.
              </p>
              <button 
                onClick={() => refetchConversations()} 
                className="bg-primary text-primary-foreground px-4 py-2 rounded"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isLoggedIn={!!user} user={user ? {
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      avatarUrl: user.user_metadata?.avatar_url,
      unimogModel: user.user_metadata?.unimog_model
    } : undefined}>
      <div className="container py-6">
        <h1 className="text-3xl font-bold text-unimog-800 dark:text-unimog-200 mb-6">
          Messages
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          {conversationsLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <ConversationSidebar 
              conversations={conversations}
              activeConversation={activeConversation}
              onSelectConversation={handleSelectConversation}
            />
          )}
          
          {/* Messages Area */}
          <div className="lg:col-span-2 border rounded-lg shadow-sm overflow-hidden flex flex-col">
            {activeConversation ? (
              <>
                <MessageHeader conversation={activeConversation} />
                <MessageThread messages={messages} />
                <MessageInput onSendMessage={handleSendMessage} />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">No Conversation Selected</h3>
                  <p className="text-muted-foreground">
                    Select a conversation from the sidebar or start a new one.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
