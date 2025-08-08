import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Play, 
  Square, 
  Clock, 
  Users, 
  BookmarkPlus, 
  RefreshCw,
  AlertTriangle,
  Crown,
  Zap
} from 'lucide-react';
import { useWISEPC } from '@/hooks/use-wis-epc';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface WISEPCViewerProps {
  className?: string;
  height?: string;
}

export function WISEPCViewer({ className, height = "600px" }: WISEPCViewerProps) {
  const {
    session,
    subscription,
    isLoading,
    error,
    queuePosition,
    requestSession,
    endSession,
    refreshSession,
    usageStats,
    isAuthenticated,
    hasActiveSession,
    isInQueue,
    clearError
  } = useWISEPC();

  const [lastActivity, setLastActivity] = useState(Date.now());

  // Update activity timestamp on user interaction
  useEffect(() => {
    const handleActivity = () => setLastActivity(Date.now());
    
    if (hasActiveSession) {
      window.addEventListener('mousemove', handleActivity);
      window.addEventListener('keypress', handleActivity);
      window.addEventListener('click', handleActivity);
      
      return () => {
        window.removeEventListener('mousemove', handleActivity);
        window.removeEventListener('keypress', handleActivity);
        window.removeEventListener('click', handleActivity);
      };
    }
  }, [hasActiveSession]);

  if (!isAuthenticated) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-500" />
            Mercedes WIS EPC
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              You must be logged in to access Mercedes WIS EPC.
              <div className="mt-2 flex gap-2">
                <Button asChild size="sm">
                  <Link to="/login">Log In</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const handleStartSession = async () => {
    clearError();
    await requestSession();
  };

  const handleEndSession = async () => {
    if (window.confirm('Are you sure you want to end your WIS EPC session?')) {
      await endSession();
    }
  };

  const renderSubscriptionInfo = () => {
    if (!usageStats) return null;

    const tierColors = {
      free: 'bg-gray-100 text-gray-800',
      premium: 'bg-blue-100 text-blue-800',
      professional: 'bg-purple-100 text-purple-800'
    };

    const tierIcons = {
      free: null,
      premium: <Crown className="w-3 h-3" />,
      professional: <Zap className="w-3 h-3" />
    };

    return (
      <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className={tierColors[usageStats.tier]}>
              {tierIcons[usageStats.tier]}
              {usageStats.tier.toUpperCase()}
            </Badge>
            <span className="text-sm text-gray-600">Subscription</span>
          </div>
          {usageStats.tier === 'free' && (
            <Button size="sm" variant="outline" asChild>
              <Link to="/pricing">Upgrade</Link>
            </Button>
          )}
        </div>

        {usageStats.tier === 'free' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Monthly Usage</span>
              <span>{usageStats.usedMinutes}/{usageStats.totalMinutes} minutes</span>
            </div>
            <Progress value={usageStats.usagePercentage} className="h-2" />
            <p className="text-xs text-gray-600">
              {usageStats.remainingMinutes} minutes remaining this month
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderSessionStatus = () => {
    if (!session) return null;

    const statusConfig = {
      pending: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: <Clock className="w-4 h-4" />,
        label: 'Pending'
      },
      active: {
        color: 'bg-green-100 text-green-800',
        icon: <Play className="w-4 h-4" />,
        label: 'Active'
      },
      completed: {
        color: 'bg-gray-100 text-gray-800',
        icon: <Square className="w-4 h-4" />,
        label: 'Completed'
      },
      expired: {
        color: 'bg-red-100 text-red-800',
        icon: <AlertTriangle className="w-4 h-4" />,
        label: 'Expired'
      },
      error: {
        color: 'bg-red-100 text-red-800',
        icon: <AlertTriangle className="w-4 h-4" />,
        label: 'Error'
      }
    };

    const config = statusConfig[session.status as keyof typeof statusConfig];

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className={config.color}>
              {config.icon}
              {config.label}
            </Badge>
            {isInQueue && queuePosition && (
              <Badge variant="outline">
                <Users className="w-3 h-3 mr-1" />
                Queue #{queuePosition}
              </Badge>
            )}
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={refreshSession}
            disabled={isLoading}
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
          </Button>
        </div>

        {session.isActive && session.timeRemainingMinutes && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Session Time Remaining</span>
              <span className={session.isExpiringSoon ? 'text-red-600 font-medium' : ''}>
                {Math.floor(session.timeRemainingMinutes / 60)}h {session.timeRemainingMinutes % 60}m
              </span>
            </div>
            {session.isExpiringSoon && (
              <Alert>
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription className="text-sm">
                  Your session will expire soon. Save any important information.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {isInQueue && (
          <Alert>
            <Clock className="w-4 h-4" />
            <AlertDescription>
              You're in the queue. We'll connect you to a WIS EPC server as soon as one becomes available.
              Estimated wait time: {queuePosition ? queuePosition * 2 : 'Unknown'} minutes.
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  };

  const renderWISViewer = () => {
    if (!session?.session_url || !session.isActive) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Mercedes WIS EPC</h3>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                // TODO: Implement bookmark creation
                console.log('Create bookmark');
              }}
            >
              <BookmarkPlus className="w-4 h-4 mr-1" />
              Bookmark
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleEndSession}
              disabled={isLoading}
            >
              <Square className="w-4 h-4 mr-1" />
              End Session
            </Button>
          </div>
        </div>

        <div 
          className="border rounded-lg overflow-hidden"
          style={{ height }}
        >
          <iframe
            src={session.session_url}
            className="w-full h-full border-0"
            title="Mercedes WIS EPC"
            allow="clipboard-read; clipboard-write"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          />
        </div>

        <div className="text-sm text-gray-600 flex items-center justify-between">
          <span>Connected to WIS EPC Server</span>
          <span>Last activity: {new Date(lastActivity).toLocaleTimeString()}</span>
        </div>
      </div>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-500" />
          Mercedes WIS EPC
          <Badge variant="outline" className="ml-auto">
            Workshop Information System
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {renderSubscriptionInfo()}

        {session ? (
          <div className="space-y-4">
            {renderSessionStatus()}
            {renderWISViewer()}
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Access Mercedes WIS EPC</h3>
              <p className="text-gray-600">
                Get instant access to Mercedes Workshop Information System and Electronic Parts Catalog.
                Professional diagnostic procedures, wiring diagrams, and technical specifications.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">Workshop Procedures</h4>
                <p className="text-blue-700">Step-by-step repair instructions</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900">Parts Catalog</h4>
                <p className="text-green-700">Detailed parts diagrams and numbers</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900">Wiring Diagrams</h4>
                <p className="text-purple-700">Electrical schematics and layouts</p>
              </div>
            </div>

            <Button
              onClick={handleStartSession}
              disabled={isLoading || !usageStats?.canAccess}
              size="lg"
              className="w-full md:w-auto"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Starting Session...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start WIS EPC Session
                </>
              )}
            </Button>

            {!usageStats?.canAccess && (
              <Alert>
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>
                  You've reached your monthly usage limit. 
                  <Button asChild variant="link" className="p-0 h-auto ml-1">
                    <Link to="/pricing">Upgrade your subscription</Link>
                  </Button> 
                  for unlimited access.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}