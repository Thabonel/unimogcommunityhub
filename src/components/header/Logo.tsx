
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

export const Logo = ({ className = "" }: LogoProps) => {
  return (
    <Link to="/" className={`flex items-center gap-3 ${className}`}>
      <div className="relative w-10 h-10 overflow-hidden rounded-full shadow-md">
        <img 
          src="/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png" 
          alt="Unimog Logo" 
          className="w-full h-full object-cover" 
        />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold high-contrast-text-large font-rugged">UNIMOG HUB</span>
        <span className="text-xs high-contrast-text hidden md:block">The Ultimate Community</span>
      </div>
    </Link>
  );
};
