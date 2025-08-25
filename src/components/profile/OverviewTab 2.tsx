
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface OverviewTabProps {
  userData?: {
    about: string;
    location: string;
    unimogModel: string;
    website?: string;
  };
}

const OverviewTab = ({ userData }: OverviewTabProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>About Me</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {userData?.about || "No bio provided yet."}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4">
            <div>
              <h4 className="text-sm font-semibold mb-1">Location</h4>
              <p className="text-muted-foreground">{userData?.location || "Not specified"}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-1">Unimog Model</h4>
              <p className="text-muted-foreground">{userData?.unimogModel || "Not specified"}</p>
            </div>
            
            {userData?.website && (
              <div>
                <h4 className="text-sm font-semibold mb-1">Website</h4>
                <a 
                  href={userData.website.startsWith('http') ? userData.website : `https://${userData.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {userData.website}
                </a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <div>
                <p className="text-sm font-medium">Updated vehicle information</p>
                <p className="text-xs text-muted-foreground">3 days ago</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <div>
                <p className="text-sm font-medium">Commented on a maintenance post</p>
                <p className="text-xs text-muted-foreground">1 week ago</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-orange-500"></div>
              <div>
                <p className="text-sm font-medium">Added new vehicle photos</p>
                <p className="text-xs text-muted-foreground">2 weeks ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;
