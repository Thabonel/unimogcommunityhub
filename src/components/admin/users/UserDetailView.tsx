
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { getUserProfile } from "@/services/userProfileService";
import { getUserSubscription } from "@/services/subscriptionService";
import { UserProfileSidebar } from "./UserProfile/UserProfileSidebar";
import { UserMainContent } from "./UserProfile/UserMainContent";

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
          <UserProfileSidebar profile={profile} subscription={subscription} />
        </div>
        
        {/* Main content area with tabs */}
        <div className="md:col-span-5">
          <UserMainContent profile={profile} userId={userId} />
        </div>
      </div>
    </div>
  );
}
