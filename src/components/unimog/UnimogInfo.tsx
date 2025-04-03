
import { motion } from 'framer-motion';
import { ExternalLink, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { RandomUnimogFact } from './RandomUnimogFact';

interface WikipediaData {
  title: string;
  extract: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  content_urls: {
    desktop: {
      page: string;
    };
  };
}

// Separate function for fetching Wikipedia data
const fetchUnimogData = async (): Promise<WikipediaData> => {
  const response = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/Unimog');
  
  if (!response.ok) {
    throw new Error('Failed to fetch Unimog information');
  }
  
  return response.json();
};

const UnimogInfo = () => {
  // Use React Query to handle the data fetching
  const { data: unimogData, isLoading, error } = useQuery({
    queryKey: ['unimogWikipedia'],
    queryFn: fetchUnimogData,
    staleTime: 3600000, // Cache for 1 hour
    retry: 2
  });

  if (isLoading) {
    return (
      <div className="p-6 shadow-md rounded-xl bg-card max-w-3xl mx-auto">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <Skeleton className="h-64 w-full mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 shadow-md rounded-xl bg-card max-w-3xl mx-auto text-destructive">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle size={20} />
          <h2 className="text-xl font-semibold">Error</h2>
        </div>
        <p>{error instanceof Error ? error.message : 'Unable to load Unimog information. Please try again later.'}</p>
      </div>
    );
  }

  if (!unimogData) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 shadow-md rounded-xl bg-card max-w-3xl mx-auto border border-border/50"
    >
      <motion.h1 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold text-foreground"
      >
        {unimogData.title}
      </motion.h1>
      
      {unimogData.thumbnail && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-6 mb-6 overflow-hidden rounded-lg"
        >
          <img 
            src={unimogData.thumbnail.source} 
            alt={`${unimogData.title} vehicle image`} 
            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </motion.div>
      )}
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-foreground/80 leading-relaxed text-base"
      >
        {unimogData.extract}
      </motion.p>
      
      <div className="flex items-center justify-between mt-6">
        <motion.a
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          href={unimogData.content_urls.desktop.page}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Read more about Unimog on Wikipedia"
          className="inline-flex items-center gap-2 text-unimog-500 hover:text-unimog-700 dark:text-unimog-300 dark:hover:text-unimog-200 underline underline-offset-4 font-medium transition-colors"
        >
          Read more on Wikipedia
          <ExternalLink size={16} />
        </motion.a>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <RandomUnimogFact />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UnimogInfo;
