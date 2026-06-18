"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useCallback } from "react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { fadeUp, staggerContainer } from "@/lib/motion";

const steps = [
  {
    step: 1,
    title: "Apply",
    description: "Share your experience and preferences in minutes.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  {
    step: 2,
    title: "Conversation",
    description: "We take time to understand your goals and what matters to you.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    step: 3,
    title: "Matching",
    description: "We identify the right opportunities from our exclusive network.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
  },
  {
    step: 4,
    title: "Interview",
    description: "We prepare and support you every step of the way.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    step: 5,
    title: "Placement",
    description: "You start your new role with our ongoing support behind you.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
  },
];

const SCROLL_SPEED = 1.2;
const RESUME_DELAY = 2000;
const START_DELAY = 1500;

function useAutoScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const directionRef = useRef(1);

  const stopAnim = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const animate = useCallback(() => {
    const el = scrollRef.current;
    if (!el || pausedRef.current) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return;
    el.scrollLeft += SCROLL_SPEED * directionRef.current;
    if (el.scrollLeft >= maxScroll) directionRef.current = -1;
    else if (el.scrollLeft <= 0) directionRef.current = 1;
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  const startAnim = useCallback(() => {
    stopAnim();
    rafRef.current = requestAnimationFrame(animate);
  }, [animate, stopAnim]);

  const pauseAndScheduleResume = useCallback(() => {
    pausedRef.current = true;
    stopAnim();
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      pausedRef.current = false;
      startAnim();
    }, RESUME_DELAY);
  }, [startAnim, stopAnim]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const mq = window.matchMedia("(max-width: 639px)");
    if (!mq.matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          pausedRef.current = false;
          setTimeout(() => {
            if (!pausedRef.current) startAnim();
          }, START_DELAY);
        } else {
          pausedRef.current = true;
          stopAnim();
          directionRef.current = 1;
          if (el) el.scrollLeft = 0;
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);

    const onTouchStart = () => pauseAndScheduleResume();
    el.addEventListener("touchstart", onTouchStart, { passive: true });

    return () => {
      observer.disconnect();
      el.removeEventListener("touchstart", onTouchStart);
      stopAnim();
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, [startAnim, stopAnim, pauseAndScheduleResume]);

  return scrollRef;
}

export function CandidateJourney() {
  const scrollRef = useAutoScroll();

  return (
    <Section>
      <SectionHeader
        eyebrow="Your Journey"
        title="From application to placement"
        description="A straightforward process designed around you."
      />

      <div className="relative -mx-4 sm:mx-0">
        <div ref={scrollRef} className="overflow-x-auto px-4 pb-4 sm:overflow-visible sm:px-0 sm:pb-0">
          <motion.ol
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="flex min-w-max gap-4 sm:min-w-0 sm:grid sm:grid-cols-5 sm:items-stretch sm:gap-5"
          >
            {steps.map((item, index) => (
              <motion.li
                key={item.step}
                variants={fadeUp}
                className="w-[200px] flex-shrink-0 sm:w-auto sm:flex"
              >
                <div className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/20 hover:shadow-[0_8px_30px_rgba(46,107,255,0.10)] sm:p-6">
                  {/* Step number watermark */}
                  <span className="absolute right-4 top-3 font-heading text-6xl font-bold leading-none text-black/[0.04] select-none">
                    {item.step}
                  </span>

                  {/* Icon */}
                  <div className="relative mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                    {item.icon}
                  </div>

                  {/* Step label */}
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent/70">
                    Step {String(index + 1).padStart(2, "0")}
                  </p>

                  {/* Title */}
                  <h3 className="font-heading text-lg font-semibold text-text-light">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {item.description}
                  </p>

                  {/* Bottom accent line */}
                  <div className="mt-auto pt-5">
                    <div className="h-px w-8 rounded-full bg-accent/30 transition-all duration-300 group-hover:w-full group-hover:bg-accent/50" />
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </Section>
  );
}
