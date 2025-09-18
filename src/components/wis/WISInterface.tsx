// WISInterface - Main WIS interface component
import React from 'react';
import { useWISActions, useWISNavigation, useWISUI } from '@/stores/wisStore';
import { cn } from '@/lib/utils';

// Import WIS components (will be created)
import { WISModelSelector } from './WISModelSelector';
import { WISSearchInterface } from './WISSearchInterface';
import { WISNavigationTree } from './WISNavigationTree';
import { WISProcedureViewer } from './WISProcedureViewer';
import { WISRelatedContent } from './WISRelatedContent';
import { WISWelcomeScreen } from './WISWelcomeScreen';
import { WISMobileInterface } from './WISMobileInterface';

// Icons
import { Menu, X, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WISInterfaceProps {
  className?: string;
  initialModel?: string;
  initialProcedure?: string;
}

const WISInterface: React.FC<WISInterfaceProps> = ({
  className,
  initialModel,
  initialProcedure,
}) => {
  const navigation = useWISNavigation();
  const ui = useWISUI();
  const actions = useWISActions();

  // Initialize with props if provided
  React.useEffect(() => {
    if (initialModel && initialModel !== navigation.selectedModel) {
      actions.setSelectedModel(initialModel);
    }
    if (initialProcedure && initialProcedure !== navigation.selectedProcedure) {
      actions.setSelectedProcedure(initialProcedure);
    }
  }, [initialModel, initialProcedure]);

  // Check if we're on mobile/tablet
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  if (isMobile) {
    return (
      <WISMobileInterface
        className={className}
        initialModel={initialModel}
        initialProcedure={initialProcedure}
      />
    );
  }

  return (
    <div className={cn("flex h-screen bg-gray-50", className)}>
      {/* Left Sidebar - Navigation */}
      <div
        className={cn(
          "bg-white border-r border-gray-200 flex flex-col transition-all duration-200",
          ui.sidebarOpen ? "w-80" : "w-0",
          !ui.sidebarOpen && "overflow-hidden"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex-shrink-0 border-b border-gray-200">
          {/* Mercedes WIS Branding */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-900 to-blue-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-gradient-to-br from-gray-800 to-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">MB</span>
                </div>
              </div>
              <div className="text-white">
                <div className="text-sm font-semibold">Mercedes-Benz</div>
                <div className="text-xs text-blue-200">Workshop Information System</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => actions.setSidebarOpen(false)}
              className="text-white hover:bg-white/10 p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Model Selection */}
          <WISModelSelector />

          {/* Search Interface */}
          <WISSearchInterface />
        </div>

        {/* Navigation Tree */}
        <div className="flex-1 overflow-hidden">
          <WISNavigationTree />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Sidebar Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => actions.setSidebarOpen(!ui.sidebarOpen)}
                className="p-2"
              >
                <Menu className="h-4 w-4" />
              </Button>

              {/* Back Button */}
              {navigation.navigationHistory.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={actions.navigateBack}
                  className="flex items-center space-x-1 px-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="text-sm">Back</span>
                </Button>
              )}

              {/* Breadcrumb */}
              {navigation.breadcrumb.length > 0 && (
                <nav className="flex items-center space-x-1 text-sm text-gray-600">
                  {navigation.breadcrumb.map((item, index) => (
                    <React.Fragment key={item.id}>
                      {index > 0 && <span className="text-gray-400">›</span>}
                      <span
                        className={cn(
                          "hover:text-gray-900 cursor-pointer",
                          index === navigation.breadcrumb.length - 1 && "text-gray-900 font-medium"
                        )}
                        onClick={() => {
                          // Navigate to this breadcrumb level
                          if (item.type === 'model') {
                            actions.setSelectedModel(item.id);
                          } else if (item.type === 'system') {
                            actions.setSelectedSystem(item.id);
                          } else if (item.type === 'component') {
                            actions.setSelectedComponent(item.id);
                          }
                        }}
                      >
                        {item.code} {item.name}
                      </span>
                    </React.Fragment>
                  ))}
                </nav>
              )}
            </div>

            {/* Loading Indicator */}
            {ui.loading && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Loading...</span>
              </div>
            )}
          </div>

          {/* Error Display */}
          {ui.error && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {ui.error}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {navigation.selectedProcedure ? (
            <WISProcedureViewer procedureId={navigation.selectedProcedure} />
          ) : (
            <WISWelcomeScreen />
          )}
        </div>
      </div>

      {/* Right Sidebar - Related Content */}
      {navigation.selectedProcedure && (
        <div className="w-72 bg-white border-l border-gray-200 flex-shrink-0">
          <WISRelatedContent procedureId={navigation.selectedProcedure} />
        </div>
      )}
    </div>
  );
};

export default WISInterface;