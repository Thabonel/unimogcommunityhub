import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface VerifiedOwnerInitialProps {
  userName: string;
  isVerified: boolean;
  size?: 'xs' | 'sm' | 'md';
}

export function VerifiedOwnerInitial({
  userName,
  isVerified,
  size = 'sm'
}: VerifiedOwnerInitialProps) {
  if (!isVerified) return null;

  const initial = userName?.charAt(0)?.toUpperCase() || 'U';

  const sizeClasses = {
    xs: 'h-4 w-4 text-[8px]',
    sm: 'h-5 w-5 text-[10px]',
    md: 'h-6 w-6 text-xs'
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`inline-flex items-center justify-center ${sizeClasses[size]} rounded-full bg-green-600 text-white font-bold ring-2 ring-green-600/20 flex-shrink-0`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 10 L35 25 L35 40 L20 50 L35 60 L35 75 L50 90 L65 75 L65 60 L80 50 L65 40 L65 25 Z' fill='rgba(255,255,255,0.1)'/%3E%3C/svg%3E")`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <span className="relative z-10">{initial}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Verified Unimog Owner</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
