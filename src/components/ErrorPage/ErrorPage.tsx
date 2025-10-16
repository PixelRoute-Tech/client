import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

function ErrorPage() {
  return (
           <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="text-center space-y-6 max-w-2xl">
            <div className="flex justify-center">
              <div className="rounded-full bg-destructive/10 p-6">
                <AlertTriangle className="h-16 w-16 text-destructive" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground">
                Something went wrong !
              </h1>
              <p className="text-muted-foreground">
                We're sorry, but something unexpected happened. Please try
                refreshing the page or return to the home page.
              </p>
            </div>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button onClick={this.handleReset} variant="default">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button onClick={this.handleGoHome} variant="outline">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </div>
          </div>
        </div>
  )
}

export default ErrorPage