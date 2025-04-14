
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

export const Logo = ({ className = "" }: LogoProps) => {
  return (
    <Link to="/" className={`flex items-center gap-3 transition-transform hover:scale-105 ${className}`}>
      <div className="relative w-12 h-12 overflow-hidden rounded-full shadow-lg border-2 border-khaki-tan/30">
        <img 
          src="/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png" 
          alt="Unimog Logo" 
          className="w-full h-full object-cover" 
        />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold text-white font-rugged tracking-wider">UNIMOG HUB</span>
        <span className="text-xs text-white/80 hidden md:block tracking-wide">The Ultimate Community</span>
      </div>
    </Link>
  );
};
