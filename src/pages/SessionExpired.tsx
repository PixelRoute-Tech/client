import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

const SessionExpired = () => {
  const navigate = useNavigate();
  const {setUser} = useAuth()
  const handleBackToLogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    setUser(null)
    localStorage.clear();
    sessionStorage.clear();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8 space-y-6 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-6">
            <LogOut className="h-16 w-16 text-primary" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Session Expired
          </h1>
          <p className="text-muted-foreground">
            Your session has expired or you're not logged in. Please sign in again to continue.
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Session timed out due to inactivity</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span>Authentication required to access this page</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Button onClick={handleBackToLogin} size="lg" className="w-full">
            Sign In Again
          </Button>
          {/* <Button onClick={handleGoHome} variant="outline" size="lg" className="w-full">
            Go to Home
          </Button> */}
        </div>
      </Card>
    </div>
  );
};

export default SessionExpired;
