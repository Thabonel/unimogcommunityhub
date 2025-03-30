
import { useCallback } from 'react';
import { usePostState } from './hooks/usePostState';
import { usePostSubmission } from './hooks/usePostSubmission';
import { MAX_CHARS, PostType } from './constants/postFormConstants';

export const usePostForm = (onPostCreated: () => void) => {
  const {
    content,
    setContent,
    isSubmitting,
    setIsSubmitting,
    postType,
    setPostType,
    imageUrl,
    setImageUrl,
    videoUrl,
    setVideoUrl,
    linkUrl,
    setLinkUrl,
    linkTitle,
    setLinkTitle,
    linkDescription,
    setLinkDescription
  } = usePostState();
  
  const charCount = content.length;
  const isOverLimit = charCount > MAX_CHARS;
  const hasContent = content.trim().length > 0;
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  
  const handlePostTypeChange = (value: PostType) => {
    setPostType(value);
  };
  
  const setPostTypeButton = (type: 'image' | 'video' | 'link') => {
    setPostType(type);
  };
  
  const resetForm = useCallback(() => {
    setContent('');
    setImageUrl('');
    setVideoUrl('');
    setLinkUrl('');
    setLinkTitle('');
    setLinkDescription('');
    setPostType('text');
  }, [setContent, setImageUrl, setVideoUrl, setLinkUrl, setLinkTitle, setLinkDescription, setPostType]);
  
  const { handlePostSubmit } = usePostSubmission({
    content,
    postType,
    imageUrl,
    videoUrl,
    linkUrl,
    linkTitle,
    linkDescription,
    setIsSubmitting
  }, onPostCreated, resetForm);
  
  return {
    content,
    isSubmitting,
    postType,
    imageUrl,
    videoUrl,
    linkUrl,
    linkTitle,
    linkDescription,
    charCount,
    isOverLimit,
    hasContent,
    MAX_CHARS,
    handleContentChange,
    handlePostTypeChange,
    setPostTypeButton,
    handlePostSubmit,
    setImageUrl,
    setVideoUrl,
    setLinkUrl,
    setLinkTitle,
    setLinkDescription
  };
};
