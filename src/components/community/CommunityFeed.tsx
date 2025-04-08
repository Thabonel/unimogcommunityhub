
import { useFeedData } from './feed/useFeedData';
import FeedHeader from './feed/FeedHeader';
import ActiveTags from './feed/ActiveTags';
import PostList from './feed/PostList';
import CreatePost from './CreatePost';
import { AVAILABLE_TAGS } from './feed/constants';
import { Sparkles } from 'lucide-react';

const CommunityFeed = () => {
  const {
    feedFilter,
    selectedTags,
    posts,
    isLoading,
    page,
    hasMore,
    userProfile,
    handleLoadMore,
    handlePostCreated,
    handleFilterChange,
    toggleTag,
    clearTags
  } = useFeedData();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Title */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="text-gradient">Community Feed</span>
        </h1>
      </div>
      
      {/* Create Post Card */}
      <div className="card-with-gradient">
        <CreatePost profile={userProfile} onPostCreated={handlePostCreated} />
      </div>
      
      {/* Feed Filter Tabs and Topic Filter */}
      <div className="community-card">
        <FeedHeader 
          feedFilter={feedFilter}
          selectedTags={selectedTags}
          onFilterChange={handleFilterChange}
          onToggleTag={toggleTag}
          onClearTags={clearTags}
          availableTags={AVAILABLE_TAGS}
        />
      </div>
      
      {/* Active Tags */}
      {selectedTags.length > 0 && (
        <div className="px-1">
          <ActiveTags 
            selectedTags={selectedTags}
            onToggleTag={toggleTag}
            onClearTags={clearTags}
            availableTags={AVAILABLE_TAGS}
          />
        </div>
      )}
      
      {/* Posts List */}
      <div className="space-y-6">
        <PostList 
          posts={posts}
          isLoading={isLoading}
          page={page}
          hasMore={hasMore}
          selectedTags={selectedTags}
          onLoadMore={handleLoadMore}
        />
      </div>
    </div>
  );
};

export default CommunityFeed;
