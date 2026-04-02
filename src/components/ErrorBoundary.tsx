// src/components/ErrorBoundary.tsx
import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { AlertCircle, RefreshCw, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  let errorTitle = 'Oops! Something went wrong';
  let errorStatus = 500;
  let errorMessage = 'An unexpected error has occurred.';

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorTitle = error.statusText || 'Navigation Error';
    errorMessage = error.data?.message || 'We couldn’t find the page you’re looking for.';
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fdfaff] dark:bg-[#09090b] p-6 transition-colors duration-500 relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-purple-500/10 dark:bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />

      <Card className="w-full max-w-md border-zinc-200/50 dark:border-white/5 bg-white/80 dark:bg-zinc-900/40 backdrop-blur-xl shadow-2xl transition-all">
        <CardHeader className="text-center space-y-4 pt-10">
          <div className="flex justify-center">
            <div className="relative group">
              {/* Soft glow behind icon */}
              <div className="absolute inset-0 bg-purple-500/20 dark:bg-purple-500/30 blur-2xl rounded-full" />
              <div className="relative flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-xl shadow-purple-500/20 transform transition-transform group-hover:rotate-3">
                <AlertCircle className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-[10px] font-bold tracking-[0.2em] text-purple-600 dark:text-purple-400 uppercase">
              System Error {errorStatus}
            </p>
            <CardTitle className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
              {errorTitle}
            </CardTitle>
            <CardDescription className="text-zinc-500 dark:text-zinc-400 text-sm max-w-[280px] mx-auto leading-relaxed">
              {errorMessage}
            </CardDescription>
          </div>
        </CardHeader>

        

        <CardFooter className="flex gap-3 pb-10 pt-4">
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="flex-1 h-12 border-zinc-200 dark:border-white/10 hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-700 dark:hover:text-purple-300 rounded-xl transition-all active:scale-[0.97]"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex-1 h-12 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-all active:scale-[0.97]"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Go Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}