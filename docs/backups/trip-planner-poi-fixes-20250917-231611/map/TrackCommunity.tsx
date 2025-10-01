
import React, { useState, useEffect } from 'react';
import { fetchPublicTracks, fetchUserTracks } from '@/services/trackCommentService';
import { Track } from '@/types/track';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/lib/supabase-client';
import { Map, Users, UserCircle, Share2 } from 'lucide-react';

interface TrackCommunityProps {
  onSelectTrack: (track: Track) => void;
}

const TrackCommunity: React.FC<TrackCommunityProps> = ({ onSelectTrack }) => {
  const [publicTracks, setPublicTracks] = useState<Track[]>([]);
  const [userTracks, setUserTracks] = useState<Track[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('public');

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      setIsLoggedIn(!!data.user);
    };
    
    checkAuth();
  }, []);

  useEffect(() => {
    const loadTracks = async () => {
      setIsLoading(true);
      
      const public_tracks = await fetchPublicTracks();
      setPublicTracks(public_tracks);
      
      if (isLoggedIn) {
        const user_tracks = await fetchUserTracks();
        setUserTracks(user_tracks);
      }
      
      setIsLoading(false);
    };
    
    loadTracks();
  }, [isLoggedIn]);

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-blue-500';
      case 'advanced': return 'bg-orange-500';
      case 'expert': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  const TrackItem = ({ track }: { track: Track }) => (
    <div 
      className="p-3 hover:bg-accent rounded-md cursor-pointer"
      onClick={() => onSelectTrack(track)}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium">{track.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {track.description || 'No description'}
          </p>
          <div className="flex items-center mt-1 space-x-2">
            {track.difficulty && (
              <Badge className={`${getDifficultyColor(track.difficulty)} hover:${getDifficultyColor(track.difficulty)}`}>
                {track.difficulty}
              </Badge>
            )}
            {track.distance_km && (
              <span className="text-xs text-muted-foreground">
                {track.distance_km.toFixed(1)} km
              </span>
            )}
          </div>
        </div>
        <Map 
          className="h-5 w-5 text-muted-foreground mt-1" 
          style={{ color: track.color || 'currentColor' }} 
        />
      </div>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5" />
          Track Community
        </CardTitle>
        <CardDescription>
          Discover and share tracks with the community
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="public">
              <Share2 className="h-4 w-4 mr-2" />
              Public Tracks
            </TabsTrigger>
            <TabsTrigger value="my-tracks" disabled={!isLoggedIn}>
              <UserCircle className="h-4 w-4 mr-2" />
              My Tracks
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="public" className="mt-4">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="space-y-2 w-full">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : publicTracks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="mb-2">No public tracks available</p>
                {isLoggedIn ? (
                  <p className="text-sm">
                    Create a track and share it with the community!
                  </p>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => {/* Sign in functionality */}}>
                    Sign in to create tracks
                  </Button>
                )}
              </div>
            ) : (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {publicTracks.map((track) => (
                    <TrackItem key={track.id} track={track} />
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
          
          <TabsContent value="my-tracks" className="mt-4">
            {isLoggedIn ? (
              isLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="space-y-2 w-full">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : userTracks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="mb-2">You haven't created any tracks yet</p>
                  <p className="text-sm">
                    Create a track by uploading a GPX file or drawing on the map
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-2">
                    {userTracks.map((track) => (
                      <TrackItem key={track.id} track={track} />
                    ))}
                  </div>
                </ScrollArea>
              )
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p className="mb-2">Please sign in to view your tracks</p>
                <Button variant="outline" size="sm" onClick={() => {/* Sign in functionality */}}>
                  Sign in
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TrackCommunity;
