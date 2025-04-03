
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Edit, FileText, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getUserProfile } from "@/services/userProfileService";
import { getUserSubscription } from "@/services/subscriptionService";
import { UserActivityLog } from "./UserActivityLog";
import { UserSubscriptionInfo } from "./UserSubscriptionInfo";

export default function UserDetailView() {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      if (!userId) return;
      
      setLoading(true);
      try {
        // Load profile data
        const profileData = await getUserProfile(userId);
        setProfile(profileData);
        
        // Load subscription data
        const subscriptionData = await getUserSubscription(userId);
        setSubscription(subscriptionData);
      } catch (err) {
        console.error("Error loading user data:", err);
        setError("Failed to load user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [userId]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-destructive text-lg mb-4">{error || "User not found"}</div>
        <Button asChild>
          <Link to="/admin"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Admin Dashboard</Link>
        </Button>
      </div>
    );
  }

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link to="/admin"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Link>
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-7">
        {/* Left sidebar with profile information */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">User Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.avatar_url || ""} alt={profile.display_name || "User"} />
                  <AvatarFallback className="text-lg">
                    {getInitials(profile.display_name || profile.full_name || profile.email)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="text-center space-y-1">
                  <h3 className="font-medium text-lg">
                    {profile.display_name || profile.full_name || "Unnamed User"}
                  </h3>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                  
                  {profile.is_admin && (
                    <Badge variant="purple" className="mt-2">
                      Admin
                    </Badge>
                  )}
                  
                  {profile.banned_until && (
                    <Badge variant="destructive" className="mt-1">
                      Banned until {format(new Date(profile.banned_until), "MMM d, yyyy")}
                    </Badge>
                  )}
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Member since:</dt>
                  <dd>{format(new Date(profile.created_at), "MMM d, yyyy")}</dd>
                </div>
                
                {profile.location && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Location:</dt>
                    <dd>{profile.location}</dd>
                  </div>
                )}
                
                {profile.unimog_model && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Unimog Model:</dt>
                    <dd>{profile.unimog_model}</dd>
                  </div>
                )}
                
                {profile.unimog_year && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Unimog Year:</dt>
                    <dd>{profile.unimog_year}</dd>
                  </div>
                )}
              </dl>
              
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" size="sm" className="w-full">
                  <Edit className="mr-2 h-3 w-3" /> Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Subscription card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <UserSubscriptionInfo subscription={subscription} />
            </CardContent>
          </Card>
        </div>
        
        {/* Main content area with tabs */}
        <div className="md:col-span-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">User Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="activity">
                <TabsList className="mb-4">
                  <TabsTrigger value="activity">
                    <Clock className="mr-2 h-4 w-4" />
                    Activity
                  </TabsTrigger>
                  <TabsTrigger value="profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="content">
                    <FileText className="mr-2 h-4 w-4" />
                    Content
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="activity" className="space-y-4">
                  <UserActivityLog userId={userId} />
                </TabsContent>
                
                <TabsContent value="profile" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Contact Info */}
                    <div className="space-y-3">
                      <h3 className="text-md font-medium">Contact Information</h3>
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                          <dd>{profile.email}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                          <dd>{profile.phone_number || "Not provided"}</dd>
                        </div>
                      </dl>
                    </div>
                    
                    {/* Address Info */}
                    <div className="space-y-3">
                      <h3 className="text-md font-medium">Address</h3>
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Street</dt>
                          <dd>{profile.street_address || "Not provided"}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">City/State</dt>
                          <dd>
                            {profile.city && profile.state 
                              ? `${profile.city}, ${profile.state}` 
                              : "Not provided"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Country</dt>
                          <dd>{profile.country || "Not provided"}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                  
                  {/* Bio/About */}
                  <div className="mt-4 pt-4 border-t">
                    <h3 className="text-md font-medium mb-2">Bio</h3>
                    <p className="text-sm">{profile.bio || "No bio provided."}</p>
                  </div>
                  
                  {/* Unimog Information */}
                  {(profile.unimog_model || profile.unimog_year || profile.unimog_modifications) && (
                    <div className="mt-4 pt-4 border-t">
                      <h3 className="text-md font-medium mb-2">Unimog Information</h3>
                      <dl className="space-y-2">
                        {profile.unimog_model && (
                          <div>
                            <dt className="text-sm font-medium text-muted-foreground">Model</dt>
                            <dd>{profile.unimog_model}</dd>
                          </div>
                        )}
                        {profile.unimog_year && (
                          <div>
                            <dt className="text-sm font-medium text-muted-foreground">Year</dt>
                            <dd>{profile.unimog_year}</dd>
                          </div>
                        )}
                        {profile.unimog_modifications && (
                          <div>
                            <dt className="text-sm font-medium text-muted-foreground">Modifications</dt>
                            <dd>{profile.unimog_modifications}</dd>
                          </div>
                        )}
                        {profile.experience_level && (
                          <div>
                            <dt className="text-sm font-medium text-muted-foreground">Experience Level</dt>
                            <dd>{profile.experience_level}</dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="content" className="space-y-4">
                  <p className="text-muted-foreground">User content will appear here.</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
