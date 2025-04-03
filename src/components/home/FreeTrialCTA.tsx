
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTrial } from '@/hooks/use-trial';
import { updateVisitorConversion } from '@/services/analytics/visitorTracking';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FreeTrialCTA = () => {
  const { user, signUp } = useAuth();
  const { trialStatus, startTrial } = useTrial();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  
  const handleStartTrialClick = async () => {
    if (user) {
      // User is logged in, start trial directly
      const started = await startTrial();
      if (started) {
        updateVisitorConversion('converted_to_trial');
      }
    } else {
      // Show dialog for new users
      setOpen(true);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Register user
      const { error, data } = await signUp(email, password, { full_name: name });
      
      if (error) {
        throw error;
      }
      
      // Close dialog
      setOpen(false);
      
      // Show success toast
      toast({
        title: "Registration successful!",
        description: "Please check your email to confirm your account, then log in to start your free trial.",
      });
      
      // Track signup conversion
      updateVisitorConversion('signed_up');
      
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Show different button based on authentication and trial status
  const renderButton = () => {
    if (user && trialStatus === 'active') {
      return (
        <Link to="/dashboard">
          <Button size="lg" className="w-full sm:w-auto">
            Go to Dashboard
          </Button>
        </Link>
      );
    }
    
    if (user && trialStatus === 'expired') {
      return (
        <Link to="/pricing">
          <Button size="lg" className="w-full sm:w-auto">
            Upgrade Now
          </Button>
        </Link>
      );
    }
    
    return (
      <Button onClick={handleStartTrialClick} size="lg" className="w-full sm:w-auto">
        Try Free for 7 Days
      </Button>
    );
  };
  
  return (
    <>
      {renderButton()}
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start Your Free Trial</DialogTitle>
            <DialogDescription>
              Create an account to begin your 7-day free trial. No credit card required.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                minLength={6}
              />
            </div>
            
            <div className="text-xs text-muted-foreground">
              By signing up, you agree to our <Link to="/terms" className="underline">Terms of Service</Link> and <Link to="/privacy" className="underline">Privacy Policy</Link>.
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Start Free Trial"
              )}
            </Button>
            
            <div className="text-center text-sm text-muted-foreground">
              Already have an account? <Link to="/login" className="underline font-medium text-primary">Log in</Link>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Also export as default for backward compatibility
export default FreeTrialCTA;
