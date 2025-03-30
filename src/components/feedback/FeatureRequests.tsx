
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, Clock, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Feedback, 
  getFeatureRequests, 
  voteForFeature,
  hasUserVotedForFeature
} from '@/services/feedbackService';
import { useAnalytics } from '@/hooks/use-analytics';
import { FeedbackButton } from './FeedbackButton';

export function FeatureRequests() {
  const [features, setFeatures] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [userVotes, setUserVotes] = useState<Record<string, boolean>>({});
  const { trackFeatureUse } = useAnalytics();

  useEffect(() => {
    const loadFeatures = async () => {
      setLoading(true);
      const featureData = await getFeatureRequests();
      setFeatures(featureData);
      
      // Check user votes for each feature
      const votes: Record<string, boolean> = {};
      for (const feature of featureData) {
        votes[feature.id] = await hasUserVotedForFeature(feature.id);
      }
      setUserVotes(votes);
      
      setLoading(false);
    };
    
    loadFeatures();
  }, []);
  
  const handleVote = async (featureId: string) => {
    trackFeatureUse('vote_feature_request', { feature_id: featureId });
    
    const success = await voteForFeature(featureId);
    if (success) {
      // Update local state
      setUserVotes(prev => ({
        ...prev,
        [featureId]: !prev[featureId]
      }));
      
      // Update vote count in the UI
      setFeatures(prev => 
        prev.map(feature => {
          if (feature.id === featureId) {
            const voteChange = userVotes[featureId] ? -1 : 1;
            return {
              ...feature,
              votes: (feature.votes || 0) + voteChange
            };
          }
          return feature;
        })
      );
    }
  };
  
  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'reviewing':
        return <Clock className="h-4 w-4" />;
      case 'implemented':
        return <Check className="h-4 w-4" />;
      case 'declined':
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'reviewing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'implemented':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'declined':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Feature Requests</h2>
        <FeedbackButton />
      </div>
      
      {features.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No feature requests yet. Be the first to suggest one!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map(feature => (
            <Card key={feature.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{feature.content.split('\n')[0]}</CardTitle>
                  <Badge className={getStatusColor(feature.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(feature.status)}
                      <span>{feature.status || 'Pending'}</span>
                    </div>
                  </Badge>
                </div>
                <CardDescription>
                  {new Date(feature.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {feature.content.split('\n').slice(1).join('\n')}
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant={userVotes[feature.id] ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleVote(feature.id)}
                  className="flex items-center gap-1"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{feature.votes || 0}</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
