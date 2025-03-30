
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { UserProfile } from '@/types/user';
import ContentInput from './post/create/ContentInput';
import PostTypeSelector from './post/create/PostTypeSelector';
import PostTypeContent from './post/create/PostTypeContent';
import PostActions from './post/create/PostActions';
import { usePostForm } from './post/create/usePostForm';

interface CreatePostProps {
  profile: UserProfile | null;
  onPostCreated: () => void;
}

const CreatePost = ({ profile, onPostCreated }: CreatePostProps) => {
  const {
    content,
    isSubmitting,
    postType,
    imageUrl,
    videoUrl,
    linkUrl,
    linkTitle,
    linkDescription,
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
  } = usePostForm(onPostCreated);
  
  return (
    <Card>
      <CardContent className="pt-6">
        <ContentInput 
          content={content}
          profile={profile}
          maxChars={MAX_CHARS}
          onChange={handleContentChange}
        />
        
        <div className="mt-4">
          <PostTypeSelector postType={postType} onChange={handlePostTypeChange} />
          
          <div className="mt-4">
            <PostTypeContent 
              postType={postType}
              imageUrl={imageUrl}
              videoUrl={videoUrl}
              linkUrl={linkUrl}
              linkTitle={linkTitle}
              linkDescription={linkDescription}
              setImageUrl={setImageUrl}
              setVideoUrl={setVideoUrl}
              setLinkUrl={setLinkUrl}
              setLinkTitle={setLinkTitle}
              setLinkDescription={setLinkDescription}
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-3 flex justify-between">
        <PostActions 
          isSubmitting={isSubmitting}
          isOverLimit={isOverLimit}
          hasContent={hasContent}
          onSubmit={handlePostSubmit}
          setPostType={setPostTypeButton}
        />
      </CardFooter>
    </Card>
  );
};

export default CreatePost;
