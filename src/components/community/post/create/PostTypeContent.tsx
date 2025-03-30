
import ImageUpload from './ImageUpload';
import VideoUpload from './VideoUpload';
import LinkUpload from './LinkUpload';

type PostType = 'text' | 'image' | 'video' | 'link';

interface PostTypeContentProps {
  postType: PostType;
  imageUrl: string;
  videoUrl: string;
  linkUrl: string;
  linkTitle: string;
  linkDescription: string;
  setImageUrl: (url: string) => void;
  setVideoUrl: (url: string) => void;
  setLinkUrl: (url: string) => void;
  setLinkTitle: (title: string) => void;
  setLinkDescription: (description: string) => void;
}

const PostTypeContent = ({
  postType,
  imageUrl,
  videoUrl,
  linkUrl,
  linkTitle,
  linkDescription,
  setImageUrl,
  setVideoUrl,
  setLinkUrl,
  setLinkTitle,
  setLinkDescription
}: PostTypeContentProps) => {
  if (postType === 'image') {
    return <ImageUpload imageUrl={imageUrl} setImageUrl={setImageUrl} />;
  }
  
  if (postType === 'video') {
    return <VideoUpload videoUrl={videoUrl} setVideoUrl={setVideoUrl} />;
  }
  
  if (postType === 'link') {
    return (
      <LinkUpload 
        linkUrl={linkUrl}
        linkTitle={linkTitle}
        linkDescription={linkDescription}
        setLinkUrl={setLinkUrl}
        setLinkTitle={setLinkTitle}
        setLinkDescription={setLinkDescription}
      />
    );
  }
  
  return null;
};

export default PostTypeContent;
