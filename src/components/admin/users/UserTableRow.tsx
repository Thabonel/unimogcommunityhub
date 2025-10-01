
import { format } from "date-fns";
import { Ban, UserCheck, Shield, ShieldOff, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface UserTableRowProps {
  user: {
    id: string;
    email: string;
    created_at: string;
    last_sign_in_at: string | null;
    banned_until: string | null;
    is_admin?: boolean;
    subscription?: {
      level: string;
      is_active: boolean;
      is_trial: boolean;
      expires_at: string | null;
      is_free_access?: boolean;
      free_access_reason?: string;
    };
  };
  onBan: (userId: string) => void;
  onUnban: (userId: string) => void;
  onDelete: (userId: string) => void;
  onToggleAdmin: (userId: string, makeAdmin: boolean) => void;
  isSelected: boolean;
  onSelectChange: (checked: boolean) => void;
  onViewDetails: () => void;
}

export function UserTableRow({
  user,
  onBan,
  onUnban,
  onDelete,
  onToggleAdmin,
  isSelected,
  onSelectChange,
  onViewDetails
}: UserTableRowProps) {

  // Helper function to determine subscription type label
  const getSubscriptionTypeLabel = (subscription: any) => {
    if (!subscription) return 'Trial';

    // Type 1: Trial users (30-day trial)
    if (subscription.is_trial && subscription.trial_ends_at) {
      const trialEnd = new Date(subscription.trial_ends_at);
      const today = new Date();
      if (trialEnd > today) {
        return `Trial (ends ${format(trialEnd, 'MMM d')})`;
      }
      return 'Trial Expired';
    }

    // Type 2: Admin-granted free premium (forever)
    if (subscription.is_free_access && subscription.subscription_type === 'premium') {
      return 'Free Premium (Admin)';
    }

    // Type 3: Paid lifetime members ($500)
    if (subscription.subscription_type === 'premium' && subscription.stripe_customer_id && !subscription.is_free_access) {
      return 'Lifetime Member';
    }

    // Fallback for edge cases
    return 'Trial';
  };
  return (
    <TableRow key={user.id}>
      <TableCell className="py-2">
        <Checkbox 
          checked={isSelected}
          onCheckedChange={onSelectChange}
          aria-label={`Select user ${user.email}`}
        />
      </TableCell>
      
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          {user.email}
          <Button variant="ghost" size="icon" onClick={onViewDetails} title="View user details">
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </TableCell>
      
      <TableCell>
        {format(new Date(user.created_at), 'MMM d, yyyy')}
      </TableCell>
      
      <TableCell>
        {user.last_sign_in_at 
          ? format(new Date(user.last_sign_in_at), 'MMM d, yyyy') 
          : 'Never'}
      </TableCell>
      
      <TableCell>
        {user.banned_until ? (
          <Badge variant="destructive">
            Banned until {format(new Date(user.banned_until), 'MMM d, yyyy')}
          </Badge>
        ) : (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            Active
          </Badge>
        )}
      </TableCell>
      
      <TableCell>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              {(() => {
                const subscriptionType = getSubscriptionTypeLabel(user.subscription);

                // Type 1: Trial users - Orange badge
                if (subscriptionType.startsWith('Trial')) {
                  return (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-800/30 dark:text-orange-400">
                      {subscriptionType}
                    </Badge>
                  );
                }

                // Type 2: Free Premium (Admin) - Green badge
                if (subscriptionType === 'Free Premium (Admin)') {
                  return (
                    <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">
                      Free Premium (Admin)
                    </Badge>
                  );
                }

                // Type 3: Lifetime Member - Gold badge
                if (subscriptionType === 'Lifetime Member') {
                  return (
                    <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">
                      Lifetime Member
                    </Badge>
                  );
                }

                // Fallback
                return (
                  <Badge variant="outline" className="text-gray-600 dark:text-gray-400">
                    {subscriptionType}
                  </Badge>
                );
              })()}
            </TooltipTrigger>
            <TooltipContent>
              {user.subscription ? (
                <div>
                  {user.subscription.is_free_access ? (
                    <>
                      <p>Admin-granted free premium access</p>
                      <p>Reason: {user.subscription.free_access_reason || 'No reason provided'}</p>
                      <p>Permanent access - no expiration</p>
                    </>
                  ) : user.subscription.stripe_customer_id ? (
                    <>
                      <p>Paid lifetime member</p>
                      <p>Payment verified via Stripe</p>
                      <p>Permanent access - no expiration</p>
                    </>
                  ) : user.subscription.is_trial && user.subscription.trial_ends_at ? (
                    <>
                      <p>30-day trial period</p>
                      <p>Expires: {format(new Date(user.subscription.trial_ends_at), 'MMM d, yyyy')}</p>
                      <p>Days remaining: {Math.ceil((new Date(user.subscription.trial_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}</p>
                    </>
                  ) : (
                    <>
                      <p>Trial user</p>
                      <p>Status: {user.subscription.is_active ? 'Active' : 'Inactive'}</p>
                    </>
                  )}
                </div>
              ) : (
                <p>Trial user - 30 days to upgrade</p>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      
      <TableCell>
        {user.is_admin ? (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-800/30 dark:text-purple-400">
            <Shield className="h-3 w-3 mr-1" /> Admin
          </Badge>
        ) : (
          <Badge variant="outline" className="text-gray-800 dark:text-gray-400">
            User
          </Badge>
        )}
      </TableCell>
      
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          {user.banned_until ? (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onUnban(user.id)}
              title="Unban user"
            >
              <UserCheck className="h-4 w-4 text-green-600" />
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onBan(user.id)}
              title="Ban user"
            >
              <Ban className="h-4 w-4 text-amber-600" />
            </Button>
          )}
          
          {user.is_admin ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleAdmin(user.id, false)}
              title="Remove admin privileges"
            >
              <ShieldOff className="h-4 w-4 text-purple-600" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleAdmin(user.id, true)}
              title="Make admin"
            >
              <Shield className="h-4 w-4 text-purple-600" />
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(user.id)}
            title="Delete user"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
