
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

export const Logo = ({ className = "" }: LogoProps) => {
  return (
    <Link to="/" className={`text-lg md:text-xl font-bold flex items-center gap-2 ${className} hover-lift`}>
      <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-full shadow-md hover:shadow-lg transition-all duration-300">
        <img 
          src="/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png" 
          alt="Unimog Logo" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
      </div>
      <div className="flex flex-col items-start">
        <span className="hidden sm:inline font-bold text-foreground">Unimog Community Hub</span>
        <span className="sm:hidden font-bold">Unimog Hub</span>
        <span className="text-xs text-muted-foreground/80 hidden md:inline">Where enthusiasts connect</span>
      </div>
    </Link>
  );
};
