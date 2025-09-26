import React from 'react';
import { SimplifiedBarryChat } from '@/components/barry/SimplifiedBarryChat';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Bot, Wrench } from 'lucide-react';

export default function BarryAssistant() {
  const { user, profile } = useAuth();
  const userModel = profile?.unimog_model;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex items-center gap-3">
            <div className="flex items-center gap-2 text-military-green">
              <Bot className="h-8 w-8" />
              <Wrench className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Barry AI Assistant</h1>
              <p className="text-sm text-gray-600">
                Your expert Unimog mechanic with access to all workshop and maintenance manuals
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <SimplifiedBarryChat
          className="h-[calc(100vh-140px)]"
          userModel={userModel}
        />
      </div>

      {/* Info Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-gray-600">
          <div>
            💡 Barry has access to 67 technical manuals (41 workshop + 26 maintenance)
          </div>
          {userModel && (
            <div>
              🚛 Configured for your {userModel}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}