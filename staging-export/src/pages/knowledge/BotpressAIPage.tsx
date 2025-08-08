
import React from 'react';
import Layout from '@/components/Layout';
import { KnowledgeNavigation } from '@/components/knowledge/KnowledgeNavigation';
import AIMechanic from '@/components/knowledge/AIMechanic';
import { MessageSquareCode, Wrench, BookOpen } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const BotpressAIPage = () => {
  // Mock user data - in a real app this would come from authentication
  const mockUser = {
    name: 'John Doe',
    avatarUrl: '/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png',
    unimogModel: 'U1700L'
  };

  return (
    <Layout isLoggedIn={true} user={mockUser}>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-unimog-800 dark:text-unimog-200 flex items-center gap-2">
            <Avatar className="h-12 w-12 border-2 border-unimog-500">
              <AvatarImage src="/lovable-uploads/2cfd91cd-2db0-40fa-8b3f-d6b3505e98ef.png" alt="Barry the AI Mechanic" />
              <AvatarFallback>
                <Wrench className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            Barry - AI Mechanic
          </h1>
          <p className="text-muted-foreground mt-2 max-w-3xl">
            Ask Barry anything about maintaining, repairing, or servicing your Unimog. 
            He can provide step-by-step guides, explain technical procedures, and recommend tools.
          </p>
        </div>

        <KnowledgeNavigation />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mt-8">
          <div className="md:col-span-3">
            <AIMechanic height="600px" />
          </div>
          <div className="md:col-span-2 space-y-6">
            <div className="bg-muted rounded-lg p-6">
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <MessageSquareCode className="h-5 w-5 mr-2 text-primary" />
                Sample Questions
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>"Show me step-by-step how to replace portal seals."</li>
                <li>"Explain how to service the transmission on a U1700L."</li>
                <li>"What tools are needed for routine maintenance?"</li>
                <li>"How do I check and replace brake pads on my Unimog?"</li>
                <li>"What's the correct tire pressure for off-road driving?"</li>
              </ul>
            </div>
            
            <div className="bg-muted rounded-lg p-6">
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-primary" />
                Barry's Knowledge Base
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Barry has access to technical manuals, service guides, and community knowledge about:
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Engine maintenance and repair</li>
                <li>• Transmission service procedures</li>
                <li>• Electrical system troubleshooting</li>
                <li>• Hydraulic system repairs</li>
                <li>• Axle and drive train maintenance</li>
                <li>• Suspension and steering adjustments</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BotpressAIPage;
