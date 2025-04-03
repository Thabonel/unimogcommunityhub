
import { format } from "date-fns";
import { Ban, UserCheck, Shield, ShieldOff, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

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
          <Badge variant="success">
            Active
          </Badge>
        )}
      </TableCell>
      
      <TableCell>
        {user.subscription ? (
          <Badge variant={user.subscription.is_active ? (user.subscription.is_trial ? "secondary" : "default") : "outline"}>
            {user.subscription.is_trial ? "Trial" : user.subscription.level}
            {user.subscription.expires_at && !user.subscription.is_active && " (Expired)"}
          </Badge>
        ) : (
          <Badge variant="outline">Free</Badge>
        )}
      </TableCell>
      
      <TableCell>
        {user.is_admin ? (
          <Badge variant="purple" className="bg-purple-100 text-purple-800 dark:bg-purple-800/30 dark:text-purple-400">
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
