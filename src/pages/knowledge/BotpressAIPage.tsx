
import React from 'react';
import Layout from '@/components/Layout';
import { KnowledgeNavigation } from '@/components/knowledge/KnowledgeNavigation';
import { TabbedBarryLayout } from '@/components/knowledge/TabbedBarryLayout';
import { MessageSquareCode, Wrench, BookOpen, FileText, Settings } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/use-auth';

const BotpressAIPage = () => {
  const { user } = useAuth();

  return (
    <Layout isLoggedIn={!!user} user={user}>
      <div className="container py-8 flex flex-col h-screen">
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
            <strong>Enhanced with Tabbed Manual Viewer!</strong> Barry now has access to the complete Unimog technical library.
            Click on manual citations to open PDFs in tabs on the right side. View multiple manuals simultaneously while chatting with Barry.
          </AlertDescription>
        </Alert>

        {/* Main Tabbed Barry Interface - 30/70 split */}
        <div className="flex-1 min-h-0">
          <TabbedBarryLayout />
        </div>
      </div>
    </Layout>
  );
};

export default BotpressAIPage;
