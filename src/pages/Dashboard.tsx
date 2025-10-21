import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingCart, BookOpen, Map, Users, MessageSquare, Bell, Loader2, Car, TrendingUp, Eye, ShoppingBag } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TrafficEmergencyDisplay from '@/components/user/TrafficEmergencyDisplay';
import FiresNearMe from '@/components/dashboard/fires';
import VehiclesTab from '@/components/profile/VehiclesTab';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/profile';
import { ErrorBoundary } from '@/components/error-boundary';
import { VehicleHeroBanner } from '@/components/dashboard/VehicleHeroBanner';
import { MobileAppCard } from '@/components/dashboard/MobileAppCard';
import { FeaturedVendors } from '@/components/dashboard/FeaturedVendors';
import { UnimogOwnerBadge } from '@/components/community/UnimogOwnerBadge';
import {
  useRecentActivity,
  useUpcomingTrips,
  useRecommendedItems,
  useUnreadMessages,
  useRecentMessages,
  useNotifications
} from '@/hooks/use-dashboard-data';

const Dashboard = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { user: authUser } = useAuth();
  const { userData, isLoading } = useProfile();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get the tab from URL parameter, default to 'activity'
  const activeTab = searchParams.get('tab') || 'activity';

  // Handle tab changes by updating the URL
  const handleTabChange = (value: string) => {
    if (value === 'activity') {
      // For the default tab, don't show the parameter
      navigate('/dashboard', { replace: true });
    } else {
      navigate(`/dashboard?tab=${value}`, { replace: true });
    }
  };
  
  // Build user data from profile and auth
  const user = {
    name: userData?.name || authUser?.email?.split('@')[0] || "User",
    avatarUrl: userData?.avatarUrl || "",
    unimogModel: userData?.unimogModel || "U1300L",
    memberSince: userData?.joinDate ? new Date(userData.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "Jan 2024",
    joinDate: userData?.joinDate || new Date().toISOString().split('T')[0],
    lastActive: t('dashboard:today')
  };
  
  // Fetch real data using React Query hooks
  const { data: recentActivity, isLoading: activityLoading } = useRecentActivity();
  const { data: recommendedItems, isLoading: itemsLoading } = useRecommendedItems();
  const { data: upcomingTrips, isLoading: tripsLoading } = useUpcomingTrips();
  const { data: unreadMessages = 0 } = useUnreadMessages();
  const { data: recentMessages, isLoading: messagesLoading } = useRecentMessages();
  const { data: notifications, isLoading: notificationsLoading } = useNotifications();

  return (
    <ErrorBoundary 
      fallback={
        <Layout isLoggedIn={true} user={user}>
          <div className="container py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('dashboard:error.title')}</h2>
                <p className="text-gray-600 mb-4">{t('dashboard:error.message')}</p>
                <Button onClick={() => window.location.reload()}>{t('dashboard:error.refresh')}</Button>
              </div>
            </div>
          </div>
        </Layout>
      }
    >
      <Layout isLoggedIn={true} user={user}>
        <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left sidebar - User info */}
          <div className="w-full lg:w-1/4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 flex-wrap">
                  {t('dashboard:welcome_back', { name: user.name.split(" ")[0] })}
                  <UnimogOwnerBadge model={user.unimogModel} size="md" />
                </CardTitle>
                <CardDescription>{t('dashboard:owner', { model: user.unimogModel })}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('dashboard:member_since')}</span>
                    <span className="text-sm font-medium">{user.memberSince}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('dashboard:last_active')}</span>
                    <span className="text-sm font-medium">{user.lastActive}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('dashboard:membership_status')}</span>
                    <span className="text-sm font-medium text-green-600">{t('dashboard:status_active')}</span>
                  </div>

                  <hr className="border-border" />

                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">{t('dashboard:quick_links')}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Link to="/profile">
                        <Button variant="outline" className="w-full justify-start text-sm">
                          {t('dashboard:my_profile')}
                        </Button>
                      </Link>
                      <Link to="/settings">
                        <Button variant="outline" className="w-full justify-start text-sm">
                          {t('dashboard:settings')}
                        </Button>
                      </Link>
                      <Link to="/my-listings">
                        <Button variant="outline" className="w-full justify-start text-sm">
                          {t('dashboard:my_listings')}
                        </Button>
                      </Link>
                      <Link to="/resources">
                        <Button variant="outline" className="w-full justify-start text-sm">
                          {t('dashboard:resources')}
                        </Button>
                      </Link>
                      <Link to="/unimog-u1700l">
                        <Button variant="outline" className="w-full justify-start text-sm">
                          My Garage
                        </Button>
                      </Link>
                      <Link to="/feedback">
                        <Button variant="outline" className="w-full justify-start text-sm">
                          {t('dashboard:feedback')}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{t('dashboard:notifications')}</CardTitle>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Bell size={16} />
                    <span className="sr-only">{t('dashboard:view_all_notifications')}</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notificationsLoading ? (
                    // Loading skeleton
                    Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full rounded-md" />
                    ))
                  ) : notifications && notifications.length > 0 ? (
                    notifications.slice(0, 4).map((notification, i) => (
                      <div key={notification.id || i} className="rounded-md bg-muted/50 p-3 text-sm space-y-1">
                        <div className="font-medium text-gray-900">{notification.title}</div>
                        <div className="text-gray-600">{notification.message}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(notification.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">{t('dashboard:no_new_notifications')}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Mobile App Card - Desktop only */}
            <div className="mt-6">
              <MobileAppCard />
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            {/* Vehicle Hero Banner */}
            <VehicleHeroBanner />

            {/* Showroom Feature Card */}
            <Card className="mb-6 bg-gradient-to-r from-military-green to-camo-brown text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Car className="h-6 w-6" />
                    <div>
                      <h2 className="text-lg font-bold">The Showroom</h2>
                      <p className="text-white/90 text-sm">
                        Browse community trucks, see builds and modifications, admire the pride and joy of fellow Unimog owners worldwide.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <Car className="h-3 w-3" />
                        <span>View Featured Builds</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>See All Photos</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>Latest Additions</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to="/shop">
                        <Button variant="outline" size="default" className="font-semibold whitespace-nowrap bg-white/10 hover:bg-white/20 border-white/20">
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          Shop
                        </Button>
                      </Link>
                      <Link to="/showcase">
                        <Button variant="secondary" size="default" className="font-semibold whitespace-nowrap">
                          Browse Showroom
                          <Car className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full mb-6">
                <TabsTrigger value="activity">{t('dashboard:tabs.activity')}</TabsTrigger>
                <TabsTrigger value="recommendations">{t('dashboard:tabs.recommendations')}</TabsTrigger>
                <TabsTrigger value="traffic">{t('dashboard:tabs.traffic')}</TabsTrigger>
                <TabsTrigger value="my-vehicles">{t('dashboard:tabs.my_vehicles')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="activity" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('dashboard:recent_activity.title')}</CardTitle>
                    <CardDescription>{t('dashboard:recent_activity.description')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activityLoading ? (
                        // Loading skeleton
                        Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="flex items-start">
                            <Skeleton className="h-5 w-5 rounded-full mr-4 mt-1" />
                            <div className="flex-1">
                              <Skeleton className="h-4 w-3/4 mb-1" />
                              <Skeleton className="h-3 w-1/4" />
                            </div>
                          </div>
                        ))
                      ) : recentActivity && recentActivity.length > 0 ? (
                        recentActivity.map((activity, i) => (
                          <div key={i} className="flex items-start">
                            <div className="mr-4 mt-1">
                              {activity.type === 'forum' && <Users size={18} className="text-unimog-600" />}
                              {activity.type === 'marketplace' && <ShoppingCart size={18} className="text-terrain-600" />}
                              {activity.type === 'knowledge' && <BookOpen size={18} className="text-blue-600" />}
                              {activity.type === 'message' && <MessageSquare size={18} className="text-green-600" />}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{activity.title}</p>
                              <p className="text-xs text-muted-foreground">{activity.time}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-sm text-muted-foreground">{t('dashboard:recent_activity.no_activity')}</p>
                          <Link to="/community" className="text-sm text-primary hover:underline mt-2 inline-block">
                            {t('dashboard:recent_activity.join_conversation')}
                          </Link>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <FeaturedVendors />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('dashboard:upcoming_trips.title')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {tripsLoading ? (
                        // Loading skeleton
                        <div className="space-y-4">
                          {Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="border rounded-md p-3">
                              <div className="flex justify-between items-start">
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-5 w-20 rounded-full" />
                              </div>
                              <Skeleton className="h-3 w-1/3 mt-2" />
                              <div className="flex justify-between mt-2">
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="h-3 w-12" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : upcomingTrips && upcomingTrips.length > 0 ? (
                        <div className="space-y-4">
                          {upcomingTrips.map((trip, i) => (
                            <div key={i} className="border rounded-md p-3">
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium">{trip.title}</h4>
                                <div className="text-xs px-2 py-1 rounded-full bg-muted">
                                  {trip.difficulty}
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{trip.date}</p>
                              <div className="flex justify-between mt-2 text-xs">
                                <span>{trip.participants} {t('dashboard:upcoming_trips.participants')}</span>
                                <Link to={`/trips/${trip.id}`} className="text-primary hover:underline">{t('dashboard:upcoming_trips.details')}</Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <Map className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                          <h3 className="font-medium mb-1">{t('dashboard:upcoming_trips.no_trips')}</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {t('dashboard:upcoming_trips.description')}
                          </p>
                          <Link to="/trips">
                            <Button>{t('dashboard:upcoming_trips.explore_trips')}</Button>
                          </Link>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{t('dashboard:messages.title')}</CardTitle>
                        {unreadMessages > 0 && (
                          <div className="rounded-full bg-primary w-6 h-6 flex items-center justify-center text-xs text-white">
                            {unreadMessages}
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {messagesLoading ? (
                          // Loading skeleton
                          Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="border rounded-md p-3">
                              <div className="flex justify-between">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-16" />
                              </div>
                              <Skeleton className="h-3 w-full mt-2" />
                            </div>
                          ))
                        ) : recentMessages && recentMessages.length > 0 ? (
                          <>
                            {recentMessages.map((msg, i) => (
                              <div key={i} className="border rounded-md p-3">
                                <div className="flex justify-between">
                                  <h4 className="font-medium">{msg.senderName}</h4>
                                  <span className="text-xs text-muted-foreground">{msg.time}</span>
                                </div>
                                <p className="text-sm mt-1 truncate">{msg.preview}</p>
                              </div>
                            ))}
                            <div className="text-center mt-4">
                              <Link to="/messages">
                                <Button variant="outline">{t('dashboard:messages.view_all')}</Button>
                              </Link>
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-4">
                            <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">{t('dashboard:messages.no_messages')}</p>
                            <Link to="/community" className="text-sm text-primary hover:underline mt-2 inline-block">
                              {t('dashboard:messages.connect')}
                            </Link>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="recommendations">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('dashboard:recommendations.title')}</CardTitle>
                    <CardDescription>{t('dashboard:recommendations.description', { model: user.unimogModel })}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {itemsLoading ? (
                        // Loading skeleton
                        Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="border rounded-md overflow-hidden">
                            <Skeleton className="aspect-video" />
                            <div className="p-3">
                              <Skeleton className="h-4 w-3/4 mb-2" />
                              <div className="flex justify-between mt-2">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-24" />
                              </div>
                              <Skeleton className="h-8 w-full mt-3" />
                            </div>
                          </div>
                        ))
                      ) : recommendedItems && recommendedItems.length > 0 ? (
                        recommendedItems.slice(0, 3).map((item, i) => (
                          <div key={i} className="border rounded-md overflow-hidden">
                            <div className="aspect-video bg-muted flex items-center justify-center">
                              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div className="p-3">
                              <h4 className="font-medium">{item.title}</h4>
                              <div className="flex justify-between mt-2">
                                <p className="font-medium text-sm">{item.price}</p>
                                <p className="text-sm text-muted-foreground">{item.seller}</p>
                              </div>
                              <Link to={`/marketplace/listings/${item.id}`}>
                                <Button className="w-full mt-3" size="sm">{t('dashboard:recommendations.view_details')}</Button>
                              </Link>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-3 text-center py-8">
                          <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                          <h3 className="font-medium mb-2">{t('dashboard:recommendations.no_recommendations')}</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            {t('dashboard:recommendations.check_marketplace')}
                          </p>
                          <Link to="/marketplace">
                            <Button>{t('dashboard:recommendations.browse_marketplace')}</Button>
                          </Link>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-4">{t('dashboard:knowledge_picks.title')}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-md p-4">
                          <h4 className="font-medium">{t('dashboard:knowledge_picks.u1700l_manual.title')}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {t('dashboard:knowledge_picks.u1700l_manual.description')}
                          </p>
                          <div className="flex justify-between items-center mt-3">
                            <span className="text-xs text-muted-foreground">1,185 {t('dashboard:knowledge_picks.u1700l_manual.sections')}</span>
                            <Link to="/knowledge" className="text-primary text-sm hover:underline">{t('dashboard:knowledge_picks.browse')}</Link>
                          </div>
                        </div>
                        <div className="border rounded-md p-4">
                          <h4 className="font-medium">{t('dashboard:knowledge_picks.light_repair.title')}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {t('dashboard:knowledge_picks.light_repair.description')}
                          </p>
                          <div className="flex justify-between items-center mt-3">
                            <span className="text-xs text-muted-foreground">453 {t('dashboard:knowledge_picks.light_repair.sections')}</span>
                            <Link to="/knowledge" className="text-primary text-sm hover:underline">{t('dashboard:knowledge_picks.browse')}</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="traffic" className="space-y-6">
                <TrafficEmergencyDisplay />
                <FiresNearMe />
              </TabsContent>
              
              <TabsContent value="my-vehicles">
                <VehiclesTab userData={user} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      </Layout>
    </ErrorBoundary>
  );
};

export default Dashboard;
