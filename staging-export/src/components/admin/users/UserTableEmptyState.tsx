
interface UserTableEmptyStateProps {
  message?: string;
}

export function UserTableEmptyState({ 
  message = "No users found matching your search criteria." 
}: UserTableEmptyStateProps) {
  return (
    <div className="text-center py-8 text-muted-foreground">
      {message}
    </div>
  );
}
