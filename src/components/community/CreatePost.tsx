
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Image as ImageIcon, Video, Link, Send, Info } from 'lucide-react';
import { createPost } from '@/services/postService';
import { toast } from '@/hooks/use-toast';
import { UserProfile } from '@/types/user';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface CreatePostProps {
  profile: UserProfile | null;
  onPostCreated: () => void;
}

// Maximum character limit for posts
const MAX_CHARS = 500;

const CreatePost = ({ profile, onPostCreated }: CreatePostProps) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postType, setPostType] = useState<'text' | 'image' | 'video' | 'link'>('text');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [linkDescription, setLinkDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handlePostSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: 'Cannot create empty post',
        description: 'Please add some content to your post',
        variant: 'destructive',
      });
      return;
    }
    
    if (content.length > MAX_CHARS) {
      toast({
        title: 'Post too long',
        description: `Your post exceeds the maximum character limit of ${MAX_CHARS}`,
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let finalImageUrl = undefined;
      let finalVideoUrl = undefined;
      let linkInfo = undefined;
      
      switch (postType) {
        case 'image':
          if (imageUrl) finalImageUrl = imageUrl;
          break;
        case 'video':
          if (videoUrl) finalVideoUrl = videoUrl;
          break;
        case 'link':
          if (linkUrl) {
            linkInfo = {
              url: linkUrl,
              title: linkTitle,
              description: linkDescription,
            };
          }
          break;
      }
      
      const result = await createPost(content, finalImageUrl, finalVideoUrl, linkInfo);
      
      if (result) {
        setContent('');
        setImageUrl('');
        setVideoUrl('');
        setLinkUrl('');
        setLinkTitle('');
        setLinkDescription('');
        setPostType('text');
        onPostCreated();
        
        toast({
          title: 'Post created!',
          description: 'Your post has been published successfully.',
          variant: 'default',
        });
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  
  const getInitials = () => {
    if (profile?.display_name) {
      return profile.display_name.substring(0, 2).toUpperCase();
    } else if (profile?.full_name) {
      return profile.full_name.substring(0, 2).toUpperCase();
    } else {
      return 'UN';
    }
  };
  
  const handleTabChange = (value: string) => {
    setPostType(value as 'text' | 'image' | 'video' | 'link');
  };
  
  const charCount = content.length;
  const charPercentage = (charCount / MAX_CHARS) * 100;
  const isOverLimit = charCount > MAX_CHARS;
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profile?.avatar_url || undefined} alt="User avatar" />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea 
              placeholder="What's on your mind?" 
              className="resize-none flex-1"
              value={content}
              onChange={handleContentChange}
            />
            <div className="flex justify-between items-center mt-1">
              <div className="w-full max-w-xs">
                <Progress 
                  value={charPercentage} 
                  className={isOverLimit ? "bg-red-200" : ""}
                />
              </div>
              <span className={`text-xs ${isOverLimit ? "text-red-500 font-bold" : "text-muted-foreground"}`}>
                {charCount}/{MAX_CHARS} characters
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <Tabs value={postType} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="image">Image</TabsTrigger>
              <TabsTrigger value="video">Video</TabsTrigger>
              <TabsTrigger value="link">Link</TabsTrigger>
            </TabsList>
            
            <div className="mt-4">
              {postType === 'image' && (
                <div className="space-y-2">
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Image URL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  {imageUrl && (
                    <img 
                      src={imageUrl} 
                      alt="Preview" 
                      className="max-h-60 rounded object-cover" 
                      onError={() => {
                        toast({
                          title: 'Invalid image URL',
                          description: 'The provided URL cannot be loaded as an image',
                          variant: 'destructive',
                        });
                        setImageUrl('');
                      }}
                    />
                  )}
                </div>
              )}
              
              {postType === 'video' && (
                <div>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Video URL (YouTube, Vimeo, etc.)"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                  />
                </div>
              )}
              
              {postType === 'link' && (
                <div className="space-y-2">
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Link URL"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                  />
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Link Title (optional)"
                    value={linkTitle}
                    onChange={(e) => setLinkTitle(e.target.value)}
                  />
                  <textarea
                    className="w-full p-2 border rounded resize-none"
                    placeholder="Link Description (optional)"
                    value={linkDescription}
                    onChange={(e) => setLinkDescription(e.target.value)}
                    rows={2}
                  />
                </div>
              )}
            </div>
          </Tabs>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-3 flex justify-between">
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" className="text-blue-500" onClick={() => setPostType('image')}>
            <ImageIcon size={18} className="mr-1" />
            Photo
          </Button>
          <Button variant="ghost" size="sm" className="text-green-500" onClick={() => setPostType('video')}>
            <Video size={18} className="mr-1" />
            Video
          </Button>
          <Button variant="ghost" size="sm" className="text-amber-500" onClick={() => setPostType('link')}>
            <Link size={18} className="mr-1" />
            Link
          </Button>
        </div>
        <Button 
          onClick={handlePostSubmit} 
          disabled={!content.trim() || isSubmitting || isOverLimit} 
          className="flex items-center"
        >
          <Send size={16} className="mr-1" />
          Post
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreatePost;
