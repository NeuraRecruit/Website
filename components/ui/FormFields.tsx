import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, className, id, required, ...props }: InputProps) {
  const inputId = id || props.name;

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block text-sm font-medium text-text-light">
        {label}
        {required && <span className="text-accent"> *</span>}
      </label>
      <input
        id={inputId}
        className={cn(
          "h-12 w-full rounded-xl border border-border bg-white px-4 text-base text-text-light placeholder:text-text-secondary/60 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20",
          error && "border-red-500/50",
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  const inputId = id || props.name;

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block text-sm font-medium text-text-light">
        {label}
      </label>
      <textarea
        id={inputId}
        className={cn(
          "min-h-[140px] w-full resize-y rounded-xl border border-border bg-white px-4 py-3 text-base text-text-light placeholder:text-text-secondary/60 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20",
          error && "border-red-500/50",
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  options: readonly string[] | { label: string; value: string }[];
};

export function Select({ label, error, options, className, id, ...props }: SelectProps) {
  const inputId = id || props.name;

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block text-sm font-medium text-text-light">
        {label}
      </label>
      <select
        id={inputId}
        className={cn(
          "h-12 w-full rounded-xl border border-border bg-white px-4 text-base text-text-light transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20",
          error && "border-red-500/50",
          className
        )}
        {...props}
      >
        {options.map((opt) => {
          if (typeof opt === "string") {
            return (
              <option key={opt} value={opt}>
                {opt}
              </option>
            );
          }
          return (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          );
        })}
      </select>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}

export function FileInput({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text-light">{label}</label>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        className={cn(
          "w-full rounded-xl border border-dashed border-border bg-white px-4 py-4 text-sm text-text-secondary file:mr-4 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-accent/90",
          error && "border-red-500/50"
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
