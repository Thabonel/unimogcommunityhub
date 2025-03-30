
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import ConversationSidebar from '@/components/messages/ConversationSidebar';
import MessageHeader from '@/components/messages/MessageHeader';
import MessageThread from '@/components/messages/MessageThread';
import MessageInput from '@/components/messages/MessageInput';
import { Conversation } from '@/types/message';
import { MOCK_CONVERSATIONS, MOCK_MESSAGES, MOCK_USER } from '@/components/messages/data/mockData';

const Messages = () => {
  const [activeConversation, setActiveConversation] = useState<Conversation>(MOCK_CONVERSATIONS[0]);
  
  const handleSendMessage = (messageText: string) => {
    // In a real app, this would send the message to a backend
    console.log('Sending message:', messageText);
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
  };

  return (
    <Layout isLoggedIn={true} user={MOCK_USER}>
      <div className="container py-6">
        <h1 className="text-3xl font-bold text-unimog-800 dark:text-unimog-200 mb-6">
          Messages
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
          {/* Conversations Sidebar */}
          <ConversationSidebar 
            conversations={MOCK_CONVERSATIONS}
            activeConversation={activeConversation}
            onSelectConversation={handleSelectConversation}
          />
          
          {/* Message Thread */}
          <Card className="lg:col-span-2 flex flex-col overflow-hidden">
            <MessageHeader conversation={activeConversation} />
            <MessageThread messages={MOCK_MESSAGES} />
            <MessageInput onSendMessage={handleSendMessage} />
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
