import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Search, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { WorkshopSearch } from '@/components/wis/WorkshopSearch';
import { BarryChat } from '@/components/wis/BarryChat';
import { WISModel, WIS_MODELS } from '@/lib/supabase-wis';

export default function WorkshopPage() {
  const navigate = useNavigate();
  const [selectedModel, setSelectedModel] = useState<WISModel>(
    WIS_MODELS.find(m => m.isDefault) || WIS_MODELS[0]
  );
  const [activeTab, setActiveTab] = useState('search');

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <Button
            onClick={() => navigate('/knowledge')}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Knowledge Base
          </Button>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Workshop Database
            </TabsTrigger>
            <TabsTrigger value="barry" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Chat with Barry
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search">
            <WorkshopSearch defaultModel={selectedModel.code} />
          </TabsContent>

          <TabsContent value="barry">
            <div className="space-y-6">
              {/* Barry Header */}
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Barry - AI Mechanic with Manual Access
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                  Ask Barry about maintenance, repairs, or any technical questions about your {selectedModel.name}
                </p>
                <Button
                  onClick={() => setActiveTab('barry')}
                  className="bg-green-600 hover:bg-green-700 mb-8"
                  size="lg"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Chat with Barry
                </Button>
              </div>

              <BarryChat selectedModel={selectedModel} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}