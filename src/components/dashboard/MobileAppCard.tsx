import React from 'react';
import { Smartphone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * MobileAppCard - Desktop only informational card
 * Appears in Dashboard to inform desktop users about mobile app availability
 * Hidden on mobile/tablet (they see install button instead)
 */
export const MobileAppCard: React.FC = () => {
  // Hide on mobile/tablet (they get install button)
  const isMobileOrTablet = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (isMobileOrTablet) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-[#4A5D23] to-[#3a4d1a] text-white border-none">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Smartphone className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-white text-lg">Mobile App Available</CardTitle>
            <CardDescription className="text-white/80 text-sm">
              Access on the go
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-white/90 leading-relaxed">
          Open this site on your phone or tablet to install the Unimog Hub app for a native app experience with offline support.
        </p>
      </CardContent>
    </Card>
  );
};
