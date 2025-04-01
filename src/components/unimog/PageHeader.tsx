
import { Input } from '@/components/ui/input';

interface PageHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const PageHeader = ({ searchQuery, setSearchQuery }: PageHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-unimog-800 dark:text-unimog-100">Unimog U1700L Military Edition</h1>
        <p className="text-muted-foreground mt-2">Comprehensive information for owners of the ex-military U1700L Unimog</p>
      </div>
      <div className="w-full md:w-auto">
        <Input
          placeholder="Search specifications and issues..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-80"
        />
      </div>
    </div>
  );
};
