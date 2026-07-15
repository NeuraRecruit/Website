import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BLOG_POSTS, getBlogPost } from "@/data/blog-posts";
import { getBlogContent } from "@/content/blog";
import { BlogPostNav } from "@/components/blog/BlogPostNav";
import { Section } from "@/components/ui/Section";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return { title: "Article Not Found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const Content = getBlogContent(slug);

  return (
    <Section className="min-h-[80vh] pt-28 sm:pt-32">
      <article className="mx-auto max-w-3xl">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="inline-flex rounded-md border border-border bg-bg-secondary px-2.5 py-1 text-xs font-medium uppercase tracking-wider text-accent">
            {post.category}
          </span>
          <span className="text-sm text-text-secondary">{post.readTime}</span>
          <span className="text-sm text-text-secondary">
            {formatDate(post.publishedAt)}
          </span>
          <span className="text-sm text-text-secondary">
            By {post.author}
          </span>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-text-light sm:text-4xl lg:text-5xl">
          {post.title}
        </h1>

        <p className="mt-6 text-base leading-relaxed text-text-secondary sm:text-lg">
          {post.excerpt}
        </p>

        {Content ? (
          <Content />
        ) : (
          <div className="mt-10 rounded-2xl border border-border bg-bg-secondary p-6 sm:p-8">
            <p className="text-sm font-medium uppercase tracking-wider text-accent">
              Coming soon
            </p>
            <p className="mt-3 text-base leading-relaxed text-text-secondary">
              We are preparing the full article. Check back shortly for the complete
              guide.
            </p>
          </div>
        )}

        <BlogPostNav slug={slug} />
      </article>
    </Section>
  );
}
