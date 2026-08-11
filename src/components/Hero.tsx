'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, useReducedMotion } from 'motion/react';
import { StarsBackground } from '@/components/animate-ui/components/backgrounds/stars';
import { Magnetic } from '@/components/animate-ui/primitives/effects/magnetic';
import { Atmosphere, type ArtVariant } from './Artwork';
import { Eyebrow } from './Eyebrow';
import { TextReveal } from './TextReveal';
import { useScene, useSceneRange } from './ScrollScene';
import { hero, identity } from '@/content/site';

/* Three.js is ~150kB gzipped. Loading it dynamically keeps it out of the main
 * bundle unless hero.background is set to '3d', so every other backdrop costs
 * nothing. ssr:false because the scene needs a real canvas to exist first. */
const HeroScene = dynamic(
  () => import('./HeroScene').then((m) => m.HeroScene),
  {
    ssr: false,
  },
);

/* ============================================================================
 * HERO — the entrance.
 *
 * Composition is unchanged: headline and actions left, a factual meta rail
 * right. The asymmetry is what stops it reading as a centred developer banner,
 * and it already worked.
 *
 * What is new is that it behaves like an opening shot rather than a poster:
 *
 *   - the headline is uncovered line by line on load
 *   - the whole content layer recedes on scroll, sharing ONE scroll value with
 *     the 3D form so type and geometry move as a single camera move
 *   - the hero is sticky, so the Intro panel slides up over it rather than
 *     pushing it away — the most effective single device in the reference
 *
 * Sticky is desktop-only. On touch a pinned hero makes the first swipe feel
 * unresponsive, which is the opposite of premium.
 * ==========================================================================*/

export function Hero() {
  const reducedMotion = useReducedMotion();
  const backdrop = hero.background;

  // The star field and the SVG fallback are genuinely different trees, so the
  // swap has to happen after mount rather than during render — otherwise the
  // server (where useReducedMotion() is always false) emits one and a
  // reduced-motion client hydrates the other. Latent today because the
  // backdrop is '3d', but it would bite the moment that changed.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const motionOff = Boolean(reducedMotion) && mounted;

  // The scene ref goes on the outer wrapper, which is deliberately NOT sticky.
  // A pinned element's rect never moves, so measuring the sticky node itself
  // would report zero progress for the entire pin.
  const scene = useScene(['start start', 'end start']);
  const contentY = useSceneRange(scene, [0, 1], ['0%', '-18%'], '0%');
  // Hold full opacity until the Intro panel is genuinely covering the hero.
  // Fading from 0 leaves a window of empty black between the copy vanishing
  // and the panel arriving, which reads as a dead gap rather than a handover.
  const contentOpacity = useSceneRange(scene, [0.4, 0.92], [1, 0], 1);

  return (
    <div ref={scene.ref} className="relative">
      <section
        id="top"
        className="hero-shell flex min-h-svh items-center overflow-hidden pt-nav"
      >
        {backdrop === '3d' ? (
          <>
            <HeroScene progress={scene.progress} />
            {/* Scrim: the wireframe crosses the type everywhere now, so the
                text needs a floor under it to hold its contrast.

                This used to be a left-to-right ramp, which made sense while
                the form sat in the right column — dark where the copy was,
                clear where the form was. With the form centred on the viewport
                that logic inverts: a directional gradient now leaves its
                brightest region sitting under the middle of the headline.

                So it is a flat veil plus a soft radial that is strongest at
                the centre, exactly where the densest part of the mesh sits.
                Both copy column and meta rail get equal protection, which a
                one-directional ramp cannot give them. Contrast is measured,
                not eyeballed: see `npm run verify`. */}
            <div
              className="absolute inset-0 -z-10"
              style={{
                background:
                  'radial-gradient(58% 62% at 50% 50%, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.60) 55%, rgba(0,0,0,0.42) 100%), rgba(0,0,0,0.30)',
              }}
            />
          </>
        ) : backdrop === 'stars' && !motionOff ? (
          <StarsBackground
            className="absolute inset-0 -z-10"
            starColor="#ffffff"
            factor={0.04}
            speed={60}
          />
        ) : (
          <Atmosphere
            uid="hero"
            variant={
              (backdrop === 'stars' ? 'contour' : backdrop) as ArtVariant
            }
          />
        )}

        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="shell pointer-events-none w-full py-20"
        >
          <div className="grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,17rem)] lg:items-end">
            <div className="flex flex-col gap-8">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <Eyebrow>{hero.eyebrow}</Eyebrow>

                {/* Rendered only when identity.availability is set. An empty
                    string means no claim about availability is made at all. */}
                {identity.availability ? (
                  <p className="text-caption flex items-center gap-2 text-whiteout/70">
                    <span className="relative flex h-1.5 w-1.5">
                      {/* Always rendered — the reduced-motion block in
                          globals.css neutralises the animation, so this needs
                          no render-time branch (which would desync SSR). */}
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-blue opacity-60" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal-blue" />
                    </span>
                    {identity.availability}
                  </p>
                ) : null}
              </div>

              <TextReveal
                as="h1"
                className="font-control-tnt text-heading-lg text-whiteout max-w-[20ch] text-balance"
                delay={120}
                stagger={110}
                lines={hero.headline.map((part, i) => (
                  <span
                    key={i}
                    className={part.accent ? 'accent-cursive' : undefined}
                  >
                    {part.text}
                  </span>
                ))}
              />

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reducedMotion ? 0 : 0.7,
                  delay: reducedMotion ? 0 : 0.42,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="prose-longform text-body max-w-[54ch] text-whiteout/70"
              >
                {hero.subhead}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reducedMotion ? 0 : 0.7,
                  delay: reducedMotion ? 0 : 0.54,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="pointer-events-auto flex flex-wrap items-center gap-2"
              >
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
              </motion.div>
            </div>

            {/* Meta rail — hairline-separated facts, not decoration. */}
            <motion.dl
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reducedMotion ? 0 : 0.7,
                delay: reducedMotion ? 0 : 0.66,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-col gap-4 border-t hairline pt-6 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0"
            >
              {hero.meta.map((row) => (
                <div key={row.label} className="flex flex-col gap-1">
                  <dt className="text-caption uppercase tracking-[0.14em] text-whiteout/55">
                    {row.label}
                  </dt>
                  {/* A row with several entries lists them, one per line. */}
                  {Array.isArray(row.value) ? (
                    <dd className="text-body flex flex-col gap-0.5 text-whiteout/85">
                      {row.value.map((line) => (
                        <span key={line}>{line}</span>
                      ))}
                    </dd>
                  ) : (
                    <dd className="text-body text-whiteout/85">{row.value}</dd>
                  )}
                </div>
              ))}
            </motion.dl>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
