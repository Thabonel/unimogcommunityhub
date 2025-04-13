
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

export const Logo = ({ className = "" }: LogoProps) => {
  return (
    <Link to="/" className={`text-lg md:text-xl font-bold flex items-center gap-2 ${className}`}>
      <div className="relative w-8 h-8 md:w-10 md:h-10 overflow-hidden rounded-full shadow-md">
        <img 
          src="/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png" 
          alt="Unimog Logo" 
          className="w-full h-full object-cover" 
        />
      </div>
      <div className="flex flex-col items-start">
        <span className="high-contrast-text-large font-rugged">The Ultimate Unimog Community Hub</span>
        <span className="high-contrast-text text-xs hidden md:block">Where enthusiasts connect</span>
      </div>
    </Link>
  );
};
