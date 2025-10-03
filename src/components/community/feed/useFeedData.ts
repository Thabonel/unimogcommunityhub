import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPosts } from '@/services/post';
import { deletePost as deletePostService, toggleLikePost } from '@/services/post';
import { getUserProfile } from '@/services/userProfileService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { UserProfile } from '@/types/user';
import { PostWithUser } from '@/types/post';

export const useFeedData = () => {
  const [feedFilter, setFeedFilter] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch posts with React Query
  const {
    data: postsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['posts', page, selectedTags],
    queryFn: async () => {
      const allPosts = await getPosts(10, page);

      // Filter by tags if selected
      if (selectedTags.length > 0) {
        return allPosts.filter(post =>
          post.content && selectedTags.some(tag =>
            post.content.toLowerCase().includes(tag.toLowerCase())
          )
        );
      }

      return allPosts;
    },
    staleTime: 1000 * 30, // 30 seconds
  });

  const posts = postsData || [];
  const hasMore = posts.length === 10;

  // Fetch user profile
  const { data: userProfile } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: () => user ? getUserProfile(user.id) : null,
    enabled: !!user,
  });

  // Delete mutation - simple and reliable
  const deleteMutation = useMutation({
    mutationFn: async (postId: string) => {
      const success = await deletePostService(postId);
      if (!success) {
        throw new Error('Delete failed');
      }
      return postId;
    },
    onSuccess: () => {
      // Invalidate and refetch posts immediately after successful delete
      queryClient.invalidateQueries({ queryKey: ['posts'] });

      toast({
        title: 'Post deleted',
        description: 'Your post has been successfully deleted.',
        variant: 'default',
      });
    },
    onError: (error) => {
      console.error('[Delete] Error:', error);
      toast({
        title: 'Error deleting post',
        description: 'Failed to delete post. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Like mutation with optimistic updates
  const likeMutation = useMutation({
    mutationFn: async ({ postId }: { postId: string }) => {
      const isLiked = await toggleLikePost(postId);
      return { postId, isLiked };
    },
    onMutate: async ({ postId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['posts', page, selectedTags] });

      // Snapshot previous value
      const previousPosts = queryClient.getQueryData<PostWithUser[]>(['posts', page, selectedTags]);

      // Optimistically update the cache
      queryClient.setQueryData<PostWithUser[]>(['posts', page, selectedTags], (old) => {
        if (!old) return [];
        return old.map(post => {
          if (post.id === postId) {
            const wasLiked = post.liked_by_user;
            return {
              ...post,
              liked_by_user: !wasLiked,
              likes_count: wasLiked ? post.likes_count - 1 : post.likes_count + 1,
            };
          }
          return post;
        });
      });

      return { previousPosts };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts', page, selectedTags], context.previousPosts);
      }
      toast({
        title: 'Error',
        description: 'Failed to update like. Please try again.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      // Refetch to ensure we have the correct count
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const handlePostCreated = () => {
    setPage(0);
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  };

  const handlePostDeleted = (postId: string) => {
    deleteMutation.mutate(postId);
  };

  const handleToggleLike = (postId: string) => {
    likeMutation.mutate({ postId });
  };

  const handleFilterChange = (value: string) => {
    setFeedFilter(value);
    setPage(0);
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
    setPage(0);
  };

  const clearTags = () => {
    setSelectedTags([]);
    setPage(0);
  };

  return {
    feedFilter,
    selectedTags,
    posts,
    isLoading,
    page,
    hasMore,
    userProfile: userProfile || null,
    handleLoadMore,
    handlePostCreated,
    handlePostDeleted,
    handleToggleLike,
    handleFilterChange,
    toggleTag,
    clearTags,
  };
};
