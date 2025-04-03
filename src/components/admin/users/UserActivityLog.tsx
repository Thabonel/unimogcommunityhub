
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ActivityLogProps {
  userId: string | undefined;
}

interface ActivityItem {
  id: string;
  event_type: string;
  timestamp: string;
  event_data: Record<string, any>;
  page?: string;
}

export function UserActivityLog({ userId }: ActivityLogProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useQuery({
    queryKey: ["userActivity", userId, page],
    queryFn: async () => {
      // In a real app, this would fetch activity data from your backend
      // For now, we'll just create some mock data
      const mockData: ActivityItem[] = [
        {
          id: "1",
          event_type: "login",
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          event_data: {},
          page: "/login"
        },
        {
          id: "2",
          event_type: "page_view",
          timestamp: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
          event_data: { content_type: "article", content_id: "123" },
          page: "/articles/123"
        },
        {
          id: "3",
          event_type: "comment",
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          event_data: { post_id: "456", comment_content: "Great post!" },
          page: "/community/post/456"
        },
        {
          id: "4",
          event_type: "post_like",
          timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
          event_data: { post_id: "789" },
          page: "/community/post/789"
        },
        {
          id: "5",
          event_type: "profile_update",
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          event_data: { fields_updated: ["avatar_url", "display_name"] },
          page: "/profile/settings"
        }
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockData;
    },
    enabled: !!userId
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        Error loading activity data
      </div>
    );
  }
  
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 flex flex-col items-center gap-2">
        <Activity className="h-8 w-8 text-muted-foreground" />
        <p className="text-muted-foreground">No activity recorded for this user.</p>
      </div>
    );
  }

  const getEventLabel = (eventType: string) => {
    const eventLabels: Record<string, { label: string, variant: string }> = {
      login: { label: "Login", variant: "default" },
      page_view: { label: "Page View", variant: "secondary" },
      comment: { label: "Comment", variant: "success" },
      post_like: { label: "Like", variant: "secondary" },
      profile_update: { label: "Profile Update", variant: "outline" },
      logout: { label: "Logout", variant: "default" }
    };
    
    return eventLabels[eventType] || { label: eventType, variant: "outline" };
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">Recent Activity</h3>
      </div>
      
      <div className="space-y-4">
        {data.map(activity => {
          const eventInfo = getEventLabel(activity.event_type);
          return (
            <div key={activity.id} className="flex gap-3 items-start border-l-2 border-muted pl-4 py-1">
              <div className="text-sm text-muted-foreground min-w-[120px]">
                {format(new Date(activity.timestamp), "h:mm a")}
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <Badge variant={eventInfo.variant as any}>{eventInfo.label}</Badge>
                  {activity.page && (
                    <span className="text-xs text-muted-foreground">{activity.page}</span>
                  )}
                </div>
                {activity.event_data && Object.keys(activity.event_data).length > 0 && (
                  <div className="mt-1 text-sm">
                    {activity.event_type === "comment" && (
                      <p className="text-sm italic">"{activity.event_data.comment_content}"</p>
                    )}
                    {activity.event_type === "profile_update" && (
                      <p className="text-sm">
                        Updated: {activity.event_data.fields_updated.join(", ")}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
