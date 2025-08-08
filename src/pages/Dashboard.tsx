import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ShoppingCart, BookOpen, Map, Users, MessageSquare, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import TrafficEmergencyDisplay from '@/components/user/TrafficEmergencyDisplay';
import FiresNearMe from '@/components/dashboard/fires';
import VehiclesTab from '@/components/profile/VehiclesTab';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/profile';

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
  
  // Mock activity data
  const recentActivity = [
    { type: "forum", title: "Replied to: Fuel pump issues on U1300", time: "2 hours ago" },
    { type: "marketplace", title: "New listing: Original headlights for 406", time: "Yesterday" },
    { type: "knowledge", title: "Added repair guide: Replacing transfer case seals", time: "2 days ago" },
    { type: "message", title: "Message from Mark about upcoming trip", time: "3 days ago" },
  ];
  
  // Mock recommended items
  const recommendedItems = [
    { type: "part", title: "Transfer Case Rebuild Kit", price: "$895", seller: "Off-road Specialists" },
    { type: "accessory", title: "Heavy Duty Winch Mount", price: "$350", seller: "Expedition Gear" },
    { type: "tool", title: "Hydraulic System Pressure Tester", price: "$215", seller: "Unimog Tools" },
  ];
  
  // Mock upcoming trips
  const upcomingTrips = [
    { title: "Black Forest Expedition", date: "Aug 15-18, 2023", difficulty: "Moderate", participants: 8 },
    { title: "Alpine Mountain Pass Run", date: "Sep 10-12, 2023", difficulty: "Challenging", participants: 5 },
  ];
  
  // Mock unread messages count
  const [unreadMessages] = useState(3);
  
  // Mock notifications
  const notifications = [
    "Mark C. commented on your marketplace listing",
    "New route added near your location: Alpine Forest Trail",
    "Sarah liked your repair guide on hydraulic systems",
    "Unimog Newsletter: August Edition available",
  ];

  return (
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
                  {notifications.map((notification, i) => (
                    <div key={i} className="rounded-md bg-muted/50 p-3 text-sm">
                      {notification}
                    </div>
                  ))}
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
                      {recentActivity.map((activity, i) => (
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
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Upcoming Trips</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {upcomingTrips.length > 0 ? (
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
                                <Link to="/trips" className="text-primary hover:underline">Details</Link>
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
                          <Link to="/trips/create">
                            <Button>Plan a Trip</Button>
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
                        <div className="border rounded-md p-3">
                          <div className="flex justify-between">
                            <h4 className="font-medium">Mark Cooper</h4>
                            <span className="text-xs text-muted-foreground">1 day ago</span>
                          </div>
                          <p className="text-sm mt-1 truncate">Hey, I was wondering about the Moab trip details...</p>
                        </div>
                        <div className="border rounded-md p-3">
                          <div className="flex justify-between">
                            <h4 className="font-medium">Sarah Kim</h4>
                            <span className="text-xs text-muted-foreground">2 days ago</span>
                          </div>
                          <p className="text-sm mt-1 truncate">Thanks for the parts recommendation, it worked!</p>
                        </div>
                        <div className="text-center mt-4">
                          <Link to="/messages">
                            <Button variant="outline">View All Messages</Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Add Fires Near Me below the existing content */}
                <div className="mt-6">
                  <FiresNearMe />
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
                      {recommendedItems.map((item, i) => (
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
                            <Button className="w-full mt-3" size="sm">View Details</Button>
                          </div>
                        </div>
                      ))}
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
  );
};

export default Dashboard;
