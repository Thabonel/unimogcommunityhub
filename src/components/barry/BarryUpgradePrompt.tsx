import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BarryUpgradePrompt = () => {
  return (
    <Card className="border-2 border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lock className="h-5 w-5 text-primary" />
          Technical Advice Requires Membership
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Sorry mate, technical Unimog advice is for paid members.
        </p>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Coffee className="h-4 w-4" />
          <span>It's just the price of two coffees for peace of mind</span>
        </div>

        <div className="bg-background rounded-lg p-4 space-y-2">
          <p className="font-medium">With membership you get:</p>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Full access to Barry's technical knowledge</li>
            <li>• Workshop manuals and documentation</li>
            <li>• Trip planning and GPX routes</li>
            <li>• Community features and messaging</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button asChild className="flex-1">
            <Link to="/signup?plan=monthly">
              Start 30-Day Free Trial
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link to="/#pricing">
              View Pricing
            </Link>
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          No credit card required for trial
        </p>
      </CardContent>
    </Card>
  );
};
