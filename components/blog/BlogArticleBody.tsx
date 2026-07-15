export function BlogArticleBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-10 space-y-6 text-base leading-relaxed text-text-secondary [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-text-light [&_h2]:first:mt-0 [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-text-light [&_li]:ml-4 [&_li]:list-disc [&_ol]:ml-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_p+p]:mt-4 [&_strong]:font-semibold [&_strong]:text-text-light [&_ul]:space-y-2">
      {children}
    </div>
  );
}
