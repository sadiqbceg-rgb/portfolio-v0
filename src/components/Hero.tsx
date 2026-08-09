'use client';

import { useReducedMotion } from 'motion/react';
import { StarsBackground } from '@/components/animate-ui/components/backgrounds/stars';
import { Magnetic } from '@/components/animate-ui/primitives/effects/magnetic';
import { Atmosphere } from './Artwork';
import { hero } from '@/content/site';

/* Full-Bleed Photographic Section + Dual-Style Headline.
 *
 * Breaks the 1150px container to fill the viewport, with the headline mixing
 * upright Control TNT against one handwritten Control Cursive word — the
 * reference's signature typographic tension.
 *
 * The backdrop is chosen in src/content/site.ts. Under reduced motion the star
 * field falls back to the static SVG artwork rather than animating.
 */
export function Hero() {
  const reducedMotion = useReducedMotion();
  const useStars = hero.background === 'stars' && !reducedMotion;

  return (
    <section
      id="top"
      className="relative flex min-h-svh items-center overflow-hidden pt-nav"
    >
      {useStars ? (
        <StarsBackground
          className="absolute inset-0 -z-10"
          starColor="#ffffff"
          factor={0.04}
          speed={60}
        />
      ) : (
        <Atmosphere uid="hero" variant="clouds" />
      )}

      <div className="shell pointer-events-none flex flex-col items-center gap-8 py-24 text-center">
        <p className="text-subheading text-twilight-soft">{hero.eyebrow}</p>

        <h1 className="font-control-tnt text-heading-lg text-whiteout max-w-[18ch] text-balance">
          {hero.headline.map((part, i) => (
            <span key={i}>
              <span className={part.accent ? 'accent-cursive' : undefined}>
                {part.text}
              </span>
              {i < hero.headline.length - 1 ? ' ' : ''}
            </span>
          ))}
        </h1>

        <p className="prose-longform text-body max-w-[52ch] text-whiteout/80">
          {hero.subhead}
        </p>

        {/* pointer-events are re-enabled just on the buttons so the star field
            still tracks the cursor across the rest of the hero. */}
        <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-2">
          {hero.actions.map((action) => (
            <Magnetic key={action.label} strength={0.25} range={90} onlyOnHover>
              <a href={action.href} className="btn-ghost">
                {action.label}
              </a>
            </Magnetic>
          ))}
        </div>
      </div>
    </section>
  );
}
