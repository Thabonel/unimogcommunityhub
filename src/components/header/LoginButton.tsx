
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

interface LoginButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
  onClick?: () => Promise<void>;
}

export const LoginButton = ({ variant = "default", className = "", onClick }: LoginButtonProps) => {
  return (
    <Button 
      variant={variant}
      className={`flex items-center gap-2 ${className}`}
      onClick={onClick}
    >
      <LogIn size={18} />
      <span className="font-medium">Login</span>
    </Button>
  );
};
