
import { format } from "date-fns";
import { Ban, UserCheck, Shield, ShieldOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

interface UserTableRowProps {
  user: {
    id: string;
    email: string;
    created_at: string;
    last_sign_in_at: string | null;
    banned_until: string | null;
    is_admin?: boolean;
  };
  onBan: (userId: string) => void;
  onUnban: (userId: string) => void;
  onDelete: (userId: string) => void;
  onToggleAdmin: (userId: string, makeAdmin: boolean) => void;
}

export function UserTableRow({ user, onBan, onUnban, onDelete, onToggleAdmin }: UserTableRowProps) {
  return (
    <TableRow key={user.id}>
      <TableCell className="font-medium">
        {user.email}
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
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-500">
            Banned until {format(new Date(user.banned_until), 'MMM d, yyyy')}
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-500">
            Active
          </span>
        )}
      </TableCell>
      <TableCell>
        {user.is_admin ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-800/30 dark:text-purple-400">
            <Shield className="h-3 w-3" /> Admin
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400">
            User
          </span>
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
