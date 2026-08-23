import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePageTracking } from "@/hooks/usePageTracking";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  usePageTracking();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);


  return null;
};

export default ScrollToTop;