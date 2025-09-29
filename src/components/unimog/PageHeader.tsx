
import { Input } from '@/components/ui/input';
import { LoginButton } from '@/components/header/LoginButton';
import { useAuth } from '@/contexts/AuthContext';

interface PageHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const PageHeader = ({ searchQuery, setSearchQuery }: PageHeaderProps) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-unimog-800 dark:text-unimog-100">My Unimog - U1700L Military Edition</h1>
        <p className="text-muted-foreground mt-2">Your comprehensive resource hub for the ex-military U1700L Unimog</p>
        <p className="text-sm text-muted-foreground mt-1">Specifications • Common Issues • Dimensions • Technical Manuals</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        <Input
          placeholder="Search specifications and issues..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-80"
        />
        {!user && <LoginButton variant="outline" className="whitespace-nowrap" />}
      </div>
    </div>
  );
};
