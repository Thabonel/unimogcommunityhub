
import { Input } from "@/components/ui/input";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserSearchBoxProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
}

export function UserSearchBox({ 
  searchTerm, 
  onSearchChange, 
  onRefresh 
}: UserSearchBoxProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
      <div className="relative flex-grow">
        <Input
          placeholder="Search users by email or ID..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
          startIcon={<span className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground">🔍</span>}
        />
      </div>
      
      <Button 
        variant="outline" 
        size="icon"
        onClick={onRefresh}
        title="Refresh users"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
}
