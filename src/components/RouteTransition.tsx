import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PageLoader } from "@/components/ui/PageLoader";

interface RouteTransitionProps {
  children: React.ReactNode;
}

export const RouteTransition = ({ children }: RouteTransitionProps) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [prevPath, setPrevPath] = useState(location.pathname);

  useEffect(() => {
    if (prevPath !== location.pathname) {
      setIsLoading(true);
      setPrevPath(location.pathname);
      
      // Simulate loading time for route transition
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [location.pathname, prevPath]);

  return (
    <>
      <PageLoader isLoading={isLoading} minDuration={600} />
      {children}
    </>
  );
};
