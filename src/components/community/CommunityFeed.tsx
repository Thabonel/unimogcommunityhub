
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Image as ImageIcon,
  Video,
  Link,
  Send,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import PostItem from './PostItem';

// Mock data for community posts
const MOCK_POSTS = [
  {
    id: '1',
    author: {
      name: 'John Doe',
      avatar: '/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png',
      unimogModel: 'U1700L',
    },
    content: 'Just finished installing a new winch on my U1700L. The installation was straightforward and it works perfectly. Has anyone else upgraded their winch recently?',
    images: [],
    createdAt: new Date(2023, 10, 15, 14, 30),
    likes: 24,
    comments: 8,
    shares: 3,
  },
  {
    id: '2',
    author: {
      name: 'Sarah Johnson',
      avatar: null,
      unimogModel: 'U4000',
    },
    content: 'Took my Unimog to the mountains this weekend. The vehicle handled the challenging terrain like a champion!',
    images: [],
    createdAt: new Date(2023, 10, 14, 9, 45),
    likes: 42,
    comments: 15,
    shares: 7,
  },
  {
    id: '3',
    author: {
      name: 'Mike Thompson',
      avatar: null,
      unimogModel: 'U5000',
    },
    content: 'Anyone have recommendations for all-terrain tires for a U5000? Looking to replace mine soon.',
    images: [],
    createdAt: new Date(2023, 10, 13, 16, 20),
    likes: 18,
    comments: 27,
    shares: 2,
  }
];

const CommunityFeed = () => {
  const [postContent, setPostContent] = useState('');
  const [feedFilter, setFeedFilter] = useState('all');
  
  const handlePostSubmit = () => {
    if (postContent.trim()) {
      // In a real app, this would send the post to a backend
      console.log('Creating new post:', postContent);
      setPostContent('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Post Card */}
      <Card>
        <CardHeader className="pb-3">
          <h3 className="text-lg font-semibold">Create Post</h3>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png" alt="User avatar" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Textarea 
              placeholder="What's on your mind?" 
              className="resize-none flex-1"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="border-t pt-3 flex justify-between">
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" className="text-blue-500">
              <ImageIcon size={18} className="mr-1" />
              Photo
            </Button>
            <Button variant="ghost" size="sm" className="text-green-500">
              <Video size={18} className="mr-1" />
              Video
            </Button>
            <Button variant="ghost" size="sm" className="text-amber-500">
              <Link size={18} className="mr-1" />
              Link
            </Button>
          </div>
          <Button 
            onClick={handlePostSubmit}
            disabled={!postContent.trim()} 
            className="flex items-center"
          >
            <Send size={16} className="mr-1" />
            Post
          </Button>
        </CardFooter>
      </Card>
      
      {/* Feed Filter Tabs */}
      <Tabs defaultValue="all" value={feedFilter} onValueChange={setFeedFilter} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Posts List */}
      <div className="space-y-6">
        {MOCK_POSTS.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default CommunityFeed;
