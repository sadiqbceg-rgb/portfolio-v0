'use client';

import { useReducedMotion } from 'motion/react';
import { StarsBackground } from '@/components/animate-ui/components/backgrounds/stars';
import { Magnetic } from '@/components/animate-ui/primitives/effects/magnetic';
import { Atmosphere } from './Artwork';
import { hero, identity } from '@/content/site';

/* Hero — full-bleed backdrop, but the content is a left-aligned two-column
 * composition rather than a centred stack: headline and actions on the left,
 * a factual meta rail on the right. The asymmetry is what stops it reading as
 * a template, and the rail answers the three questions a visitor actually has
 * (who, where, what) before they scroll.
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

      <div className="shell pointer-events-none w-full py-20">
        <div className="grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,17rem)] lg:items-end">
          <div className="flex flex-col gap-8">
            <p className="text-caption uppercase tracking-[0.16em] text-twilight-soft">
              {identity.availability}
            </p>

            <h1 className="font-control-tnt text-heading-lg text-whiteout max-w-[20ch] text-balance">
              {hero.headline.map((part, i) => (
                <span key={i}>
                  <span className={part.accent ? 'accent-cursive' : undefined}>
                    {part.text}
                  </span>
                  {i < hero.headline.length - 1 ? ' ' : ''}
                </span>
              ))}
            </h1>

            <p className="prose-longform text-body max-w-[54ch] text-whiteout/70">
              {hero.subhead}
            </p>

            <div className="pointer-events-auto flex flex-wrap items-center gap-2">
              {hero.actions.map((action, i) => (
                <Magnetic
                  key={action.label}
                  strength={0.25}
                  range={90}
                  onlyOnHover
                >
                  <a
                    href={action.href}
                    className={i === 0 ? 'btn-haze' : 'btn-ghost'}
                  >
                    {action.label}
                  </a>
                </Magnetic>
              ))}
            </div>
          </div>

          {/* Meta rail — hairline-separated facts, not decoration. */}
          <dl className="flex flex-col gap-4 border-t hairline pt-6 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
            {hero.meta.map((row) => (
              <div key={row.label} className="flex flex-col gap-1">
                <dt className="text-caption uppercase tracking-[0.14em] text-whiteout/55">
                  {row.label}
                </dt>
                <dd className="text-body text-whiteout/85">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
