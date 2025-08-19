
import { QueryClient } from '@tanstack/react-query';

// Create a shared QueryClient instance to be used across the app
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes (reduced from 5 for articles)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Function to clear all cached article data
export const clearArticleCache = () => {
  queryClient.invalidateQueries({ queryKey: ['articles'] });
  queryClient.invalidateQueries({ queryKey: ['community_articles'] });
  queryClient.removeQueries({ queryKey: ['articles'] });
  queryClient.removeQueries({ queryKey: ['community_articles'] });
};
