
import { useState } from 'react';
import { PostType } from '../constants/postFormConstants';

export const usePostState = () => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postType, setPostType] = useState<PostType>('text');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [linkDescription, setLinkDescription] = useState('');

  return {
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
  };
};
