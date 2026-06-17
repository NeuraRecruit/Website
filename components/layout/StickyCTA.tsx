"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

export function StickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 sm:hidden">
      <Button href="/apply" className="w-full shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
        Get Started
      </Button>
    </div>
  );
}
