import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Options = {
  enabled: boolean;
  total: number;
  onExitNext?: () => void;
  onExitPrev?: () => void;
  threshold?: number;
  cooldownMs?: number;
};

export function useArtExperienceNavigation({
  enabled,
  total,
  onExitNext,
  onExitPrev,
  threshold = 60,
  cooldownMs = 450,
}: Options) {
  const [index, setIndex] = useState(0);

  const enabledRef = useRef(enabled);
  const totalRef = useRef(total);
  const indexRef = useRef(index);
  const accRef = useRef(0);
  const lastMoveAtRef = useRef(0);

  const touchStartYRef = useRef<number | null>(null);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    totalRef.current = total;
  }, [total]);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  // Keep index valid if total changes.
  useEffect(() => {
    if (total <= 0) return;
    setIndex((prev) => Math.min(prev, total - 1));
  }, [total]);

  const canMove = useCallback(() => {
    const now = Date.now();
    if (now - lastMoveAtRef.current < cooldownMs) return false;
    lastMoveAtRef.current = now;
    return true;
  }, [cooldownMs]);

  const goToNext = useCallback(() => {
    if (!canMove()) return;
    setIndex((prev) => Math.min(prev + 1, Math.max(0, totalRef.current - 1)));
  }, [canMove]);

  const goToPrev = useCallback(() => {
    if (!canMove()) return;
    setIndex((prev) => Math.max(prev - 1, 0));
  }, [canMove]);

  const handleDirection = useCallback(
    (dir: "next" | "prev") => {
      const totalNow = totalRef.current;
      const current = indexRef.current;
      const atStart = current <= 0;
      const atEnd = totalNow > 0 ? current >= totalNow - 1 : true;

      if (dir === "next") {
        if (atEnd) {
          onExitNext?.();
          return;
        }
        goToNext();
        return;
      }

      if (atStart) {
        onExitPrev?.();
        return;
      }
      goToPrev();
    },
    [goToNext, goToPrev, onExitNext, onExitPrev]
  );

  const onWheel = useCallback(
    (e: WheelEvent) => {
      if (!enabledRef.current) return;
      if (totalRef.current <= 0) return;

      // Always block vertical scroll while enabled.
      e.preventDefault();

      accRef.current += e.deltaY;
      if (Math.abs(accRef.current) < threshold) return;

      const dir: "next" | "prev" = accRef.current > 0 ? "next" : "prev";
      accRef.current = 0;
      handleDirection(dir);
    },
    [handleDirection, threshold]
  );

  const onTouchStart = useCallback((e: TouchEvent) => {
    if (!enabledRef.current) return;
    touchStartYRef.current = e.touches[0]?.clientY ?? null;
    accRef.current = 0;
  }, []);

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!enabledRef.current) return;
      if (totalRef.current <= 0) return;
      if (touchStartYRef.current == null) return;

      // Block native scrolling/bounce while enabled.
      e.preventDefault();

      const currentY = e.touches[0]?.clientY;
      if (currentY == null) return;
      const delta = touchStartYRef.current - currentY;
      accRef.current += delta;
      touchStartYRef.current = currentY;

      if (Math.abs(accRef.current) < threshold) return;
      const dir: "next" | "prev" = accRef.current > 0 ? "next" : "prev";
      accRef.current = 0;
      handleDirection(dir);
    },
    [handleDirection, threshold]
  );

  const onTouchEnd = useCallback(() => {
    touchStartYRef.current = null;
    accRef.current = 0;
  }, []);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabledRef.current) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        handleDirection("next");
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        handleDirection("prev");
      }
    },
    [handleDirection]
  );

  const api = useMemo(
    () => ({
      index,
      setIndex,
      goToNext,
      goToPrev,
      bindToElement: (el: HTMLElement | null) => {
        if (!el) return () => undefined;

        el.addEventListener("wheel", onWheel, { passive: false });
        el.addEventListener("touchstart", onTouchStart, { passive: true });
        el.addEventListener("touchmove", onTouchMove, { passive: false });
        el.addEventListener("touchend", onTouchEnd, { passive: true });
        el.addEventListener("touchcancel", onTouchEnd, { passive: true });
        window.addEventListener("keydown", onKeyDown);

        return () => {
          el.removeEventListener("wheel", onWheel as EventListener);
          el.removeEventListener("touchstart", onTouchStart as EventListener);
          el.removeEventListener("touchmove", onTouchMove as EventListener);
          el.removeEventListener("touchend", onTouchEnd as EventListener);
          el.removeEventListener("touchcancel", onTouchEnd as EventListener);
          window.removeEventListener("keydown", onKeyDown);
        };
      },
    }),
    [index, goToNext, goToPrev, onKeyDown, onTouchEnd, onTouchMove, onTouchStart, onWheel]
  );

  return api;
}
