import { cn } from "@/lib/utils";
import { BlueprintGrid } from "./BlueprintGrid";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  blueprint?: boolean;
  secondary?: boolean;
};

export function Section({
  children,
  className,
  id,
  blueprint = false,
  secondary = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28",
        secondary ? "bg-bg-secondary" : "bg-bg-primary",
        className
      )}
    >
      {blueprint && <BlueprintGrid />}
      <div className="relative z-10 mx-auto w-full max-w-7xl">{children}</div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "mb-10 sm:mb-14",
        align === "center" && "mx-auto max-w-3xl text-center",
        align === "left" && "max-w-2xl text-left",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-semibold tracking-tight text-text-light sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-text-secondary sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
