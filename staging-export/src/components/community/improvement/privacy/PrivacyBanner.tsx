
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { updatePrivacySettings, getPrivacySettings } from '@/services/analytics/privacyService';

export function PrivacyBanner() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Show banner if user has not made a choice yet
    const hasUserMadeChoice = localStorage.getItem('privacy_choice_made');
    if (!hasUserMadeChoice) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    const currentSettings = getPrivacySettings();
    updatePrivacySettings({
      ...currentSettings,
      allowAnalytics: true,
      allowActivityTracking: true
    });
    localStorage.setItem('privacy_choice_made', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    const currentSettings = getPrivacySettings();
    updatePrivacySettings({
      ...currentSettings,
      allowAnalytics: false,
      allowActivityTracking: false,
      allowPersonalization: false,
      anonymizeData: true
    });
    localStorage.setItem('privacy_choice_made', 'true');
    setIsVisible(false);
  };
  
  const handleClose = () => {
    localStorage.setItem('privacy_choice_made', 'true');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50">
      <Card className="relative shadow-lg max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          size="sm" 
          className="absolute right-2 top-2" 
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
        <CardContent className="pt-6 pb-2">
          <h3 className="text-lg font-semibold">We value your privacy</h3>
          <p className="text-sm text-muted-foreground mt-1">
            We use cookies and similar technologies to enhance your experience, analyze traffic, 
            and for personalization and advertising. By clicking "Accept", you consent to our use of analytics.
            You can manage your preferences at any time in the Privacy Settings.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col xs:flex-row gap-2 justify-end">
          <Button variant="outline" onClick={handleDecline}>
            Decline
          </Button>
          <Button onClick={handleAccept}>
            Accept
          </Button>
          <div className="text-xs text-muted-foreground ml-2 mt-2 xs:mt-0">
            <Link to="/privacy" className="underline">Privacy Policy</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
