
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

interface UserTableContentProps {
  users: any[];
  isLoading: boolean;
  error: any;
  onBan: (userId: string) => void;
  onUnban: (userId: string) => void;
  onDelete: (userId: string) => void;
  onToggleAdmin: (userId: string, makeAdmin: boolean) => void;
}

export function UserTableContent({
  users,
  isLoading,
  error,
  onBan,
  onUnban,
  onDelete,
  onToggleAdmin,
}: UserTableContentProps) {
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
            <TableHead>Email</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last Sign In</TableHead>
            <TableHead>Status</TableHead>
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
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
