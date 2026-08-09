import { About } from '@/components/About';
import { Contact } from '@/components/Contact';
import { Experience } from '@/components/Experience';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { LogoBar } from '@/components/LogoBar';
import { Nav } from '@/components/Nav';
import { Projects } from '@/components/Projects';
import { Skills } from '@/components/Skills';
import { Statement } from '@/components/Statement';
import { Work } from '@/components/Work';

/* Page composition.
 *
 * Full-bleed atmospheric sections (Hero, Statement) alternate with centred
 * content blocks constrained to 1150px — the reference's core rhythm. Reorder
 * or delete any section here; each one is self-contained and reads its copy
 * from src/content/site.ts.
 */
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <LogoBar />
        <Work />
        <Statement />
        <Projects />
        <Experience />
        <Skills />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
