"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PATHS, type PathType } from "@/lib/paths";
import { Button } from "@/components/ui/Button";

type PathToggleBoxProps = {
  onContinue?: (type: PathType) => void;
  className?: string;
  variant?: "default" | "hero";
  layoutId?: string;
  hideHeader?: boolean;
};

export function PathToggleBox({
  onContinue,
  className,
  variant = "default",
  layoutId = "path-toggle-indicator",
  hideHeader = false,
}: PathToggleBoxProps) {
  const [active, setActive] = useState<PathType | null>(null);
  const path = active ? PATHS.find((p) => p.type === active)! : null;
  const isHero = variant === "hero";

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 sm:p-6",
        isHero
          ? "border-border/80 bg-white/90 shadow-sm backdrop-blur-xl"
          : "border-border bg-white shadow-[0_8px_40px_rgba(0,0,0,0.06)]",
        !isHero && "max-w-lg",
        className
      )}
    >
      {!hideHeader && (
        <div className="space-y-1">
          <p className="text-base font-semibold text-text-light sm:text-lg">
            How can we help you today?
          </p>
          <p className="text-sm text-text-secondary">
            Select the option that best describes you.
          </p>
        </div>
      )}

      <div
        role="tablist"
        aria-label="Choose your path"
        className={cn(
          "relative flex rounded-full p-1",
          hideHeader ? "mt-0" : "mt-5",
          isHero ? "bg-bg-secondary" : "border border-border bg-bg-secondary"
        )}
      >
        {PATHS.map((item) => (
          <button
            key={item.type}
            type="button"
            role="tab"
            aria-selected={active === item.type}
            onClick={() => setActive(item.type)}
            className={cn(
              "relative z-10 flex-1 rounded-full py-2.5 text-sm font-medium transition-colors duration-300 sm:py-3",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
              active === item.type
                ? "text-white"
                : "text-text-secondary hover:text-text-light"
            )}
          >
            {active === item.type && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-accent"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{item.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {path && (
          <motion.div
            key={path.type}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="mt-5 border-t border-border pt-5 sm:mt-6 sm:pt-6"
          >
            <p className="text-sm leading-relaxed text-text-secondary sm:text-base">
              {path.description}
            </p>
            <div className={cn("mt-5", isHero && "sm:mt-6")}>
              {onContinue ? (
                <Button
                  type="button"
                  size={isHero ? "md" : "lg"}
                  className={cn(isHero ? "w-full sm:w-auto" : "w-full")}
                  onClick={() => onContinue(path.type)}
                >
                  {path.cta}
                </Button>
              ) : (
                <Button
                  href={`/apply?type=${path.type}`}
                  size={isHero ? "md" : "lg"}
                  className={cn(isHero ? "w-full sm:w-auto" : "w-full")}
                >
                  {path.cta}
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function PathToggleBoxLinks({ className }: { className?: string }) {
  return (
    <div className={cn("mx-auto max-w-lg", className)}>
      <PathToggleBox />
    </div>
  );
}
