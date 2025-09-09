/**
 * Global Error Boundary Component
 * Catches and handles all React errors gracefully
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }
  
  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service
    console.error('Error Boundary Caught:', error, errorInfo);
    
    // Track error metrics
    if (typeof window !== 'undefined') {
      const errorData = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      };
      
      // Send to monitoring service (if configured)
      this.logErrorToService(errorData);
    }
    
    this.setState(prevState => ({
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));
  }
  
  private logErrorToService(errorData: any) {
    // In production, send to error tracking service
    if (import.meta.env.PROD) {
      fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorData)
      }).catch(err => {
        console.error('Failed to log error:', err);
      });
    }
  }
  
  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };
  
  private handleReload = () => {
    window.location.reload();
  };
  
  private handleGoHome = () => {
    window.location.href = '/';
  };
  
  private getErrorMessage(): string {
    const { error } = this.state;
    
    if (!error) return 'An unexpected error occurred';
    
    // User-friendly error messages
    if (error.message.includes('Network')) {
      return 'Network connection issue. Please check your internet connection.';
    }
    
    if (error.message.includes('Permission') || error.message.includes('401')) {
      return 'You don\'t have permission to access this resource.';
    }
    
    if (error.message.includes('404')) {
      return 'The requested resource was not found.';
    }
    
    if (error.message.includes('500')) {
      return 'Server error. Our team has been notified.';
    }
    
    // Generic message for production
    if (import.meta.env.PROD) {
      return 'Something went wrong. Please try again.';
    }
    
    // Show actual error in development
    return error.message;
  }
  
  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }
      
      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <div className="max-w-md w-full space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Oops! Something went wrong</AlertTitle>
              <AlertDescription className="mt-2">
                {this.getErrorMessage()}
              </AlertDescription>
            </Alert>
            
            {/* Show technical details in development */}
            {!import.meta.env.PROD && this.state.error && (
              <Alert>
                <AlertTitle>Technical Details</AlertTitle>
                <AlertDescription className="mt-2">
                  <details className="text-xs">
                    <summary className="cursor-pointer">Stack Trace</summary>
                    <pre className="mt-2 whitespace-pre-wrap text-xs overflow-auto max-h-40">
                      {this.state.error.stack}
                    </pre>
                  </details>
                  {this.state.errorInfo && (
                    <details className="text-xs mt-2">
                      <summary className="cursor-pointer">Component Stack</summary>
                      <pre className="mt-2 whitespace-pre-wrap text-xs overflow-auto max-h-40">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </AlertDescription>
              </Alert>
            )}
            
            {/* Recovery actions */}
            <div className="flex gap-2">
              <Button onClick={this.handleReset} variant="default" className="flex-1">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button onClick={this.handleReload} variant="outline" className="flex-1">
                Reload Page
              </Button>
            </div>
            
            <Button onClick={this.handleGoHome} variant="ghost" className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Button>
            
            {/* Error count warning */}
            {this.state.errorCount > 2 && (
              <Alert>
                <AlertDescription>
                  Multiple errors detected. If this continues, please contact support.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Hook for using error boundary programmatically
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error:', error, errorInfo);
    throw error; // This will be caught by the nearest ErrorBoundary
  };
}