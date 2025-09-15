
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FeatureRequests } from '@/components/feedback/FeatureRequests';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MessageSquarePlus, UserCheck, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { Feedback as FeedbackType, getUserFeedback } from '@/services/feedbackService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAnalytics } from '@/hooks/use-analytics';

export default function Feedback() {
  const { user } = useAuth();
  const [userFeedback, setUserFeedback] = useState<FeedbackType[]>([]);
  const [loading, setLoading] = useState(true);
  const { trackFeatureUse } = useAnalytics();

  useEffect(() => {
    // Track page view using analytics hook
    trackFeatureUse('view_feedback_page');

    const loadUserFeedback = async () => {
      if (user) {
        setLoading(true);
        const feedback = await getUserFeedback();
        setUserFeedback(feedback);
        setLoading(false);
      }
    };

    loadUserFeedback();
  }, [user, trackFeatureUse]);

  return (
    <Layout isLoggedIn={!!user}>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Feedback Center</h1>

        <Alert className="mb-6 bg-blue-50 dark:bg-blue-900/20">
          <MessageSquarePlus className="h-4 w-4" />
          <AlertTitle>We value your input!</AlertTitle>
          <AlertDescription>
            Help us improve by sharing your thoughts, reporting issues, or voting on feature requests.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="feature-requests" className="space-y-6">
          <TabsList>
            <TabsTrigger value="feature-requests" onClick={() => trackFeatureUse('tab_feature_requests')}>
              Feature Requests
            </TabsTrigger>
            <TabsTrigger value="my-feedback" onClick={() => trackFeatureUse('tab_my_feedback')}>
              My Feedback
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="feature-requests">
            <FeatureRequests />
          </TabsContent>
          
          <TabsContent value="my-feedback">
            {!user ? (
              <Alert>
                <AlertTitle>Authentication Required</AlertTitle>
                <AlertDescription>
                  Please sign in to view your feedback history.
                </AlertDescription>
              </Alert>
            ) : loading ? (
              <div className="flex justify-center p-8">
                <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : userFeedback.length === 0 ? (
              <Alert>
                <AlertTitle>No feedback yet</AlertTitle>
                <AlertDescription>
                  You haven't submitted any feedback yet. Your feedback will appear here once submitted.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {userFeedback.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <div className="flex justify-between">
                        <div>
                          <CardTitle className="capitalize">{item.type.replace('_', ' ')}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            {new Date(item.created_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.admin_response && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                              <UserCheck className="h-3 w-3 mr-1" />
                              Responded
                            </Badge>
                          )}
                          {item.status && (
                            <Badge variant={item.status === 'implemented' ? 'default' : 'outline'}>
                              {item.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Original feedback content */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Your Feedback:</h4>
                        <p className="text-gray-700 dark:text-gray-300">{item.content}</p>
                      </div>

                      {/* Rating display */}
                      {item.rating && (
                        <div className="flex items-center">
                          <span className="text-sm text-muted-foreground mr-2">Your Rating:</span>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={`text-lg ${i < item.rating! ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Admin response section */}
                      {item.admin_response && (
                        <div className="border-t pt-4 mt-4">
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <UserCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                                Response from Admin
                              </h4>
                              {item.admin_response_date && (
                                <span className="text-xs text-blue-600 dark:text-blue-400 ml-auto">
                                  {new Date(item.admin_response_date).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                              {item.admin_response}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
