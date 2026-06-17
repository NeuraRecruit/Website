import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  hover = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-white p-6 backdrop-blur-sm sm:p-8",
        hover &&
          "transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_0_40px_rgba(46,107,255,0.12)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
