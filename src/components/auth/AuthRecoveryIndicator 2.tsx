/**
 * Auth Recovery Indicator Component
 * Shows user-friendly loading states and recovery status
 */

import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  RefreshCw, 
  Shield, 
  Wifi,
  WifiOff,
  Loader2,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AuthRecoveryIndicatorProps {
  className?: string;
  showDetails?: boolean;
  showActions?: boolean;
}

export const AuthRecoveryIndicator: React.FC<AuthRecoveryIndicatorProps> = ({
  className,
  showDetails = true,
  showActions = true
}) => {
  const { 
    loadingState, 
    recoveryState, 
    isRecoveryAvailable,
    forceRefresh,
    triggerRecovery,
    clearRecoveryError
  } = useAuth();

  // Determine overall status
  const isAnyLoading = Object.values(loadingState).some(loading => loading);
  const hasErrors = !!recoveryState.recoveryError;
  const isHealthy = !isAnyLoading && !hasErrors && !recoveryState.circuitBreakerOpen;

  // Calculate recovery progress
  const getRecoveryProgress = () => {
    if (!recoveryState.isRecovering) return 0;
    if (recoveryState.recoveryAttempts === 0) return 10;
    return Math.min((recoveryState.recoveryAttempts / 5) * 90, 90);
  };

  // Get status color and icon
  const getStatusInfo = () => {
    if (recoveryState.circuitBreakerOpen) {
      return {
        color: 'destructive',
        icon: AlertCircle,
        text: 'Recovery Blocked',
        description: 'Too many failures - recovery system is in cooldown mode'
      };
    }
    
    if (hasErrors) {
      return {
        color: 'destructive',
        icon: AlertCircle,
        text: 'Recovery Failed',
        description: recoveryState.recoveryError
      };
    }
    
    if (recoveryState.isRecovering) {
      return {
        color: 'default',
        icon: RefreshCw,
        text: 'Recovering',
        description: `Attempt ${recoveryState.recoveryAttempts}/5`
      };
    }
    
    if (isAnyLoading) {
      if (loadingState.initializing) {
        return {
          color: 'default',
          icon: Loader2,
          text: 'Initializing',
          description: 'Setting up authentication system'
        };
      }
      if (loadingState.authenticating) {
        return {
          color: 'default',
          icon: Shield,
          text: 'Authenticating',
          description: 'Verifying credentials'
        };
      }
      if (loadingState.refreshing) {
        return {
          color: 'default',
          icon: RefreshCw,
          text: 'Refreshing',
          description: 'Updating session'
        };
      }
      if (loadingState.recovering) {
        return {
          color: 'default',
          icon: RefreshCw,
          text: 'Recovering',
          description: 'Attempting to restore connection'
        };
      }
      if (loadingState.signingOut) {
        return {
          color: 'default',
          icon: Loader2,
          text: 'Signing Out',
          description: 'Ending session'
        };
      }
    }
    
    if (isHealthy) {
      return {
        color: 'default',
        icon: CheckCircle,
        text: 'Connected',
        description: 'Authentication system is working normally'
      };
    }
    
    return {
      color: 'secondary',
      icon: Clock,
      text: 'Ready',
      description: 'Authentication system ready'
    };
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  // Don't show anything if everything is normal and not requested
  if (!showDetails && isHealthy && !isAnyLoading) {
    return null;
  }

  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusIcon 
              className={cn(
                'h-4 w-4',
                statusInfo.color === 'destructive' && 'text-red-500',
                statusInfo.icon === RefreshCw && 'animate-spin',
                statusInfo.icon === Loader2 && 'animate-spin'
              )} 
            />
            <CardTitle className="text-sm font-medium">
              {statusInfo.text}
            </CardTitle>
          </div>
          
          <div className="flex items-center gap-1">
            {/* Environment status */}
            {recoveryState.environmentCheckPassed ? (
              <Wifi className="h-3 w-3 text-green-500" title="Environment OK" />
            ) : (
              <WifiOff className="h-3 w-3 text-red-500" title="Environment Issues" />
            )}
            
            {/* Recovery availability */}
            {isRecoveryAvailable && (
              <Shield className="h-3 w-3 text-blue-500" title="Recovery Available" />
            )}
          </div>
        </div>
        
        <CardDescription className="text-xs">
          {statusInfo.description}
        </CardDescription>
      </CardHeader>

      {showDetails && (
        <CardContent className="pt-0 space-y-3">
          {/* Recovery Progress */}
          {recoveryState.isRecovering && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Recovery Progress</span>
                <span>{Math.round(getRecoveryProgress())}%</span>
              </div>
              <Progress value={getRecoveryProgress()} className="h-1" />
            </div>
          )}

          {/* Loading States */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between">
              <span>Initializing</span>
              <Badge 
                variant={loadingState.initializing ? 'default' : 'secondary'} 
                className="h-4 px-1"
              >
                {loadingState.initializing ? <Loader2 className="h-2 w-2 animate-spin" /> : '✓'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Auth</span>
              <Badge 
                variant={loadingState.authenticating ? 'default' : 'secondary'} 
                className="h-4 px-1"
              >
                {loadingState.authenticating ? <Loader2 className="h-2 w-2 animate-spin" /> : '✓'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Refresh</span>
              <Badge 
                variant={loadingState.refreshing ? 'default' : 'secondary'} 
                className="h-4 px-1"
              >
                {loadingState.refreshing ? <RefreshCw className="h-2 w-2 animate-spin" /> : '✓'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Recovery</span>
              <Badge 
                variant={loadingState.recovering ? 'default' : 'secondary'} 
                className="h-4 px-1"
              >
                {loadingState.recovering ? <RefreshCw className="h-2 w-2 animate-spin" /> : '✓'}
              </Badge>
            </div>
          </div>

          {/* Recovery Statistics */}
          {(recoveryState.recoveryAttempts > 0 || recoveryState.lastRecoveryTime) && (
            <div className="text-xs space-y-1 p-2 bg-muted rounded">
              {recoveryState.recoveryAttempts > 0 && (
                <div className="flex justify-between">
                  <span>Recovery Attempts:</span>
                  <span>{recoveryState.recoveryAttempts}</span>
                </div>
              )}
              {recoveryState.lastRecoveryTime && (
                <div className="flex justify-between">
                  <span>Last Recovery:</span>
                  <span>
                    {new Date(recoveryState.lastRecoveryTime).toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Error Display */}
          {hasErrors && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                {recoveryState.recoveryError}
              </AlertDescription>
            </Alert>
          )}

          {/* Circuit Breaker Warning */}
          {recoveryState.circuitBreakerOpen && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Recovery system is temporarily disabled due to repeated failures. 
                Please wait before trying again.
              </AlertDescription>
            </Alert>
          )}

          {/* Environment Issues */}
          {!recoveryState.environmentCheckPassed && (
            <Alert variant="destructive">
              <Settings className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Environment configuration issues detected. Please check your setup.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      )}

      {/* Action Buttons */}
      {showActions && (
        <CardContent className="pt-0">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={forceRefresh}
              disabled={isAnyLoading || recoveryState.circuitBreakerOpen}
              className="flex-1"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
            
            {isRecoveryAvailable && (
              <Button
                variant="outline"
                size="sm"
                onClick={triggerRecovery}
                disabled={
                  isAnyLoading || 
                  recoveryState.isRecovering || 
                  recoveryState.circuitBreakerOpen
                }
                className="flex-1"
              >
                <Shield className="h-3 w-3 mr-1" />
                Recover
              </Button>
            )}
            
            {hasErrors && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearRecoveryError}
                className="px-2"
              >
                ✕
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

/**
 * Minimal Loading Indicator for inline use
 */
export const AuthLoadingIndicator: React.FC<{ className?: string }> = ({ className }) => {
  const { loadingState, recoveryState } = useAuth();
  
  const isAnyLoading = Object.values(loadingState).some(loading => loading);
  const isRecovering = recoveryState.isRecovering;
  
  if (!isAnyLoading && !isRecovering) {
    return null;
  }
  
  return (
    <div className={cn('flex items-center gap-2 text-sm text-muted-foreground', className)}>
      <Loader2 className="h-3 w-3 animate-spin" />
      <span>
        {loadingState.initializing && 'Initializing...'}
        {loadingState.authenticating && 'Authenticating...'}
        {loadingState.refreshing && 'Refreshing session...'}
        {loadingState.recovering && 'Recovering connection...'}
        {loadingState.signingOut && 'Signing out...'}
        {isRecovering && !Object.values(loadingState).some(l => l) && 'Recovering...'}
      </span>
    </div>
  );
};

/**
 * Status Badge for minimal status indication
 */
export const AuthStatusBadge: React.FC<{ className?: string }> = ({ className }) => {
  const { loadingState, recoveryState, isRecoveryAvailable } = useAuth();
  
  const isAnyLoading = Object.values(loadingState).some(loading => loading);
  const hasErrors = !!recoveryState.recoveryError;
  const isHealthy = !isAnyLoading && !hasErrors && !recoveryState.circuitBreakerOpen;
  
  if (isHealthy) {
    return (
      <Badge variant="secondary" className={cn('text-xs', className)}>
        <CheckCircle className="h-2 w-2 mr-1" />
        Connected
      </Badge>
    );
  }
  
  if (recoveryState.circuitBreakerOpen) {
    return (
      <Badge variant="destructive" className={cn('text-xs', className)}>
        <AlertCircle className="h-2 w-2 mr-1" />
        Blocked
      </Badge>
    );
  }
  
  if (hasErrors) {
    return (
      <Badge variant="destructive" className={cn('text-xs', className)}>
        <AlertCircle className="h-2 w-2 mr-1" />
        Error
      </Badge>
    );
  }
  
  if (isAnyLoading || recoveryState.isRecovering) {
    return (
      <Badge variant="default" className={cn('text-xs', className)}>
        <Loader2 className="h-2 w-2 mr-1 animate-spin" />
        Loading
      </Badge>
    );
  }
  
  return null;
};

export default AuthRecoveryIndicator;