
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Users, MessageSquare, Search, Bell, UserPlus, 
  Image as ImageIcon, Video, Link, Send, UserCircle
} from 'lucide-react';
import CommunityFeed from '@/components/community/CommunityFeed';
import GroupsList from '@/components/community/GroupsList';
import { Link as RouterLink } from 'react-router-dom';

const Community = () => {
  // Mock user data - in a real app this would come from authentication
  const mockUser = {
    name: 'John Doe',
    avatarUrl: '/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png',
    unimogModel: 'U1700L'
  };
  
  const [activeTab, setActiveTab] = useState('feed');

  return (
    <Layout isLoggedIn={true} user={mockUser}>
      <div className="container py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-unimog-800 dark:text-unimog-200 mb-2">
              Community
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Connect with other Unimog enthusiasts from around the world.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="flex items-center gap-2">
              <RouterLink to="/community/messages">
                <MessageSquare size={16} />
                <span>Messages</span>
              </RouterLink>
            </Button>
            <Button className="bg-primary flex items-center gap-2">
              <UserPlus size={16} />
              <span>Find Members</span>
            </Button>
          </div>
        </div>
        
        {/* Community Platform Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="hidden lg:block">
            <Card className="sticky top-6">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={mockUser.avatarUrl} alt={mockUser.name} />
                    <AvatarFallback>{mockUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{mockUser.name}</p>
                    <p className="text-sm text-muted-foreground">{mockUser.unimogModel} Owner</p>
                  </div>
                </div>
                
                <nav className="space-y-1">
                  <RouterLink to="/profile" className="flex items-center gap-3 p-2 rounded-md hover:bg-accent">
                    <UserCircle size={20} />
                    <span>My Profile</span>
                  </RouterLink>
                  <RouterLink to="/community/messages" className="flex items-center gap-3 p-2 rounded-md hover:bg-accent">
                    <MessageSquare size={20} />
                    <span>Messages</span>
                  </RouterLink>
                  <RouterLink to="/community/groups" className="flex items-center gap-3 p-2 rounded-md hover:bg-accent">
                    <Users size={20} />
                    <span>My Groups</span>
                  </RouterLink>
                  <RouterLink to="/community/notifications" className="flex items-center gap-3 p-2 rounded-md hover:bg-accent">
                    <Bell size={20} />
                    <span>Notifications</span>
                    <Badge className="ml-auto bg-primary px-1.5 min-w-[1.25rem] h-5 flex items-center justify-center">3</Badge>
                  </RouterLink>
                </nav>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="feed" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="feed" className="flex items-center gap-2">
                  <MessageSquare size={16} />
                  <span>Feed</span>
                </TabsTrigger>
                <TabsTrigger value="groups" className="flex items-center gap-2">
                  <Users size={16} />
                  <span>Groups</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="feed">
                <CommunityFeed />
              </TabsContent>
              
              <TabsContent value="groups">
                <GroupsList />
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right Sidebar */}
          <div className="hidden lg:block">
            <Card className="mb-6">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Find Members</h3>
                <div className="relative mb-4">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Search people..." 
                    className="pl-8" 
                  />
                </div>
                <h4 className="text-sm font-medium mb-2">Suggested Connections</h4>
                <div className="space-y-3">
                  {['Alex Weber', 'Sarah Johnson', 'Mike Thompson'].map((name, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{name}</span>
                      </div>
                      <Button size="sm" variant="outline">Connect</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Popular Groups</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Unimog Modifications', members: 243 },
                    { name: 'Off-road Adventures', members: 189 },
                    { name: 'Maintenance Tips', members: 156 }
                  ].map((group, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{group.name}</p>
                        <p className="text-xs text-muted-foreground">{group.members} members</p>
                      </div>
                      <Button size="sm" variant="outline">Join</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Community;
