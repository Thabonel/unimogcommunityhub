
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { createPost } from '@/services/post';
import { MAX_CHARS, PostType } from '../constants/postFormConstants';
import { validateVideoUrl } from '../utils/postValidators';

interface PostState {
  content: string;
  postType: PostType;
  imageUrl: string;
  videoUrl: string;
  linkUrl: string;
  linkTitle: string;
  linkDescription: string;
  setIsSubmitting: (value: boolean) => void;
}

export const usePostSubmission = (
  postState: PostState, 
  onPostCreated: () => void,
  resetForm: () => void
) => {
  const { 
    content, 
    postType, 
    imageUrl, 
    videoUrl, 
    linkUrl, 
    linkTitle, 
    linkDescription,
    setIsSubmitting 
  } = postState;

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
    
    // Validate video URL if it's a video post
    if (postType === 'video' && videoUrl) {
      const validationResult = validateVideoUrl(videoUrl);
      if (!validationResult.isValid) {
        toast({
          title: 'Invalid video URL',
          description: validationResult.message || 'Please enter a valid URL from YouTube, Vimeo, or a direct video file',
          variant: 'destructive',
        });
        return;
      }
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
        resetForm();
        onPostCreated();
        
        toast({
          title: 'Post created!',
          description: 'Your post has been published successfully.',
          variant: 'default',
        });
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: 'Error creating post',
        description: 'Something went wrong. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handlePostSubmit
  };
};
