import { Link } from 'react-router-dom';
import { SITE_IMAGES } from '@/config/images';

interface LogoProps {
  className?: string;
}

export const Logo = ({ className = "" }: LogoProps) => {
  return (
    <Link to="/" className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex-shrink-0 w-14 h-14 md:w-16 md:h-16 overflow-hidden rounded-full shadow-md">
        <picture>
          <source srcSet={SITE_IMAGES.logo} type="image/webp" />
          <source srcSet={SITE_IMAGES.logoFallback} type="image/png" />
          <img
            src={SITE_IMAGES.logoFallback}
            alt="Unimog Community Hub"
            className="w-full h-full object-cover"
            fetchPriority="high"
            loading="eager"
          />
        </picture>
      </div>
      <span className="text-white font-bold text-lg md:text-xl hidden sm:block">
        Unimog Hub
      </span>
    </Link>
  );
};