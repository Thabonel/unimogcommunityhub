import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  user?: {
    avatar_url?: string | null;
    avatarUrl?: string | null;
    display_name?: string | null;
    full_name?: string | null;
    email?: string | null;
    name?: string | null;
  } | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBorder?: boolean;
}

const sizeClasses = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-16 w-16 text-xl'
};

/**
 * Standardized user avatar component with consistent styling and fallback behavior
 * Uses military-olive theme colors for fallback initials
 */
export function UserAvatar({ 
  user, 
  size = 'md', 
  className,
  showBorder = false
}: UserAvatarProps) {
  // Get avatar URL from multiple possible sources
  const avatarUrl = user?.avatar_url || user?.avatarUrl || null;
  
  // Get display name with proper fallback chain
  const displayName = 
    user?.display_name || 
    user?.full_name || 
    user?.name ||
    user?.email?.split('@')[0] || 
    'User';
  
  // Get initials for fallback
  const getInitials = () => {
    if (!displayName || displayName === 'User') {
      return 'UN';
    }
    
    // Handle names with spaces
    const parts = displayName.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    
    // Single word name - take first two characters
    return displayName.substring(0, 2).toUpperCase();
  };
  
  return (
    <Avatar 
      className={cn(
        sizeClasses[size],
        showBorder && 'border-2 border-military-olive/20',
        className
      )}
    >
      <AvatarImage 
        src={avatarUrl || undefined} 
        alt={displayName} 
      />
      <AvatarFallback className="bg-military-olive text-military-sand">
        {getInitials()}
      </AvatarFallback>
    </Avatar>
  );
}

// Export for convenience
export default UserAvatar;