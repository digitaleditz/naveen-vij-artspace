import { useState, useEffect } from "react";
import { PageLoader } from "@/components/ui/PageLoader";

interface InitialLoaderProps {
  children: React.ReactNode;
}

export const InitialLoader = ({ children }: InitialLoaderProps) => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Check if document is already loaded
    if (document.readyState === "complete") {
      const timer = setTimeout(() => setIsInitialLoad(false), 100);
      return () => clearTimeout(timer);
    }

    const handleLoad = () => {
      setTimeout(() => setIsInitialLoad(false), 100);
    };

    window.addEventListener("load", handleLoad);
    return () => window.removeEventListener("load", handleLoad);
  }, []);

  return (
    <>
      <PageLoader isLoading={isInitialLoad} minDuration={3000} />
      {children}
    </>
  );
};
