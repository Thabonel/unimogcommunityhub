
import { useState, useEffect, useCallback } from 'react';
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
import { useProfile } from '@/hooks/profile';
import { supabase } from '@/lib/supabase-client';
import { useLocation } from 'react-router-dom';

const Messages = () => {
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUserLastSeen, setOtherUserLastSeen] = useState<Date | null>(null);
  const { user, session } = useAuth();
  const { userData } = useProfile();
  const location = useLocation();

  // Use the presence hook to track user's online status
  useUserPresence();

  // Fetch conversations using React Query with optimized settings
  const {
    data: conversations = [],
    isLoading: conversationsLoading,
    error: conversationsError,
    refetch: refetchConversations
  } = useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
    enabled: !!user, // Use user instead of session for faster availability
    staleTime: 30 * 1000, // Cache for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    refetchOnMount: 'always' // Always fetch fresh data on mount
  });

  // Define handleConversationCreated with useCallback BEFORE the useEffect
  const handleConversationCreated = useCallback(async (conversationId: string) => {
    console.log('🔹 handleConversationCreated called with:', conversationId);

    // Immediately select the conversation (optimistic update already added it to list)
    const newConversation = conversations.find(c => c.id === conversationId);
    console.log('🔹 Found conversation in list:', newConversation);

    if (newConversation) {
      setActiveConversation(newConversation);
      console.log('🔹 Set active conversation');

      // Scroll conversation list to top
      setTimeout(() => {
        const conversationList = document.getElementById('conversation-list');
        conversationList?.scrollTo({ top: 0, behavior: 'smooth' });
        console.log('🔹 Scrolled to top');
      }, 50);

      // Focus message input
      setTimeout(() => {
        const messageInput = document.querySelector('[data-message-input]') as HTMLTextAreaElement;
        messageInput?.focus();
        console.log('🔹 Focused input');
      }, 100);
    } else {
      console.warn('⚠️ Conversation not found in list, refetching...');
    }

    // Refetch to get complete data
    await refetchConversations();
    console.log('🔹 Refetched conversations');
  }, [conversations, refetchConversations]);

  // Set the first conversation as active or navigate to specific conversation
  useEffect(() => {
    // Check if we're navigating to a specific conversation
    const state = location.state as { conversationId?: string };
    if (state?.conversationId && conversations.length > 0) {
      console.log('🔹 Navigation state detected:', state.conversationId);
      const targetConversation = conversations.find(c => c.id === state.conversationId);
      if (targetConversation) {
        console.log('🔹 Calling handleConversationCreated from navigation');
        handleConversationCreated(state.conversationId);
        // Clear the navigation state
        window.history.replaceState({}, document.title);
        return;
      }
    }

    // Otherwise, select first conversation if none active
    if (conversations.length > 0 && !activeConversation) {
      setActiveConversation(conversations[0]);
    }
  }, [conversations, activeConversation, location, handleConversationCreated]);

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

  // Real-time subscription for new messages
  useEffect(() => {
    if (!user || !activeConversation) return;

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`
        },
        (payload) => {
          const newMessage = payload.new as any;

          // Only add if it's from the active conversation
          if (newMessage.sender_id === activeConversation.user.id) {
            const message: Message = {
              id: newMessage.id,
              sender: newMessage.sender_id,
              content: newMessage.content,
              timestamp: new Date(newMessage.created_at),
              isCurrentUser: false
            };

            setMessages(prev => [...prev, message]);

            // Mark as read
            supabase
              .from('messages')
              .update({ is_read: true })
              .eq('id', newMessage.id)
              .then();
          } else {
            // Message from different conversation - refresh conversation list
            refetchConversations();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, activeConversation, refetchConversations]);

  // Real-time subscription for conversation updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('conversations_updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations'
        },
        () => {
          // Refresh conversations when any conversation is updated
          refetchConversations();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'conversations'
        },
        () => {
          // Refresh conversations when new conversation is created
          refetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refetchConversations]);

  // Track other user's last seen (when they view this conversation)
  useEffect(() => {
    if (!user || !activeConversation) return;

    const channel = supabase.channel(`conversation-presence:${activeConversation.id}`);

    // Subscribe FIRST, then set up event handlers
    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        // Now that we're subscribed, set up presence tracking
        channel.on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          // Check if other user is currently viewing
          const otherUserPresence = Object.values(state).find((presences: any) => {
            return presences.some((presence: any) => presence.user_id === activeConversation.user.id);
          });

          if (otherUserPresence) {
            // User is currently viewing - update last seen to now
            setOtherUserLastSeen(new Date());
          }
        });

        // Broadcast that current user is viewing this conversation
        await channel.track({
          user_id: user.id,
          viewing: true,
          timestamp: new Date().toISOString()
        });
      }
    });

    return () => {
      channel.untrack();
      supabase.removeChannel(channel);
    };
  }, [user, activeConversation]);

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
      <Layout isLoggedIn={true} user={userData ? {
        name: userData.name || user?.email?.split('@')[0] || 'User',
        avatarUrl: (userData.useVehiclePhotoAsProfile && userData.vehiclePhotoUrl) 
          ? userData.vehiclePhotoUrl 
          : userData.avatarUrl,
        unimogModel: userData.unimogModel || '',
        vehiclePhotoUrl: userData.vehiclePhotoUrl || '',
        useVehiclePhotoAsProfile: userData.useVehiclePhotoAsProfile || false
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
    <Layout isLoggedIn={!!user} user={userData ? {
      name: userData.name || user?.email?.split('@')[0] || 'User',
      avatarUrl: (userData.useVehiclePhotoAsProfile && userData.vehiclePhotoUrl) 
        ? userData.vehiclePhotoUrl 
        : userData.avatarUrl,
      unimogModel: userData.unimogModel || '',
      vehiclePhotoUrl: userData.vehiclePhotoUrl || '',
      useVehiclePhotoAsProfile: userData.useVehiclePhotoAsProfile || false
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
              onConversationCreated={handleConversationCreated}
            />
          )}
          
          {/* Messages Area */}
          <div className="lg:col-span-2 border rounded-lg shadow-sm overflow-hidden flex flex-col">
            {activeConversation ? (
              <>
                <MessageHeader conversation={activeConversation} lastSeen={otherUserLastSeen} />
                <MessageThread messages={messages} otherUserLastSeen={otherUserLastSeen} />
                <MessageInput onSendMessage={handleSendMessage} conversationId={activeConversation.id} />
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
