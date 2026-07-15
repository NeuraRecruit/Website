"use client";

import Link from "next/link";
import type { BlogPost } from "@/data/blog-posts";
import { Card } from "@/components/ui/Card";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <Card hover className="flex h-full flex-col">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-md border border-border bg-bg-secondary px-2.5 py-1 text-xs font-medium uppercase tracking-wider text-accent">
            {post.category}
          </span>
          {post.hasContent && (
            <span className="inline-flex rounded-md border border-accent/20 bg-accent/10 px-2.5 py-1 text-xs font-medium uppercase tracking-wider text-accent">
              Published
            </span>
          )}
          <span className="text-xs text-text-secondary">{post.readTime}</span>
        </div>
        <h3 className="text-lg font-semibold text-text-light transition-colors group-hover:text-accent sm:text-xl">
          {post.title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary sm:text-base">
          {post.excerpt}
        </p>
        <p className="mt-6 text-xs text-text-secondary">
          {post.author} · {formatDate(post.publishedAt)}
        </p>
      </Card>
    </Link>
  );
}
