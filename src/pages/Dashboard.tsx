import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingCart, BookOpen, Map, Users, MessageSquare, Bell, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import TrafficEmergencyDisplay from '@/components/user/TrafficEmergencyDisplay';
import FiresNearMe from '@/components/dashboard/fires';
import VehiclesTab from '@/components/profile/VehiclesTab';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/profile';
import { ErrorBoundary } from '@/components/error-boundary';
import {
  useRecentActivity,
  useUpcomingTrips,
  useRecommendedItems,
  useUnreadMessages,
  useRecentMessages,
  useNotifications
} from '@/hooks/use-dashboard-data';

const Dashboard = () => {
  const { user: authUser } = useAuth();
  const { userData, isLoading } = useProfile();
  
  // Build user data from profile and auth
  const user = {
    name: userData?.name || authUser?.email?.split('@')[0] || "User",
    avatarUrl: userData?.avatarUrl || "",
    unimogModel: userData?.unimogModel || "U1300L",
    memberSince: userData?.joinDate ? new Date(userData.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "Jan 2024",
    joinDate: userData?.joinDate || new Date().toISOString().split('T')[0],
    lastActive: "Today"
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
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Dashboard Error</h2>
                <p className="text-gray-600 mb-4">Unable to load your dashboard. Please try refreshing the page.</p>
                <Button onClick={() => window.location.reload()}>Refresh Dashboard</Button>
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
                <CardTitle>Welcome back, {user.name.split(" ")[0]}</CardTitle>
                <CardDescription>{user.unimogModel} Owner</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Member since</span>
                    <span className="text-sm font-medium">{user.memberSince}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last active</span>
                    <span className="text-sm font-medium">{user.lastActive}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Membership status</span>
                    <span className="text-sm font-medium text-green-600">Active</span>
                  </div>
                  
                  <hr className="border-border" />
                  
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Quick Links</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Link to="/profile">
                        <Button variant="outline" className="w-full justify-start text-sm">
                          My Profile
                        </Button>
                      </Link>
                      <Link to="/settings">
                        <Button variant="outline" className="w-full justify-start text-sm">
                          Settings
                        </Button>
                      </Link>
                      <Link to="/my-listings">
                        <Button variant="outline" className="w-full justify-start text-sm">
                          My Listings
                        </Button>
                      </Link>
                      <Link to="/saved">
                        <Button variant="outline" className="w-full justify-start text-sm">
                          Saved Items
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
                  <CardTitle>Notifications</CardTitle>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Bell size={16} />
                    <span className="sr-only">View all notifications</span>
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
                      <div key={i} className="rounded-md bg-muted/50 p-3 text-sm">
                        {notification}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No new notifications</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            <Tabs defaultValue="activity">
              <TabsList className="grid grid-cols-4 w-full mb-6">
                <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                <TabsTrigger value="recommendations">For You</TabsTrigger>
                <TabsTrigger value="traffic">Traffic & Alerts</TabsTrigger>
                <TabsTrigger value="my-vehicles">My Vehicles</TabsTrigger>
              </TabsList>
              
              <TabsContent value="activity" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your recent interactions across the community</CardDescription>
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
                          <p className="text-sm text-muted-foreground">No recent activity</p>
                          <Link to="/community" className="text-sm text-primary hover:underline mt-2 inline-block">
                            Join the conversation
                          </Link>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Upcoming Trips</CardTitle>
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
                                <span>{trip.participants} participants</span>
                                <Link to={`/trips/${trip.id}`} className="text-primary hover:underline">Details</Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <Map className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                          <h3 className="font-medium mb-1">No upcoming trips</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Plan an off-road adventure with fellow Unimog owners.
                          </p>
                          <Link to="/trips">
                            <Button>Explore Trips</Button>
                          </Link>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Messages</CardTitle>
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
                                <Button variant="outline">View All Messages</Button>
                              </Link>
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-4">
                            <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">No messages yet</p>
                            <Link to="/community" className="text-sm text-primary hover:underline mt-2 inline-block">
                              Connect with the community
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
                    <CardTitle>Recommended for Your Unimog</CardTitle>
                    <CardDescription>Parts and accessories matched to your U1300L</CardDescription>
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
                                <Button className="w-full mt-3" size="sm">View Details</Button>
                              </Link>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-3 text-center py-8">
                          <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                          <h3 className="font-medium mb-2">No recommendations yet</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Check out the marketplace for parts and accessories
                          </p>
                          <Link to="/marketplace">
                            <Button>Browse Marketplace</Button>
                          </Link>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-4">Knowledge Base Picks</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-md p-4">
                          <h4 className="font-medium">U1300 Maintenance Guide</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Comprehensive maintenance schedule and procedures for your model.
                          </p>
                          <div className="flex justify-between items-center mt-3">
                            <span className="text-xs text-muted-foreground">134 views</span>
                            <Link to="/knowledge" className="text-primary text-sm hover:underline">View</Link>
                          </div>
                        </div>
                        <div className="border rounded-md p-4">
                          <h4 className="font-medium">Winch Installation Tutorial</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Step-by-step guide with video for front winch installation.
                          </p>
                          <div className="flex justify-between items-center mt-3">
                            <span className="text-xs text-muted-foreground">87 views</span>
                            <Link to="/knowledge" className="text-primary text-sm hover:underline">View</Link>
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
