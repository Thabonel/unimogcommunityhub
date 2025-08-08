
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserTableRow } from "./UserTableRow";
import { UserTableEmptyState } from "./UserTableEmptyState";
import { UserTableLoadingState } from "./UserTableLoadingState";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface UserTableContentProps {
  users: any[];
  isLoading: boolean;
  error: any;
  onBan: (userId: string) => void;
  onUnban: (userId: string) => void;
  onDelete: (userId: string) => void;
  onToggleAdmin: (userId: string, makeAdmin: boolean) => void;
  selectedUsers: string[];
  onSelectUser: (userId: string, isSelected: boolean) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onViewUserDetails: (userId: string) => void;
}

export function UserTableContent({
  users,
  isLoading,
  error,
  onBan,
  onUnban,
  onDelete,
  onToggleAdmin,
  selectedUsers,
  onSelectUser,
  onSelectAll,
  onDeselectAll,
  onViewUserDetails,
}: UserTableContentProps) {
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  
  const handleSelectAllChange = (checked: boolean) => {
    setSelectAllChecked(checked);
    if (checked) {
      onSelectAll();
    } else {
      onDeselectAll();
    }
  };
  
  if (isLoading) {
    return <UserTableLoadingState />;
  }

  if (error) {
    return <UserTableEmptyState message="Error loading users. Please try again." />;
  }

  if (!users || users.length === 0) {
    return <UserTableEmptyState />;
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox 
                checked={selectAllChecked}
                onCheckedChange={handleSelectAllChange}
                aria-label="Select all users"
              />
            </TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last Sign In</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Subscription</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
              onBan={onBan}
              onUnban={onUnban}
              onDelete={onDelete}
              onToggleAdmin={onToggleAdmin}
              isSelected={selectedUsers.includes(user.id)}
              onSelectChange={(checked) => onSelectUser(user.id, checked)}
              onViewDetails={() => onViewUserDetails(user.id)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
