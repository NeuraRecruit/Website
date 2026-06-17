import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { StickyCTA } from "./StickyCTA";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <StickyCTA />
    </>
  );
}
