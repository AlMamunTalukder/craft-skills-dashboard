// src/components/ErrorBoundary.tsx
import { useEffect } from 'react';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorPageProps {
  status?: number;
  message?: string;
}

export default function ErrorPage({ status, message }: ErrorPageProps) {
  const error = useRouteError();
  
  console.error('Route Error:', error);

  let errorTitle = 'Oops! Something went wrong';
  let errorMessage = message || 'An unexpected error has occurred.';
  let errorStatus = status || 500;

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorTitle = `${error.status} ${error.statusText}`;
    errorMessage = error.data?.message || error.statusText || 'Page not found';
  } else if (error instanceof Error) {
    errorMessage = error.message;
    errorTitle = 'Application Error';
  }

  useEffect(() => {
    // Log error to error tracking service
    console.error('Error occurred:', {
      status: errorStatus,
      message: errorMessage,
      error: error,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    });
  }, [errorStatus, errorMessage, error]);

  const getErrorMessage = () => {
    switch (errorStatus) {
      case 400:
        return 'Bad Request. The server could not understand the request.';
      case 401:
        return 'Unauthorized. Please log in to access this page.';
      case 403:
        return 'Forbidden. You do not have permission to access this resource.';
      case 404:
        return 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.';
      case 500:
        return 'Internal Server Error. Our team has been notified.';
      case 502:
        return 'Bad Gateway. The server received an invalid response.';
      case 503:
        return 'Service Unavailable. The server is temporarily unable to handle the request.';
      default:
        return errorMessage;
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-red-100 p-4">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            {errorStatus} - {errorTitle}
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            {getErrorMessage()}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Error Details:</p>
            <code className="text-xs text-gray-800 break-words">
              {error instanceof Error ? error.stack : JSON.stringify(error, null, 2)}
            </code>
          </div>
          
          {errorStatus === 404 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                Check if you typed the URL correctly or use the navigation menu.
              </p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={handleGoHome}
            variant="default"
            className="gap-2"
          >
            <Home className="h-4 w-4" />
            Go to Dashboard
          </Button>
          
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Page
          </Button>
          
          <Button
            onClick={() => window.history.back()}
            variant="ghost"
          >
            Go Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}