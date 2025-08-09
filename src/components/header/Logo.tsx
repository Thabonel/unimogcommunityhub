import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

export const Logo = ({ className = "" }: LogoProps) => {
  return (
    <Link to="/" className={`flex items-center gap-3 ${className}`}>
      <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-full shadow-md">
        <img 
          src="/images-hero/56c274f5-535d-42c0-98b7-fc29272c4faa.png" 
          alt="Unimog Community Hub" 
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-white font-bold text-lg md:text-xl hidden sm:block">
        Unimog Hub
      </span>
    </Link>
  );
};