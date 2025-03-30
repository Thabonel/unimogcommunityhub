
import PostMedia from './PostMedia';

interface PostContentProps {
  content: string;
  image_url?: string | null;
  video_url?: string | null;
  link_url?: string | null;
  link_title?: string | null;
  link_description?: string | null;
  link_image?: string | null;
}

const PostContent = ({ 
  content,
  image_url,
  video_url,
  link_url,
  link_title,
  link_description,
  link_image
}: PostContentProps) => {
  return (
    <>
      <p className="whitespace-pre-wrap">{content}</p>
      <PostMedia 
        image_url={image_url}
        video_url={video_url}
        link_url={link_url}
        link_title={link_title}
        link_description={link_description}
        link_image={link_image}
      />
    </>
  );
};

export default PostContent;
