import { Link } from 'react-router-dom';
import { SITE_IMAGES } from '@/config/images';

interface LogoProps {
  className?: string;
}

export const Logo = ({ className = "" }: LogoProps) => {
  return (
    <Link to="/" className={`flex items-center gap-3 ${className}`}>
      <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-full shadow-md">
        <img 
          src={SITE_IMAGES.logo} 
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