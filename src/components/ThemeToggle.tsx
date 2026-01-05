import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative w-14 h-7 rounded-full transition-all duration-500",
        "bg-secondary border border-border",
        "hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
      )}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span
        className={cn(
          "absolute top-0.5 w-6 h-6 rounded-full transition-all duration-500 flex items-center justify-center",
          "bg-primary shadow-md",
          theme === 'light' ? "left-0.5" : "left-[26px]"
        )}
      >
        {theme === 'light' ? (
          <Sun size={14} className="text-primary-foreground" />
        ) : (
          <Moon size={14} className="text-primary-foreground" />
        )}
      </span>
    </button>
  );
};
