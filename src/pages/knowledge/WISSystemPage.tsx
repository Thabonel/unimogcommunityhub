import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { WISMercedesInterface } from '@/components/wis/WISMercedesInterface';

const WISSystemPage = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [barryContext, setBarryContext] = useState(null);

  // Handle Barry requests
  const handleBarryRequest = (query: string) => {
    // This would normally integrate with the existing Barry chat system
    // For now, we'll simulate Barry's response
    console.log('Barry request:', query);
    // In production, this would trigger the Barry chat bubble
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Minimal header - Mercedes style full-screen interface */}
      <div className="bg-white border-b border-gray-200 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate('/knowledge')}
              variant="ghost"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Knowledge Base
            </Button>
            <div className="h-4 w-px bg-gray-300" />
            <h1 className="font-semibold text-gray-900">Workshop Information System</h1>
          </div>
          {!user && (
            <Button variant="outline" size="sm" onClick={() => navigate('/auth')}>
              Sign In for Full Access
            </Button>
          )}
        </div>
      </div>

      {/* Full-screen Mercedes WIS Interface */}
      <div className="flex-1">
        <WISMercedesInterface 
          barryContext={barryContext}
          onBarryRequest={handleBarryRequest}
        />
      </div>
    </div>
  );
};

export default WISSystemPage;