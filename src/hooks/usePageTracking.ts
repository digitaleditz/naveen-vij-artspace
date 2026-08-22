import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const VISITOR_KEY = "nv_visitor_id";
const SESSION_KEY = "nv_session_id";

const getId = (storage: Storage, key: string) => {
  try {
    let id = storage.getItem(key);
    if (!id) {
      id = crypto.randomUUID();
      storage.setItem(key, id);
    }
    return id;
  } catch {
    return "unknown";
  }
};

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Don't track admin browsing
    if (location.pathname.startsWith("/admin")) return;

    const visitorId = getId(localStorage, VISITOR_KEY);
    const sessionId = getId(sessionStorage, SESSION_KEY);

    supabase
      .from("page_views" as any)
      .insert({
        visitor_id: visitorId,
        session_id: sessionId,
        path: location.pathname,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
      } as any)
      .then(() => undefined);
  }, [location.pathname]);
};
