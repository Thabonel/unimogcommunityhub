import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Settings, Wrench, Package, AlertCircle, Bot } from 'lucide-react';
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
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Professional WIS Header */}
      <div className="bg-slate-800 text-white shadow-lg">
        {/* Top Navigation */}
        <div className="border-b border-slate-700 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate('/knowledge')}
                variant="ghost"
                size="sm"
                className="text-slate-300 hover:text-white hover:bg-slate-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                KNOWLEDGE BASE
              </Button>
            </div>
            {!user && (
              <Button variant="outline" size="sm" onClick={() => navigate('/auth')}
                className="border-slate-600 text-slate-300 hover:bg-slate-700">
                Sign In for Full Access
              </Button>
            )}
          </div>
        </div>

        {/* WIS Title and Compact Stats */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold tracking-wide">WORKSHOP INFORMATION SYSTEM</h1>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-slate-400" />
            </div>
          </div>
          
          {/* Compact Stats Bar */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-slate-300 gap-6">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Mercedes-Benz WIS Workshop System</span>
              </div>
              <span>•</span>
              <span>4,875 Documents</span>
              <span>•</span>
              <span>10,345 Media Files</span>
              <span>•</span>
              <span>Task-Centric Design</span>
              <span>•</span>
              <span>Predictive Search</span>
            </div>
            
            <div className="flex items-center text-sm text-slate-400 gap-6">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                <span>850 Repair Procedures</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>3,900 Parts & Components</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>125 Service Bulletins</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4" />
                <span>Barry AI Assistant</span>
              </div>
            </div>
          </div>
          
          {/* Subtitle */}
          <p className="text-slate-400 text-sm mt-2">
            Professional workshop information system with predictive search and complete procedure packs. Simply describe what you're fixing, and get everything you need assembled in one place.
          </p>
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