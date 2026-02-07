import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { PageLoader } from "@/components/ui/PageLoader";

interface RouteTransitionProps {
  children: React.ReactNode;
}

export const RouteTransition = ({ children }: RouteTransitionProps) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      setIsTransitioning(true);
      prevPathRef.current = location.pathname;
      
      // Reset after a short delay to allow PageLoader's minDuration to control timing
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return (
    <>
      <PageLoader isLoading={isTransitioning} minDuration={2500} />
      {children}
    </>
  );
};
