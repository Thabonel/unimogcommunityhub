
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

export const Logo = ({ className = "" }: LogoProps) => {
  return (
    <Link to="/" className={`text-lg md:text-xl font-bold flex items-center gap-2 text-unimog-800 dark:text-unimog-200 ${className}`}>
      <img src="/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png" alt="Unimog Logo" className="w-10 h-10 md:w-12 md:h-12 rounded-full" />
      <span className="hidden sm:inline">Unimog Community Hub</span>
      <span className="sm:hidden">Unimog Hub</span>
    </Link>
  );
};
