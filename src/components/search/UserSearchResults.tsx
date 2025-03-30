
import { UserProfile } from '@/types/user';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MapPin, Truck, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { highlightText } from '@/utils/searchUtils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UserSearchResultsProps {
  results: UserProfile[];
  query: string;
}

const UserSearchResults = ({ results, query }: UserSearchResultsProps) => {
  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-unimog-700 dark:text-unimog-200">No users found</h3>
        <p className="text-muted-foreground mt-1">
          Try searching with different keywords
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {results.map((user) => {
        const displayName = user.display_name || user.full_name || user.email.split('@')[0];
        const initials = displayName.substring(0, 2).toUpperCase();
        
        return (
          <Card key={user.id} className="offroad-card hover:shadow-md transition-shadow border-unimog-100 dark:border-unimog-700">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12 border-2 border-terrain-400">
                  <AvatarImage src={user.avatar_url || undefined} alt={displayName} />
                  <AvatarFallback className="bg-terrain-500 text-white">{initials}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h3 className="font-medium text-unimog-800 dark:text-unimog-100" dangerouslySetInnerHTML={{ 
                    __html: highlightText(displayName, query) 
                  }} />
                  
                  {user.location && (
                    <div className="flex items-center text-sm text-unimog-600 dark:text-unimog-300 mt-1">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      <span dangerouslySetInnerHTML={{ 
                        __html: highlightText(user.location, query) 
                      }} />
                    </div>
                  )}
                  
                  {user.unimog_model && (
                    <div className="flex items-center text-sm text-terrain-600 dark:text-terrain-400 mt-1">
                      <Truck className="h-3.5 w-3.5 mr-1" />
                      <span dangerouslySetInnerHTML={{ 
                        __html: highlightText(user.unimog_model, query) 
                      }} />
                      {user.unimog_year && (
                        <span className="ml-1">({user.unimog_year})</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {user.bio && (
                <div className="mt-3 text-sm text-muted-foreground line-clamp-2" dangerouslySetInnerHTML={{ 
                  __html: highlightText(user.bio, query) 
                }} />
              )}
              
              <div className="mt-4 flex justify-end">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button asChild variant="outline" size="sm" className="border-unimog-200 hover:bg-unimog-100 dark:border-unimog-700 dark:hover:bg-unimog-800">
                        <Link to={`/profile/${user.id}`}>
                          <Info className="h-4 w-4 mr-1 text-unimog-600 dark:text-unimog-300" />
                          View Profile
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View {displayName}'s full profile</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default UserSearchResults;
