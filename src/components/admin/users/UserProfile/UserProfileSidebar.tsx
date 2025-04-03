
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Edit } from "lucide-react";
import { format } from "date-fns";
import { UserSubscriptionInfo } from "../UserSubscriptionInfo";
import { UserProfile } from "@/types/user";

interface UserProfileSidebarProps {
  profile: UserProfile;
  subscription: any;
}

export function UserProfileSidebar({ profile, subscription }: UserProfileSidebarProps) {
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  return (
    <>
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
                <Badge variant="secondary" className="mt-2">
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
    </>
  );
}
