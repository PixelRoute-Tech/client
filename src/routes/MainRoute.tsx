import React from 'react'
import { RouterProvider } from 'react-router-dom'
import router from '@/routes/routes'
import { SplashScreen } from '@/components/ui/splash-screen';
import { useAuth } from '@/hooks/useAuth';

function MainRoute() {
  const {loading,stopLoading} = useAuth()
  const handleSplashComplete = () => {
    stopLoading();
  };

  if (loading) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }
  return (
   <RouterProvider router={router} />
  )
}

export default MainRoute