
import { useFeedData } from './feed/useFeedData';
import FeedHeader from './feed/FeedHeader';
import ActiveTags from './feed/ActiveTags';
import PostList from './feed/PostList';
import CreatePost from './CreatePost';
import { AVAILABLE_TAGS } from './feed/constants';

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
    <div className="space-y-6">
      {/* Create Post Card */}
      <CreatePost profile={userProfile} onPostCreated={handlePostCreated} />
      
      {/* Feed Filter Tabs and Topic Filter */}
      <FeedHeader 
        feedFilter={feedFilter}
        selectedTags={selectedTags}
        onFilterChange={handleFilterChange}
        onToggleTag={toggleTag}
        onClearTags={clearTags}
        availableTags={AVAILABLE_TAGS}
      />
      
      {/* Active Tags */}
      <ActiveTags 
        selectedTags={selectedTags}
        onToggleTag={toggleTag}
        onClearTags={clearTags}
        availableTags={AVAILABLE_TAGS}
      />
      
      {/* Posts List */}
      <PostList 
        posts={posts}
        isLoading={isLoading}
        page={page}
        hasMore={hasMore}
        selectedTags={selectedTags}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
};

export default CommunityFeed;
