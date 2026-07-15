export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: "Health & Safety" | "Construction" | "Careers";
  publishedAt: string;
  readTime: string;
  author: "James Cox" | "Deividas Grigas";
  hasContent?: boolean;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "health-safety-salary-guide-2026",
    title: "Health & Safety Salary Guide 2026: What Roles Are Really Paying",
    excerpt:
      "An honest look at indicative UK salary ranges for HSE roles in 2026, what actually moves the number, and what we're seeing in live construction and infrastructure vacancies.",
    category: "Careers",
    publishedAt: "2026-07-15",
    readTime: "8 min read",
    author: "James Cox",
    hasContent: true,
  },
  {
    slug: "interview-preparation",
    title: "How to Prepare for a Health & Safety Interview",
    excerpt:
      "Interviews are mostly won before you walk through the door. Research the business, decode the role, prepare evidence not scripts, and don't forget your PPE for site visits.",
    category: "Careers",
    publishedAt: "2026-07-12",
    readTime: "7 min read",
    author: "Deividas Grigas",
    hasContent: true,
  },
  {
    slug: "ftc-vs-day-rate",
    title: "Fixed-Term Contract or Day Rate? Choosing the Right Contract Type for Your Role",
    excerpt:
      "FTCs offer stability but a smaller talent pool. Day rates open up experienced specialists fast. The right choice depends on the role, the timeframe, and what you can actually attract.",
    category: "Construction",
    publishedAt: "2026-07-10",
    readTime: "9 min read",
    author: "James Cox",
    hasContent: true,
  },
  {
    slug: "interview-questions-to-ask",
    title: '"Do You Have Any Questions For Me?" — How to Use the Last Five Minutes of an Interview',
    excerpt:
      "The final interview question is still part of the assessment. Research properly, ask the right questions about the role and culture, and use those five minutes to leave a stronger impression.",
    category: "Careers",
    publishedAt: "2026-07-08",
    readTime: "7 min read",
    author: "Deividas Grigas",
    hasContent: true,
  },
  {
    slug: "health-safety-cv-guide",
    title: "Writing a Health & Safety CV That Actually Gets You Interviews",
    excerpt:
      "No perfect template exists. The best CV reflects where you want to go next, shows what you achieved rather than what you were responsible for, and gets found in recruiter searches.",
    category: "Careers",
    publishedAt: "2026-07-05",
    readTime: "8 min read",
    author: "James Cox",
    hasContent: true,
  },
  {
    slug: "hire-hse-advisor",
    title: "How to Hire an HSE Advisor: A Guide for UK Construction Firms",
    excerpt:
      "Finding the right health & safety advisor can transform site culture and reduce risk. Here is what to look for, what to ask, and how to avoid common hiring mistakes.",
    category: "Construction",
    publishedAt: "2026-07-03",
    readTime: "9 min read",
    author: "James Cox",
    hasContent: true,
  },
  {
    slug: "hse-skills-2026",
    title: "5 Health & Safety Skills UK Construction Employers Are Hiring For in 2026",
    excerpt:
      "From CDM compliance to behavioural safety leadership, these are the competencies UK construction firms are prioritising when hiring HSE professionals this year.",
    category: "Health & Safety",
    publishedAt: "2026-07-01",
    readTime: "8 min read",
    author: "Deividas Grigas",
    hasContent: true,
  },
  {
    slug: "nebosh-vs-iosh",
    title: "NEBOSH vs IOSH: Which Qualification Is Right for Your HSE Career?",
    excerpt:
      "Both qualifications open doors in UK construction, but they serve different career stages. We break down the differences to help you choose the right path.",
    category: "Careers",
    publishedAt: "2026-07-01",
    readTime: "9 min read",
    author: "James Cox",
    hasContent: true,
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getNextBlogPost(slug: string): BlogPost | undefined {
  const index = BLOG_POSTS.findIndex((post) => post.slug === slug);
  if (index === -1 || BLOG_POSTS.length < 2) return undefined;
  return BLOG_POSTS[(index + 1) % BLOG_POSTS.length];
}
