import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Settings, Wrench, Package, AlertCircle, Bot } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/profile';
import WISProfessionalInterface from '@/components/wis/WISProfessionalInterface';
import { WISStoreTest } from '@/components/wis/WISStoreTest';
import { BarryWISClient } from '@/utils/barry-wis-client';
import { toast } from 'sonner';
import { useBarry } from '@/contexts/BarryContext';
import { ErrorBoundary } from '@/components/error-boundary';

const WISSystemPage = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { userData } = useProfile();
  const [barryContext, setBarryContext] = useState(null);
  const [isBarryLoading, setIsBarryLoading] = useState(false);
  const [barryMode, setBarryMode] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [wisStats, setWisStats] = useState({
    procedures: 0,
    parts: 0,
    bulletins: 0,
    mediaFiles: 0
  });
  const { registerWISHandler, unregisterWISHandler } = useBarry();



  // Handle Barry WIS actions
  const handleBarryWISAction = (action: string, data?: any) => {
    console.log('🤖 Barry WIS action:', action, data);

    switch (action) {
      case 'activate_barry_mode':
        setBarryMode(true);
        toast.success('Barry WIS Assistant activated!');
        // You could show a special Barry chat interface here or modify the WIS UI
        break;
      case 'deactivate_barry_mode':
        setBarryMode(false);
        toast.info('Barry WIS Assistant deactivated');
        break;
      case 'open_procedure':
        if (data && data.procedureId) {
          // This would trigger opening a procedure tab in WISProfessionalInterface
          console.log('Opening procedure:', data.procedureId);
          // You could pass this to WISProfessionalInterface via props
        }
        break;
      default:
        console.warn('Unknown Barry WIS action:', action);
    }
  };

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

  // Fetch real WIS statistics
  useEffect(() => {
    const fetchWISStats = async () => {
      try {
        const { supabase } = await import('@/lib/supabase-client');

        const [proceduresRes, partsRes, bulletinsRes, mediaRes] = await Promise.all([
          supabase.from('wis_procedures').select('id', { count: 'exact', head: true }),
          supabase.from('wis_parts').select('id', { count: 'exact', head: true }),
          supabase.from('wis_bulletins').select('id', { count: 'exact', head: true }),
          supabase.from('wis_media_files').select('id', { count: 'exact', head: true })
        ]);

        setWisStats({
          procedures: proceduresRes.count || 0,
          parts: partsRes.count || 0,
          bulletins: bulletinsRes.count || 0,
          mediaFiles: mediaRes.count || 0
        });
      } catch (error) {
        console.error('Failed to fetch WIS stats:', error);
      }
    };

    fetchWISStats();
  }, []);

  // Register Barry WIS handler on mount - prevent Hook dependency loops
  useEffect(() => {
    try {
      registerWISHandler(handleBarryWISAction);

      // Cleanup on unmount
      return () => {
        try {
          unregisterWISHandler();
        } catch (error) {
          console.error('Failed to unregister WIS handler:', error);
        }
      };
    } catch (error) {
      console.error('Failed to register WIS handler:', error);
    }
  }, []); // Remove dependencies to prevent loops

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
      <div className="container py-4">
        {/* Back Button */}
        <div className="mb-3">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Compact WIS Info Section */}
        <div className={`mb-3 text-white rounded-lg p-1.5 transition-all ${
          barryMode
            ? 'bg-gradient-to-r from-blue-600 to-blue-800'
            : 'bg-gradient-to-r from-military-green to-olive-drab'
        }`}>
          {/* Top row - Title, Description, Stats, Admin */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {barryMode ? <Bot className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
              <h1 className="text-sm font-semibold text-white/90">
                {barryMode ? 'Barry WIS Assistant' : 'Mercedes-Benz WIS Workshop System'}
              </h1>
              {barryMode ? (
                <span className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-200 rounded-full border border-blue-400/30">
                  AI ACTIVE
                </span>
              ) : (
                <span className="px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-300 rounded-full border border-yellow-500/30">
                  BETA
                </span>
              )}
              {barryMode && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white/80 hover:text-white hover:bg-white/10 px-2 py-1 text-xs"
                  onClick={() => setBarryMode(false)}
                >
                  Exit Barry Mode
                </Button>
              )}
              {isAdmin && !barryMode && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white/80 hover:text-white hover:bg-white/10 px-2 py-1 text-xs"
                  onClick={() => setTestMode(!testMode)}
                >
                  {testMode ? 'Exit Test Mode' : 'Test Database'}
                </Button>
              )}
              <span className="text-white/80 text-xs ml-2">•</span>
              <p className="text-white/80 text-xs">
                {barryMode
                  ? 'Use Barry bubble to interact with WIS'
                  : 'Professional workshop system for Unimog vehicles'
                }
              </p>
            </div>

            {/* Real stats from database */}
            <div className="flex items-center gap-3 text-xs">
              <span>📄 {wisStats.procedures + wisStats.bulletins}</span>
              <span>🎬 {wisStats.mediaFiles}</span>
              {(wisStats.procedures < 10 || wisStats.parts < 50) && (
                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-200 rounded-full border border-yellow-400/30">
                  Early Access
                </span>
              )}
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

          {/* Bottom row - Real database counts */}
          <div className="flex items-center justify-end gap-4 text-center">
            <div className="flex items-center gap-1">
              <Wrench className="w-3 h-3" />
              <span className="text-sm font-semibold">{wisStats.procedures}</span>
              <span className="text-xs text-white/80">Procedure{wisStats.procedures !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1">
              <Package className="w-3 h-3" />
              <span className="text-sm font-semibold">{wisStats.parts}</span>
              <span className="text-xs text-white/80">Part{wisStats.parts !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span className="text-sm font-semibold">{wisStats.bulletins}</span>
              <span className="text-xs text-white/80">Bulletin{wisStats.bulletins !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bot className="w-3 h-3" />
              <span className="text-sm font-semibold">Barry</span>
              <span className="text-xs text-white/80">Ready</span>
            </div>
          </div>
        </div>

        {/* Advanced WIS Interface or Test Interface */}
        <div className="relative bg-white rounded-lg border shadow-sm overflow-hidden">
          <ErrorBoundary
            onError={(error, errorInfo) => {
              console.error('WIS Interface Error Details:', {
                error: error.message,
                stack: error.stack,
                componentStack: errorInfo.componentStack,
                timestamp: new Date().toISOString(),
                url: window.location.href,
                userAgent: navigator.userAgent
              });
            }}
            fallback={
              <div className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">WIS Interface Error</h3>
                <p className="text-gray-600 mb-4">
                  The WIS interface encountered a component error. Please check the browser console for details.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-left">
                  <h4 className="text-sm font-semibold text-yellow-800 mb-2">Troubleshooting:</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Open browser console (F12) to see detailed error</li>
                    <li>• Try refreshing the page</li>
                    <li>• Clear browser cache if issue persists</li>
                    <li>• Works fine in staging? This is a production-specific issue</li>
                  </ul>
                </div>
                <div className="space-x-2">
                  <Button onClick={() => window.location.reload()} variant="outline">
                    Reload Page
                  </Button>
                  <Button onClick={() => window.open('/knowledge', '_blank')} variant="default">
                    Back to Knowledge Base
                  </Button>
                </div>
              </div>
            }
          >
            {testMode ? (
              <WISStoreTest />
            ) : (
              <WISProfessionalInterface
                barryContext={barryContext}
                onBarryRequest={handleBarryRequest}
                barryMode={barryMode}
              />
            )}
          </ErrorBoundary>
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

// Add displayName for better debugging
WISSystemPage.displayName = 'WISSystemPage';

export default WISSystemPage;