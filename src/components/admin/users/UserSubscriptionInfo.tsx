
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CalendarIcon, CreditCard } from "lucide-react";

interface UserSubscriptionInfoProps {
  subscription: {
    id: string;
    user_id: string;
    subscription_level: string;
    is_active: boolean;
    starts_at: string;
    expires_at: string | null;
    created_at: string;
  } | null;
}

export function UserSubscriptionInfo({ subscription }: UserSubscriptionInfoProps) {
  if (!subscription) {
    return (
      <div className="text-center py-2">
        <Badge variant="outline">Free User</Badge>
        <p className="text-xs text-muted-foreground mt-2">
          No active subscription
        </p>
        <Button variant="outline" size="sm" className="mt-4 w-full">
          <CreditCard className="mr-2 h-4 w-4" />
          Add Subscription
        </Button>
      </div>
    );
  }

  const isTrial = subscription.subscription_level === 'trial';
  const isExpired = subscription.expires_at && new Date(subscription.expires_at) < new Date();
  
  // Calculate subscription progress (for trials or time-limited subscriptions)
  let progressPercent = 0;
  let daysRemaining = 0;
  
  if (subscription.expires_at) {
    const startDate = new Date(subscription.starts_at);
    const endDate = new Date(subscription.expires_at);
    const currentDate = new Date();
    
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsed = currentDate.getTime() - startDate.getTime();
    
    progressPercent = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
    
    const msPerDay = 1000 * 60 * 60 * 24;
    daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - currentDate.getTime()) / msPerDay));
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge variant={isTrial ? "secondary" : isExpired ? "outline" : "default"}>
          {isTrial ? "Trial" : subscription.subscription_level}
        </Badge>
        <Badge variant={subscription.is_active ? "success" : "destructive"}>
          {subscription.is_active ? "Active" : "Inactive"}
        </Badge>
      </div>
      
      {subscription.expires_at && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Progress</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} />
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center text-muted-foreground">
              <CalendarIcon className="mr-1 h-3 w-3" />
              Started {format(new Date(subscription.starts_at), "MMM d, yyyy")}
            </span>
            
            {isExpired ? (
              <span className="text-destructive">
                Expired
              </span>
            ) : (
              <span>
                {daysRemaining} days left
              </span>
            )}
          </div>
        </div>
      )}
      
      <div className="pt-2 text-xs text-muted-foreground">
        {subscription.expires_at ? (
          <>
            {isExpired ? (
              <span>Expired on {format(new Date(subscription.expires_at), "MMM d, yyyy")}</span>
            ) : (
              <span>Expires on {format(new Date(subscription.expires_at), "MMM d, yyyy")}</span>
            )}
          </>
        ) : (
          <span>No expiration date</span>
        )}
      </div>
      
      <div className="flex gap-2 pt-2">
        <Button variant="outline" size="sm" className="flex-1">
          Edit
        </Button>
        {isExpired && (
          <Button size="sm" className="flex-1">
            Renew
          </Button>
        )}
      </div>
    </div>
  );
}
