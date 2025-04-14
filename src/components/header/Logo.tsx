
import { Link } from 'react-router-dom';
import { Truck } from 'lucide-react';
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export const Logo = ({ className = "" }: LogoProps) => {
  return (
    <Link 
      to="/" 
      className={cn(
        "flex items-center gap-3 transition-all duration-300 hover:scale-105 group", 
        className
      )}
    >
      <div className="relative w-12 h-12 overflow-hidden rounded-full shadow-lg border-2 border-khaki-tan/70 group-hover:border-white/70 group-hover:shadow-xl transition-all duration-300">
        {/* Main logo image */}
        <div className="absolute inset-0 bg-gradient-to-br from-military-green to-olive-drab opacity-20 group-hover:opacity-0 transition-opacity duration-300"></div>
        <img 
          src="/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png" 
          alt="Unimog Logo" 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300" 
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
      </div>
      
      <div className="flex flex-col">
        <span className="text-xl font-bold text-white font-rugged tracking-wider relative">
          UNIMOG HUB
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-khaki-tan group-hover:w-full transition-all duration-300"></span>
        </span>
        <span className="text-xs text-white/80 hidden md:block tracking-wide font-medium">
          The Ultimate Community
        </span>
      </div>
    </Link>
  );
};
