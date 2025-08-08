
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-muted/30 to-muted/60 px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
            <FileQuestion size={48} className="text-muted-foreground" />
          </div>
        </div>
        
        <h1 className="text-5xl font-bold mb-4 text-unimog-800 dark:text-unimog-200">404</h1>
        <p className="text-xl text-foreground mb-2">Oops! Page not found</p>
        <p className="text-muted-foreground mb-8">
          The page you are looking for might have been removed, had its 
          name changed, or is temporarily unavailable.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link to={-1 as any}>
              <ArrowLeft size={16} />
              Go Back
            </Link>
          </Button>
          <Button asChild className="flex items-center gap-2 bg-primary">
            <Link to="/">
              <Home size={16} />
              Return to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
