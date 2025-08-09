import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

export const Logo = ({ className = "" }: LogoProps) => {
  return (
    <Link to="/" className={`flex items-center gap-3 ${className}`}>
      <img 
        src="https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/site_assets/Unimoghub%20LOGO.png" 
        alt="Unimog Hub Logo" 
        className="h-10 md:h-12 w-auto"
        onError={(e) => {
          console.error('Logo failed to load');
          e.currentTarget.style.display = 'none';
        }}
      />
    </Link>
  );
};