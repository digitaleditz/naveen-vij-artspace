import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ArtistIcon = () => (
  <svg
    viewBox="0 0 120 120"
    className="w-32 h-32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Canvas/Easel */}
    <motion.rect
      x="35"
      y="25"
      width="50"
      height="60"
      rx="2"
      className="stroke-accent"
      strokeWidth="2"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    />
    
    {/* Easel legs */}
    <motion.line
      x1="40"
      y1="85"
      x2="30"
      y2="110"
      className="stroke-muted-foreground"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    />
    <motion.line
      x1="80"
      y1="85"
      x2="90"
      y2="110"
      className="stroke-muted-foreground"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    />
    <motion.line
      x1="60"
      y1="85"
      x2="60"
      y2="105"
      className="stroke-muted-foreground"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    />

    {/* Paintbrush - animated */}
    <motion.g
      initial={{ x: 10, y: 10, rotate: -20 }}
      animate={{ 
        x: [10, 15, 5, 12, 8],
        y: [10, 5, 12, 8, 10],
        rotate: [-20, -15, -25, -18, -20]
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* Brush handle */}
      <motion.line
        x1="70"
        y1="35"
        x2="95"
        y2="15"
        className="stroke-foreground"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Brush tip */}
      <motion.ellipse
        cx="68"
        cy="38"
        rx="4"
        ry="6"
        className="fill-accent"
        initial={{ scale: 0.8 }}
        animate={{ scale: [0.8, 1, 0.8] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </motion.g>

    {/* Paint strokes appearing on canvas */}
    <motion.path
      d="M45 40 Q 50 35, 55 42 T 65 38"
      className="stroke-accent"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
    />
    <motion.path
      d="M48 55 Q 55 50, 62 55 T 72 52"
      className="stroke-muted-foreground"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
    />
    <motion.path
      d="M50 70 Q 58 65, 66 70"
      className="stroke-accent/60"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.2, delay: 1.1, ease: "easeOut" }}
    />
  </svg>
);

interface PageLoaderProps {
  isLoading: boolean;
  minDuration?: number;
}

export const PageLoader = ({ isLoading, minDuration = 800 }: PageLoaderProps) => {
  const [showLoader, setShowLoader] = useState(isLoading);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (!isLoading) {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDuration - elapsed);
      
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, remaining);
      
      return () => clearTimeout(timer);
    } else {
      setShowLoader(true);
    }
  }, [isLoading, minDuration, startTime]);

  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center"
        >
          <ArtistIcon />
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-8 text-center"
          >
            <p className="font-serif text-xl text-foreground">
              Naveen <span className="text-accent">Vij</span>
            </p>
            <motion.p
              className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Preparing the gallery
            </motion.p>
          </motion.div>

          {/* Minimal loading bar */}
          <motion.div
            className="absolute bottom-16 left-1/2 -translate-x-1/2 w-24 h-px bg-border overflow-hidden"
          >
            <motion.div
              className="h-full bg-accent"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
