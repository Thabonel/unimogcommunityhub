
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Wrench } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const AIBotHeader = () => {
  return (
    <CardHeader className="pb-2">
      <div className="flex items-center">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-unimog-500">
            <AvatarImage src="/lovable-uploads/2cfd91cd-2db0-40fa-8b3f-d6b3505e98ef.png" alt="Barry the AI Mechanic" />
            <AvatarFallback>
              <Wrench className="h-5 w-5 text-primary" />
            </AvatarFallback>
          </Avatar>
          <CardTitle>Barry - AI Mechanic</CardTitle>
        </div>
      </div>
      <CardDescription>
        Ask Barry about maintenance, repairs, or any technical questions about your Unimog
      </CardDescription>
    </CardHeader>
  );
};

export default AIBotHeader;
