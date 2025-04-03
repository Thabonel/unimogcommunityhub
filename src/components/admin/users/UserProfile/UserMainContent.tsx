
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, User, FileText } from "lucide-react";
import { UserActivityLog } from "../UserActivityLog";
import { UserProfileTab } from "./UserProfileTab";
import { UserContentTab } from "./UserContentTab";
import { UserProfile } from "@/types/user";

interface UserMainContentProps {
  profile: UserProfile;
  userId: string | undefined;
}

export function UserMainContent({ profile, userId }: UserMainContentProps) {
  return (
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
            <UserProfileTab profile={profile} />
          </TabsContent>
          
          <TabsContent value="content" className="space-y-4">
            <UserContentTab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
