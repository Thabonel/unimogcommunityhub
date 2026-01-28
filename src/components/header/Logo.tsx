import { Link } from 'react-router-dom';
import { SITE_IMAGES } from '@/config/images';

interface LogoProps {
  className?: string;
}

export const Logo = ({ className = "" }: LogoProps) => {
  return (
    <Link to="/" className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex-shrink-0 w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-full shadow-md">
        <picture>
          <source srcSet={SITE_IMAGES.logo} type="image/webp" />
          <source srcSet={SITE_IMAGES.logoFallback} type="image/png" />
          <img
            src={SITE_IMAGES.logoFallback}
            alt="Unimog Community Hub"
            className="w-full h-full object-cover"
          />
        </picture>
      </div>
      <span className="text-white font-bold text-lg md:text-xl hidden sm:block">
        Unimog Hub
      </span>
    </Link>
  );
};