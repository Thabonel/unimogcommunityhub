
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type PostType = 'text' | 'image' | 'video' | 'link';

interface PostTypeSelectorProps {
  postType: PostType;
  onChange: (value: PostType) => void;
}

const PostTypeSelector = ({ postType, onChange }: PostTypeSelectorProps) => {
  return (
    <Tabs value={postType} onValueChange={(value) => onChange(value as PostType)}>
      <TabsList className="grid grid-cols-4 w-full">
        <TabsTrigger value="text">Text</TabsTrigger>
        <TabsTrigger value="image">Image</TabsTrigger>
        <TabsTrigger value="video">Video</TabsTrigger>
        <TabsTrigger value="link">Link</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default PostTypeSelector;
