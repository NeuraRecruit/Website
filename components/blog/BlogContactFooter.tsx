import Link from "next/link";

type BlogContactFooterProps = {
  children: React.ReactNode;
};

export function BlogContactFooter({ children }: BlogContactFooterProps) {
  return (
    <div className="mt-10 rounded-2xl border border-border bg-bg-secondary p-6 sm:p-8">
      <p className="text-base leading-relaxed text-text-secondary">{children}</p>
      <p className="mt-4 text-base leading-relaxed text-text-secondary">
        Get in touch at{" "}
        <Link
          href="mailto:hello@neurarecruitment.com"
          className="text-accent underline-offset-2 hover:underline"
        >
          hello@neurarecruitment.com
        </Link>{" "}
        or via{" "}
        <Link href="/contact" className="text-accent underline-offset-2 hover:underline">
          neurarecruitment.com
        </Link>
        .
      </p>
    </div>
  );
}
