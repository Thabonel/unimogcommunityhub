
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

export const FreeTrialCTA = () => {
  return (
    <Button
      size="lg"
      className="bg-military-olive hover:bg-military-olive/90 text-white w-full sm:w-auto"
      asChild
    >
      <Link to="/verify">
        Verify Ownership
        <ChevronRight className="ml-2 h-4 w-4" />
      </Link>
    </Button>
  );
};

export default FreeTrialCTA;
