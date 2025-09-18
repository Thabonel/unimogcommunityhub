// WISNavigationTree - Hierarchical tree navigation component
import React from 'react';
import { useWISTree } from '@/hooks/useWIS';
import { useWISActions, useWISNavigation, useWISUI, useWISSearch } from '@/stores/wisStore';
import { WISTreeNode } from '@/stores/wisStore';
import { cn } from '@/lib/utils';

// UI Components
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// Icons
import {
  ChevronRight,
  ChevronDown,
  FileText,
  Folder,
  FolderOpen,
  Cog,
  Zap,
  Truck,
  Settings,
  Wrench,
  Shield,
  Car,
  AlertCircle,
} from 'lucide-react';

interface WISNavigationTreeProps {
  className?: string;
}

// System icons mapping
const SYSTEM_ICONS = {
  engine: Cog,
  fuel: Cog,
  cooling: Cog,
  exhaust: Cog,
  computer: Zap,
  clutch: Settings,
  transmission: Cog,
  transfer: Settings,
  axle: Truck,
  suspension: Car,
  steering: Settings,
  brakes: Shield,
  body: Car,
  electric: Zap,
  hydraulic: Wrench,
  info: AlertCircle,
};

const WISSystemIcon: React.FC<{ name?: string; className?: string }> = ({
  name,
  className = "h-4 w-4",
}) => {
  const IconComponent = name ? SYSTEM_ICONS[name as keyof typeof SYSTEM_ICONS] : Folder;
  return <IconComponent className={className} />;
};

const WISTreeNodeComponent: React.FC<{
  node: WISTreeNode;
  level: number;
  isSelected: boolean;
  isExpanded: boolean;
  onNodeClick: (node: WISTreeNode) => void;
  onToggleExpansion: (nodeId: string) => void;
}> = ({
  node,
  level,
  isSelected,
  isExpanded,
  onNodeClick,
  onToggleExpansion,
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const isProcedure = node.type === 'procedure';

  return (
    <div className="select-none">
      {/* Node Content */}
      <div
        className={cn(
          "flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer text-sm transition-colors",
          `ml-${level * 4}`,
          isSelected && "bg-blue-50 border-r-2 border-blue-500 text-blue-900",
          isProcedure && "text-gray-700"
        )}
        onClick={() => onNodeClick(node)}
      >
        {/* Expand/Collapse Button */}
        {hasChildren && (
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-4 w-4 hover:bg-gray-200"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpansion(node.id);
            }}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
        )}

        {/* Node Icon */}
        <div className="flex-shrink-0">
          {node.type === 'model' && <Truck className="h-4 w-4 text-blue-600" />}
          {node.type === 'system' && (
            <WISSystemIcon name={node.icon_name} className="h-4 w-4 text-gray-600" />
          )}
          {node.type === 'component' && (
            hasChildren ? (
              isExpanded ? (
                <FolderOpen className="h-4 w-4 text-yellow-600" />
              ) : (
                <Folder className="h-4 w-4 text-yellow-600" />
              )
            ) : (
              <Folder className="h-4 w-4 text-gray-500" />
            )
          )}
          {node.type === 'procedure' && <FileText className="h-3 w-3 text-blue-600" />}
        </div>

        {/* Node Text Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {/* Code */}
            <span
              className={cn(
                "font-medium",
                node.type === 'model' && "text-blue-700",
                node.type === 'system' && "text-gray-700",
                node.type === 'component' && "text-gray-700",
                node.type === 'procedure' && "text-blue-600 font-mono text-xs"
              )}
            >
              {node.code}
            </span>

            {/* Name */}
            <span className="truncate text-gray-800">
              {node.name}
            </span>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Procedure count */}
          {node.procedure_count > 0 && node.type !== 'procedure' && (
            <Badge variant="secondary" className="text-xs px-1.5 py-0">
              {node.procedure_count}
            </Badge>
          )}

          {/* Estimated time */}
          {node.estimated_time && (
            <Badge variant="outline" className="text-xs text-blue-600 px-1.5 py-0">
              {node.estimated_time}h
            </Badge>
          )}
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && node.children && (
        <div className="space-y-0">
          {node.children.map((child) => (
            <WISTreeNodeComponent
              key={child.id}
              node={child}
              level={level + 1}
              isSelected={child.id === getSelectedNodeId(child)}
              isExpanded={isNodeExpanded(child.id)}
              onNodeClick={onNodeClick}
              onToggleExpansion={onToggleExpansion}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Helper function to determine if node is selected based on navigation state
const getSelectedNodeId = (node: WISTreeNode): string | undefined => {
  // This would be implemented to return the currently selected node ID
  // based on the navigation state and node type
  return undefined; // Placeholder
};

// Helper function to check if node is expanded
const isNodeExpanded = (nodeId: string): boolean => {
  // This would check the expanded nodes set in the store
  return false; // Placeholder
};

export const WISNavigationTree: React.FC<WISNavigationTreeProps> = ({
  className,
}) => {
  const navigation = useWISNavigation();
  const ui = useWISUI();
  const actions = useWISActions();
  const search = useWISSearch();

  const { data: treeData, isLoading, error } = useWISTree(
    navigation.selectedModel,
    ui.viewMode === 'search' ? search.query : undefined
  );

  const handleNodeClick = (node: WISTreeNode) => {
    switch (node.type) {
      case 'model':
        actions.setSelectedModel(node.id);
        break;
      case 'system':
        actions.setSelectedSystem(node.id);
        break;
      case 'component':
        actions.setSelectedComponent(node.id);
        break;
      case 'procedure':
        actions.setSelectedProcedure(node.id);
        break;
    }
  };

  const handleToggleExpansion = (nodeId: string) => {
    actions.toggleNodeExpansion(nodeId);
  };

  // Show loading skeleton
  if (isLoading) {
    return (
      <div className={cn("p-4", className)}>
        <div className="space-y-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <div className="ml-4 space-y-1">
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-6 w-4/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={cn("p-4", className)}>
        <div className="flex items-center justify-center h-32 text-red-600">
          <div className="text-center space-y-2">
            <AlertCircle className="h-8 w-8 mx-auto" />
            <p className="text-sm">Failed to load navigation tree</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state
  if (!treeData || treeData.length === 0) {
    return (
      <div className={cn("p-4", className)}>
        <div className="flex items-center justify-center h-32 text-gray-500">
          <div className="text-center space-y-2">
            <Folder className="h-8 w-8 mx-auto" />
            <p className="text-sm">
              {navigation.selectedModel
                ? "No data available for this model"
                : "Select a vehicle model to begin"
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className={cn("flex-1", className)}>
      <div className="p-2 space-y-1">
        {treeData.map((rootNode) => (
          <WISTreeNodeComponent
            key={rootNode.id}
            node={rootNode}
            level={0}
            isSelected={rootNode.id === navigation.selectedModel}
            isExpanded={navigation.expandedNodes.has(rootNode.id)}
            onNodeClick={handleNodeClick}
            onToggleExpansion={handleToggleExpansion}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

