import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, MessageCircle, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase-client';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface VehicleComment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user_name?: string;
  user_avatar?: string;
}

interface VehicleCommentsProps {
  vehicleId: string;
  isOpen: boolean;
}

const VehicleComments = ({ vehicleId, isOpen }: VehicleCommentsProps) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<VehicleComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && vehicleId) {
      loadComments();
    }
  }, [isOpen, vehicleId]);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('vehicle_comments')
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles:user_id (
            display_name,
            avatar_url
          )
        `)
        .eq('vehicle_id', vehicleId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to include user info
      const transformedComments = (data || []).map((comment: any) => ({
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        user_id: comment.user_id,
        user_name: comment.profiles?.display_name || 'Unknown User',
        user_avatar: comment.profiles?.avatar_url
      }));

      setComments(transformedComments);
    } catch (error) {
      console.error('Error loading comments:', error);
      // Don't show error if it's just a missing column issue
      if (!(error as any)?.message?.includes('column')) {
        toast({
          title: 'Error loading comments',
          description: 'Failed to load comments. Please try again.',
          variant: 'destructive'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to leave a comment.',
        variant: 'destructive'
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: 'Empty comment',
        description: 'Please write something before submitting.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('vehicle_comments')
        .insert({
          vehicle_id: vehicleId,
          user_id: user.id,
          content: newComment.trim()
        })
        .select()
        .single();

      if (error) throw error;

      // Get user profile for the new comment
      const { data: profileData } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('id', user.id)
        .single();

      // Add the new comment to the list
      const newCommentData: VehicleComment = {
        id: data.id,
        content: data.content,
        created_at: data.created_at,
        user_id: data.user_id,
        user_name: profileData?.display_name || 'Unknown User',
        user_avatar: profileData?.avatar_url
      };

      setComments([newCommentData, ...comments]);
      setNewComment('');
      
      toast({
        title: 'Comment posted!',
        description: 'Your comment has been added.',
      });
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: 'Error posting comment',
        description: 'Failed to post your comment. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Comment Input */}
        {user ? (
          <div className="space-y-3">
            <Textarea
              placeholder="Share your thoughts about this vehicle..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px]"
              disabled={isSubmitting}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSubmitComment}
                disabled={isSubmitting || !newComment.trim()}
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            Please sign in to leave a comment
          </div>
        )}

        {/* Comments List */}
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading comments...
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No comments yet. Be the first to share your thoughts!
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={comment.user_avatar} />
                  <AvatarFallback>
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">
                      {comment.user_name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VehicleComments;