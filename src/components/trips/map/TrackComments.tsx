
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  getTrackComments,
  addTrackComment,
  deleteTrackComment
} from '@/services/trackCommentService';
import { TrackComment } from '@/types/track';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { Send, Trash2 } from 'lucide-react';

interface TrackCommentsProps {
  trackId?: string;
}

const TrackComments: React.FC<TrackCommentsProps> = ({ trackId }) => {
  const [comments, setComments] = useState<TrackComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUser(data.user);
    };
    
    fetchUser();
  }, []);

  // Fetch comments when trackId changes
  useEffect(() => {
    if (!trackId) return;
    
    const loadComments = async () => {
      setIsLoading(true);
      const commentsData = await getTrackComments(trackId);
      setComments(commentsData);
      setIsLoading(false);
    };
    
    loadComments();
  }, [trackId]);

  const handleSubmitComment = async () => {
    if (!trackId || !newComment.trim()) return;
    
    setSubmitting(true);
    const comment = await addTrackComment(trackId, newComment);
    
    if (comment) {
      setComments([comment, ...comments]);
      setNewComment('');
    }
    
    setSubmitting(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    const success = await deleteTrackComment(commentId);
    if (success) {
      setComments(comments.filter(comment => comment.id !== commentId));
    }
  };

  if (!trackId) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center text-muted-foreground">
          No track selected. Select a track to view comments.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Comments</CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {currentUser ? (
              <div className="flex gap-3 mb-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    {currentUser.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="resize-none min-h-[80px]"
                  />
                  <div className="flex justify-end mt-2">
                    <Button 
                      size="sm" 
                      onClick={handleSubmitComment} 
                      disabled={submitting || !newComment.trim()}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-4 bg-muted rounded-md mb-4">
                <p className="text-sm text-muted-foreground">
                  Please sign in to post comments
                </p>
              </div>
            )}
            
            <Separator className="my-4" />
            
            <ScrollArea className="h-[300px] pr-4">
              {comments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No comments yet. Be the first to add a comment!
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.user?.avatar_url} />
                        <AvatarFallback>
                          {comment.user?.display_name?.charAt(0).toUpperCase() || 
                           comment.user?.full_name?.charAt(0).toUpperCase() || 
                           comment.user?.email?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium">
                              {comment.user?.display_name || 
                               comment.user?.full_name || 
                               comment.user?.email?.split('@')[0] || 
                               'Anonymous'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                            </p>
                          </div>
                          {currentUser?.id === comment.user_id && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteComment(comment.id)}
                              className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <p className="mt-1 text-sm whitespace-pre-wrap">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t px-6 py-3">
        <p className="text-xs text-muted-foreground">
          {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
        </p>
      </CardFooter>
    </Card>
  );
};

export default TrackComments;
