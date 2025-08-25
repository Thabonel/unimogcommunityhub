import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import AIBotHeader from './AIBotHeader';
import { SecureBarryChat } from './SecureBarryChat';

interface AIBotProps {
  height?: string;
  width?: string;
}

export const AIMechanic = ({ height = "600px", width = "100%" }: AIBotProps) => {
  return (
    <Card className="shadow-md overflow-hidden">
      <AIBotHeader />
      <CardContent className="p-0">
        <SecureBarryChat height={height} className="w-full" />
      </CardContent>
    </Card>
  );
};

export default AIMechanic;