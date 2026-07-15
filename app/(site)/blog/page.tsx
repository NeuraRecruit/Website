"use client";

import { BLOG_POSTS } from "@/data/blog-posts";
import { BlogCard } from "@/components/blog/BlogCard";
import { Section, SectionHeader } from "@/components/ui/Section";

export default function BlogPage() {
  return (
    <Section className="min-h-[80vh] pt-28 sm:pt-32">
      <SectionHeader
        eyebrow="Insights"
        title="Advice for health & safety and construction professionals"
        description="Practical guidance on careers, qualifications, and hiring in UK health & safety and construction."
        align="left"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {BLOG_POSTS.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </Section>
  );
}
