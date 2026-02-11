/**
 * OCR Status Indicator Component
 * Visual indicator for OCR processing status with confidence scores
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  Eye,
  FileText,
  Zap
} from 'lucide-react';
import { OcrStatus } from '@/services/vehicle-ocr-service';

interface OCRStatusIndicatorProps {
  status: OcrStatus;
  confidence?: number;
  className?: string;
  showProgress?: boolean;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  processingProgress?: number; // 0-100 for processing animation
}

const statusConfig = {
  pending: {
    icon: Clock,
    label: 'Pending',
    description: 'Waiting to be processed',
    variant: 'secondary' as const,
    color: 'text-khaki-tan',
    bgColor: 'bg-khaki-tan/10',
    animate: false
  },
  processing: {
    icon: Loader2,
    label: 'Processing',
    description: 'Extracting data from receipt',
    variant: 'default' as const,
    color: 'text-military-green',
    bgColor: 'bg-military-green/10',
    animate: true
  },
  completed: {
    icon: CheckCircle,
    label: 'Completed',
    description: 'Data extracted successfully',
    variant: 'default' as const,
    color: 'text-military-green',
    bgColor: 'bg-military-green/10',
    animate: false
  },
  needs_review: {
    icon: Eye,
    label: 'Needs Review',
    description: 'Low confidence - requires manual review',
    variant: 'destructive' as const,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    animate: false
  },
  failed: {
    icon: XCircle,
    label: 'Failed',
    description: 'Processing failed - try again',
    variant: 'destructive' as const,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    animate: false
  }
} as const;

const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 0.8) return 'text-military-green';
  if (confidence >= 0.6) return 'text-amber-600';
  return 'text-red-600';
};

const getConfidenceLabel = (confidence: number): string => {
  if (confidence >= 0.9) return 'Excellent';
  if (confidence >= 0.8) return 'Good';
  if (confidence >= 0.6) return 'Fair';
  return 'Poor';
};

export const OCRStatusIndicator: React.FC<OCRStatusIndicatorProps> = ({
  status,
  confidence,
  className,
  showProgress = true,
  showText = false,
  size = 'md',
  processingProgress = 0
}) => {
  const config = statusConfig[status];
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: {
      icon: 'h-3 w-3',
      badge: 'text-xs px-2 py-0.5',
      progress: 'h-1'
    },
    md: {
      icon: 'h-4 w-4',
      badge: 'text-xs px-2.5 py-0.5',
      progress: 'h-2'
    },
    lg: {
      icon: 'h-5 w-5',
      badge: 'text-sm px-3 py-1',
      progress: 'h-3'
    }
  };

  const renderStatusBadge = () => (
    <Badge
      variant={config.variant}
      className={cn(
        'inline-flex items-center gap-1.5 font-medium border-2',
        sizeClasses[size].badge,
        config.bgColor,
        'border-current/20',
        className
      )}
    >
      <IconComponent
        className={cn(
          sizeClasses[size].icon,
          config.color,
          config.animate && 'animate-spin'
        )}
      />
      {showText && config.label}
    </Badge>
  );

  const renderProcessingProgress = () => {
    if (status === 'processing' && showProgress) {
      return (
        <div className="mt-2 space-y-1">
          <Progress
            value={processingProgress}
            className={cn(sizeClasses[size].progress, 'bg-military-green/20')}
          />
          <p className="text-xs text-muted-foreground text-center">
            Processing... {Math.round(processingProgress)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const renderConfidenceScore = () => {
    if (confidence !== undefined && status === 'completed' && showProgress) {
      return (
        <div className="mt-2 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Confidence</span>
            <span className={cn('font-medium', getConfidenceColor(confidence))}>
              {getConfidenceLabel(confidence)} ({Math.round(confidence * 100)}%)
            </span>
          </div>
          <Progress
            value={confidence * 100}
            className={cn(sizeClasses[size].progress)}
          />
        </div>
      );
    }
    return null;
  };

  const content = (
    <div className={cn('flex flex-col', className)}>
      {renderStatusBadge()}
      {renderProcessingProgress()}
      {renderConfidenceScore()}
    </div>
  );

  if (showText || showProgress) {
    return content;
  }

  // For compact display, wrap in tooltip
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <IconComponent className="h-4 w-4" />
              <span className="font-medium">{config.label}</span>
            </div>
            <p className="text-sm text-muted-foreground">{config.description}</p>
            {confidence !== undefined && (
              <div className="pt-1 border-t border-border/50">
                <div className="flex items-center justify-between text-sm">
                  <span>Confidence:</span>
                  <span className={getConfidenceColor(confidence)}>
                    {Math.round(confidence * 100)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

/**
 * Compact OCR Status Icon - minimal display for tables/lists
 */
export const OCRStatusIcon: React.FC<{
  status: OcrStatus;
  confidence?: number;
  className?: string;
}> = ({ status, confidence, className }) => {
  const config = statusConfig[status];
  const IconComponent = config.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn('inline-flex items-center', className)}>
            <IconComponent
              className={cn(
                'h-4 w-4',
                config.color,
                config.animate && 'animate-spin'
              )}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <IconComponent className="h-3 w-3" />
              <span className="font-medium">{config.label}</span>
            </div>
            {confidence !== undefined && (
              <p className="text-xs text-muted-foreground">
                Confidence: {Math.round(confidence * 100)}%
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

/**
 * OCR Processing Animation - for use during active processing
 */
export const OCRProcessingAnimation: React.FC<{
  className?: string;
}> = ({ className }) => {
  return (
    <div className={cn('flex items-center gap-2 text-military-green', className)}>
      <Loader2 className="h-4 w-4 animate-spin" />
      <div className="flex items-center gap-1">
        <FileText className="h-4 w-4" />
        <Zap className="h-3 w-3 animate-pulse" />
        <span className="text-sm font-medium">Extracting data...</span>
      </div>
    </div>
  );
};