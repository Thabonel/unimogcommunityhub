
import { useState } from "react";
import { Move } from "lucide-react";
import { 
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface ArticleMoveMenuProps {
  currentCategory?: string;
  isMoving: boolean;
  onMove: (category: string) => void;
}

// List of available categories
const CATEGORIES = ["Maintenance", "Repair", "Adventures", "Modifications", "Tyres"];

export function ArticleMoveMenu({ 
  currentCategory, 
  isMoving, 
  onMove 
}: ArticleMoveMenuProps) {
  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuLabel>Move to category</DropdownMenuLabel>
      
      {CATEGORIES.map((category) => (
        <DropdownMenuItem 
          key={category}
          disabled={category === currentCategory || isMoving}
          onClick={() => onMove(category)}
        >
          <Move size={16} className="mr-2" />
          {category}
        </DropdownMenuItem>
      ))}
    </>
  );
}
