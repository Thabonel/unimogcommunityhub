import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Settings, Wrench, Package, AlertCircle, Bot } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/profile';
import { WISMercedesInterface } from '@/components/wis/WISMercedesInterface';

const WISSystemPage = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { userData } = useProfile();
  const [barryContext, setBarryContext] = useState(null);

  // Handle Barry requests
  const handleBarryRequest = (query: string) => {
    // This would normally integrate with the existing Barry chat system
    // For now, we'll simulate Barry's response
    console.log('Barry request:', query);
    // In production, this would trigger the Barry chat bubble
  };

  // Build user object for Layout
  const layoutUser = userData ? {
    name: userData.name || user?.email?.split('@')[0] || 'User',
    avatarUrl: (userData.useVehiclePhotoAsProfile && userData.vehiclePhotoUrl) 
      ? userData.vehiclePhotoUrl 
      : userData.avatarUrl,
    unimogModel: userData.unimogModel || '',
    vehiclePhotoUrl: userData.vehiclePhotoUrl || '',
    useVehiclePhotoAsProfile: userData.useVehiclePhotoAsProfile || false
  } : undefined;

  return (
    <Layout isLoggedIn={!!user} user={layoutUser}>
      <div className="container py-8">
        {/* Back to Knowledge Base */}
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

        {/* Compact WIS Info Section */}
        <div className="mb-6 bg-gradient-to-r from-military-green to-olive-drab text-white rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <h1 className="text-lg font-semibold text-white/90">Mercedes-Benz WIS Workshop System</h1>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span>📄 4,875 Documents</span>
              <span>🎬 10,345 Media Files</span>
              <span>🎯 Task-Centric Design</span>
              <span>🔍 Predictive Search</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-white/90 text-xs max-w-2xl">
              Professional workshop information system with predictive search and complete procedure packs. 
              Simply describe what you're fixing, and get everything you need assembled in one place.
            </p>
            
            <div className="flex items-center gap-6 text-center">
              <div className="flex items-center gap-1">
                <Wrench className="w-3 h-3" />
                <span className="text-sm font-semibold">850</span>
                <span className="text-xs text-white/80">Procedures</span>
              </div>
              <div className="flex items-center gap-1">
                <Package className="w-3 h-3" />
                <span className="text-sm font-semibold">3,900</span>
                <span className="text-xs text-white/80">Parts</span>
              </div>
              <div className="flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span className="text-sm font-semibold">125</span>
                <span className="text-xs text-white/80">Bulletins</span>
              </div>
              <div className="flex items-center gap-1">
                <Bot className="w-3 h-3" />
                <span className="text-sm font-semibold">Barry</span>
                <span className="text-xs text-white/80">AI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mercedes WIS Interface */}
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <WISMercedesInterface 
            barryContext={barryContext}
            onBarryRequest={handleBarryRequest}
          />
        </div>
      </div>
    </Layout>
  );
};

export default WISSystemPage;