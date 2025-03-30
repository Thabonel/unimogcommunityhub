
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { Conversation, User } from '@/types/message';
import { getUsers, createConversation } from '@/services/messageService';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

interface ConversationSidebarProps {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
}

const ConversationSidebar = ({ 
  conversations, 
  activeConversation, 
  onSelectConversation 
}: ConversationSidebarProps) => {
  const [search, setSearch] = useState('');
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);

  // Query for getting users
  const { 
    data: users = [], 
    isLoading: usersLoading 
  } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    enabled: isNewMessageOpen // Only fetch when dialog is open
  });

  const filteredConversations = conversations.filter(convo => 
    convo.user.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleStartConversation = async (userId: string) => {
    try {
      const conversationId = await createConversation(userId);
      if (conversationId) {
        setIsNewMessageOpen(false);
        toast({
          title: "Conversation Started",
          description: "You can now send messages to this user."
        });
        // Note: In a real app you'd then fetch the new conversation or redirect to it
        // Here we'll just close the dialog and let the conversations query refetch
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
      toast({
        title: "Error",
        description: "Failed to start conversation. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="lg:col-span-1 overflow-hidden flex flex-col">
      <div className="p-4 border-b">
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search conversations..." 
            className="pl-8" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Dialog open={isNewMessageOpen} onOpenChange={setIsNewMessageOpen}>
          <DialogTrigger asChild>
            <Button className="w-full flex items-center gap-2">
              <Plus size={16} />
              New Message
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start a new conversation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto py-4">
              {usersLoading ? (
                <div className="text-center py-8">Loading users...</div>
              ) : users.length === 0 ? (
                <div className="text-center py-8">No users found</div>
              ) : (
                users.map((user) => (
                  <div 
                    key={user.id}
                    className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer"
                    onClick={() => handleStartConversation(user.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar || undefined} alt={user.name} />
                        <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                    </div>
                    <Button size="sm" variant="ghost">
                      Message
                    </Button>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="overflow-y-auto flex-1">
        {filteredConversations.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            No conversations found
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <div 
              key={conversation.id}
              className={`p-3 cursor-pointer flex items-center gap-3 hover:bg-accent relative ${
                activeConversation?.id === conversation.id ? 'bg-accent' : ''
              }`}
              onClick={() => onSelectConversation(conversation)}
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={conversation.user.avatar || undefined} alt={conversation.user.name} />
                  <AvatarFallback>{conversation.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                {conversation.user.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-medium truncate">{conversation.user.name}</h4>
                  <span className="text-xs text-muted-foreground">
                    {format(conversation.timestamp, 'h:mm a')}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {conversation.lastMessage}
                </p>
              </div>
              
              {conversation.unread > 0 && (
                <div className="bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium">
                  {conversation.unread}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default ConversationSidebar;
