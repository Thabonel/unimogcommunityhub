import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Settings, Wrench, Package, AlertCircle, Bot } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/profile';
import WISMercedesInterface from '@/components/wis/WISMercedesInterface';
import { BarryWISClient } from '@/utils/barry-wis-client';
import { toast } from 'sonner';

const WISSystemPage = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { userData } = useProfile();
  const [barryContext, setBarryContext] = useState(null);
  const [isBarryLoading, setIsBarryLoading] = useState(false);

  // Handle Barry requests using the new WIS integration
  const handleBarryRequest = async (query: string, vehicleModel?: string) => {
    console.log('Barry WIS request:', query, 'for vehicle:', vehicleModel);
    setIsBarryLoading(true);

    try {
      toast.info('Barry is analyzing your request...');

      const response = await BarryWISClient.query(
        query,
        vehicleModel || userData?.unimogModel || 'U1700L',
        'procedures' // Default to procedures, can be made dynamic
      );

      if (response.success && response.context) {
        // Convert the response to the expected BarryContext format
        const newBarryContext = {
          query: query,
          explanation: response.response || 'Barry found some information for you.',
          curatedResults: {
            procedures: response.context.results.filter(r => r.content_type === 'manual') || [],
            parts: response.context.results.filter(r => r.content_type === 'parts') || [],
            bulletins: response.context.results.filter(r => r.content_type === 'bulletin') || []
          },
          suggestions: response.context.suggestions || [],
          timestamp: Date.now()
        };
        
        setBarryContext(newBarryContext);
        toast.success('Barry found relevant information!');
      } else {
        toast.error(response.error || 'Barry couldn\'t find relevant information');
        console.error('Barry WIS error:', response.error);
      }
    } catch (error) {
      toast.error('Failed to connect to Barry');
      console.error('Barry request failed:', error);
    } finally {
      setIsBarryLoading(false);
    }
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
              <span className="px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-300 rounded-full border border-yellow-500/30">
                BETA
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span>📄 4,875 Documents</span>
              <span>🎬 10,345 Media Files</span>
              <span>🎯 Task-Centric Design</span>
              <span>🔍 Predictive Search</span>
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white hover:bg-white/10 ml-2"
                  onClick={() => navigate('/admin/wis-management')}
                  title="WIS System Settings"
                >
                  <Settings className="h-3 w-3" />
                </Button>
              )}
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
        <div className="relative bg-white rounded-lg border shadow-sm overflow-hidden">
          <WISMercedesInterface 
            barryContext={barryContext}
            onBarryRequest={handleBarryRequest}
          />
          {isBarryLoading && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-4 flex items-center gap-3 shadow-lg">
                <Bot className="h-5 w-5 text-military-green animate-pulse" />
                <span className="text-sm font-medium">Barry is thinking...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default WISSystemPage;