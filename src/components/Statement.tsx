'use client';

import { motion, useReducedMotion } from 'motion/react';
import { Atmosphere } from './Artwork';
import { useScene, useSceneRange } from './ScrollScene';
import { statement } from '@/content/site';

/* ============================================================================
 * STATEMENT — the breathing room between Work and Experience.
 *
 * Poster-scale type, a full viewport, and nothing else in it. This is the one
 * section whose job is to give the eye somewhere to rest.
 *
 * The two lines drift in opposite directions as the section passes, so the
 * block shears very slightly. It is a small move — 40px at the extremes — but
 * it makes the type feel like it occupies space rather than sitting flat on
 * the page, which is the difference between a poster and a headline.
 *
 * Opacity peaks at the viewport centre rather than ending there, which is why
 * `useSceneRange` takes an explicit rest value: resolving this ramp to its
 * last output would leave reduced-motion visitors reading it at 35%.
 * ==========================================================================*/

export function Statement() {
  const reduced = useReducedMotion();
  const scene = useScene();

  const xA = useSceneRange(scene, [0, 1], ['40px', '-40px'], '0px');
  const xB = useSceneRange(scene, [0, 1], ['-40px', '40px'], '0px');
  const opacity = useSceneRange(scene, [0, 0.5, 1], [0.35, 1, 0.35], 1);
  const backdropScale = useSceneRange(scene, [0, 1], [1, 1.08], 1);

  const lineX = [xA, xB];

  return (
    <section
      ref={scene.ref}
      className="relative flex min-h-svh items-center overflow-hidden"
    >
      <motion.div style={{ scale: backdropScale }} className="absolute inset-0">
        <Atmosphere uid="statement" variant="flow" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative flex w-full flex-col items-center gap-10 px-4"
      >
        <h2 className="display-headline text-center">
          {statement.lines.map((line, i) => (
            <motion.span
              key={line}
              style={{ x: lineX[i % 2] }}
              className="block"
            >
              {line}
            </motion.span>
          ))}
        </h2>

        {statement.note ? (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -20% 0px' }}
            transition={{
              duration: reduced ? 0 : 0.6,
              delay: reduced ? 0 : 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="prose-longform text-body max-w-[52ch] text-center text-whiteout/70"
          >
            {statement.note}
          </motion.p>
        ) : null}
      </motion.div>
    </section>
  );
}
