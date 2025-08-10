
import React from 'react';
import Layout from '@/components/Layout';
import { KnowledgeNavigation } from '@/components/knowledge/KnowledgeNavigation';
import { EnhancedBarryChat } from '@/components/knowledge/EnhancedBarryChat';
import { MessageSquareCode, Wrench, BookOpen, FileText, Settings } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/use-auth';

const BotpressAIPage = () => {
  const { user } = useAuth();

  return (
    <Layout isLoggedIn={!!user} user={user}>
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-unimog-800 dark:text-unimog-200 flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-unimog-500">
              <AvatarImage src="/barry-avatar.png" alt="Barry the AI Mechanic" />
              <AvatarFallback>
                <Wrench className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            Barry - AI Mechanic with Manual Access
          </h1>
          <p className="text-muted-foreground mt-2 max-w-4xl">
            Barry can now search through all Unimog service manuals, parts catalogs, and technical documentation. 
            Ask detailed questions and get answers with specific page references and diagrams.
          </p>
        </div>

        <KnowledgeNavigation />

        <Alert className="mb-6">
          <FileText className="h-4 w-4" />
          <AlertDescription>
            <strong>Enhanced with Manual Search!</strong> Barry now has access to the complete Unimog technical library. 
            When he finds relevant information, you'll see manual references and can view the actual pages.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          {/* Main Enhanced Chat Interface */}
          <EnhancedBarryChat />

          {/* Quick Reference Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <MessageSquareCode className="h-4 w-4 mr-2 text-primary" />
                Example Questions
              </h3>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>"Portal seal replacement procedure for U1700L"</li>
                <li>"Torque specs for OM352 head bolts"</li>
                <li>"Wiring diagram for 24V starting system"</li>
                <li>"PTO engagement troubleshooting"</li>
              </ul>
            </div>
            
            <div className="bg-muted rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <BookOpen className="h-4 w-4 mr-2 text-primary" />
                Available Manuals
              </h3>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>• Service & Repair Manuals</li>
                <li>• Parts Catalogs with Diagrams</li>
                <li>• Electrical Schematics</li>
                <li>• Hydraulic System Guides</li>
              </ul>
            </div>
            
            <div className="bg-muted rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Settings className="h-4 w-4 mr-2 text-primary" />
                Technical Coverage
              </h3>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>• All Unimog Models (404-U5023)</li>
                <li>• Engine: OM352, OM366, OM906</li>
                <li>• Transmission: UG3/40, G-series</li>
                <li>• Axles: Portal reduction systems</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BotpressAIPage;
