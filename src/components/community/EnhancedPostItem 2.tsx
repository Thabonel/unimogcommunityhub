
import { useState, useEffect, useRef } from 'react';
import PostItem from './PostItem';
import { PostWithUser } from '@/types/post';
import { useAnalytics } from '@/hooks/use-analytics';

interface EnhancedPostItemProps {
  post: PostWithUser;
}

const EnhancedPostItem: React.FC<EnhancedPostItemProps> = ({ post }) => {
  const { trackContentEngagement } = useAnalytics();
  const [isInView, setIsInView] = useState(false);
  const [viewStartTime, setViewStartTime] = useState<number | null>(null);
  const postRef = useRef<HTMLDivElement>(null);
  
  // Set up intersection observer to detect when post is viewed
  useEffect(() => {
    if (!postRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          // Post came into view
          setIsInView(true);
          setViewStartTime(Date.now());
          
          // Track post impression
          if (!localStorage.getItem(`post-viewed-${post.id}`)) {
            trackContentEngagement('page_view', post.id, 'post', { action: 'impression' });
            localStorage.setItem(`post-viewed-${post.id}`, 'true');
          }
        } else if (viewStartTime) {
          // Post is no longer in view, track view duration
          setIsInView(false);
          const viewDuration = Math.round((Date.now() - viewStartTime) / 1000);
          
          trackContentEngagement('feature_use', post.id, 'post', {
            action: 'view_duration',
            view_time: viewDuration
          });
          
          setViewStartTime(null);
        }
      },
      { threshold: 0.5 } // Post is considered viewed when 50% visible
    );
    
    observer.observe(postRef.current);
    return () => observer.disconnect();
  }, [post.id, viewStartTime, trackContentEngagement]);
  
  // Track view duration when component unmounts if still in view
  useEffect(() => {
    return () => {
      if (isInView && viewStartTime) {
        const viewDuration = Math.round((Date.now() - viewStartTime) / 1000);
        trackContentEngagement('feature_use', post.id, 'post', {
          action: 'view_duration',
          view_time: viewDuration
        });
      }
    };
  }, [isInView, viewStartTime, post.id, trackContentEngagement]);

  return (
    <div ref={postRef}>
      <PostItem post={post} />
    </div>
  );
};

export default EnhancedPostItem;
