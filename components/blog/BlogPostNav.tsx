import Link from "next/link";
import { getNextBlogPost } from "@/data/blog-posts";
import { cn } from "@/lib/utils";

const navLinkClass =
  "inline-flex min-h-12 items-center gap-3 rounded-2xl border border-border px-5 py-3 text-sm font-medium text-text-light transition-all duration-300 hover:border-black/15 hover:bg-black/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary";

function ArrowLeftIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="h-4 w-4 shrink-0 text-text-secondary"
    >
      <path
        d="M12.5 15L7.5 10L12.5 5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="h-4 w-4 shrink-0 text-text-secondary"
    >
      <path
        d="M7.5 5L12.5 10L7.5 15"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BlogPostNav({ slug }: { slug: string }) {
  const nextPost = getNextBlogPost(slug);

  return (
    <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-stretch sm:justify-between">
      <Link href="/blog" className={cn(navLinkClass, "self-start")}>
        <ArrowLeftIcon />
        <span>Back to Insights</span>
      </Link>

      {nextPost && (
        <Link
          href={`/blog/${nextPost.slug}`}
          className={cn(navLinkClass, "group sm:max-w-md sm:justify-between")}
        >
          <div className="min-w-0 text-left">
            <p className="text-xs font-medium uppercase tracking-wider text-accent">
              Next article
            </p>
            <p className="mt-1 line-clamp-2 text-sm font-medium text-text-light transition-colors group-hover:text-accent">
              {nextPost.title}
            </p>
          </div>
          <ArrowRightIcon />
        </Link>
      )}
    </div>
  );
}
