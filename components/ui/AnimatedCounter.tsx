"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

type AnimatedCounterProps = {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  isText?: boolean;
  className?: string;
};

export function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  label,
  isText = false,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (!isInView || isText) return;
    if (reducedMotion) {
      setCount(value);
      return;
    }

    let start = 0;
    const duration = 1800;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.floor(eased * value);
      setCount(start);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [isInView, value, isText, reducedMotion]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className={cn(
        "rounded-2xl border border-border bg-bg-secondary/50 p-6 text-center backdrop-blur-sm sm:p-8",
        className
      )}
    >
      <p className="text-3xl font-semibold tracking-tight text-text-light sm:text-4xl lg:text-5xl">
        {isText ? (
          label
        ) : (
          <>
            {prefix}
            {count}
            {suffix}
          </>
        )}
      </p>
      {!isText && (
        <p className="mt-2 text-sm text-text-secondary sm:text-base">{label}</p>
      )}
    </motion.div>
  );
}
