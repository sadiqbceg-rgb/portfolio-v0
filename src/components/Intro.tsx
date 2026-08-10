'use client';

import { motion, useReducedMotion } from 'motion/react';
import { Eyebrow } from './Eyebrow';
import { TextReveal } from './TextReveal';
import { useScene, useSceneRange } from './ScrollScene';
import { intro, logoBar } from '@/content/site';

/* ============================================================================
 * INTRO — the light panel that rises over the hero.
 *
 * This is the inversion moment, and it is the single device that stops the
 * page reading as "black section, black section, black section". Because the
 * hero above is sticky and this panel is not, scrolling slides the panel up
 * over a hero that stays put — the section arrives rather than the previous
 * one leaving.
 *
 * The rounded top corners flatten to zero as the panel locks into place, so
 * it reads as a surface sliding into a slot instead of a box appearing.
 *
 * z-10 is load-bearing: without it the sticky hero paints over this panel.
 * ==========================================================================*/

export function Intro() {
  const reducedMotion = useReducedMotion();

  // Progress runs from "panel enters the viewport" to "panel top reaches the
  // viewport top" — i.e. the whole slide-up, and nothing after it.
  const scene = useScene(['start end', 'start start']);
  const radius = useSceneRange(scene, [0, 1], ['40px', '0px'], '0px');

  return (
    <div ref={scene.ref} className="relative z-10">
      <motion.section
        id="intro"
        style={{
          borderTopLeftRadius: radius,
          borderTopRightRadius: radius,
        }}
        className="bg-surface-light text-ink"
      >
        <div className="shell flex flex-col gap-12 py-section-lg">
          {/* The positioning line is optional — see the note in site.ts. With
              it empty the panel leads with the companies instead, which still
              works as an opening statement. */}
          {intro.title ? (
            <div className="flex flex-col gap-6">
              <Eyebrow className="text-ink/70">{intro.eyebrow}</Eyebrow>
              <TextReveal
                as="h2"
                className="font-control-tnt text-heading-lg text-ink max-w-[24ch] text-balance"
                stagger={100}
                lines={[intro.title]}
              />
            </div>
          ) : null}

          <div className="flex flex-col gap-8">
            <Eyebrow className="text-ink/70">{logoBar.caption}</Eyebrow>

            <ul className="flex flex-wrap items-baseline gap-x-12 gap-y-6">
              {logoBar.logos.map((logo, i) => (
                <motion.li
                  key={logo}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px 0px -15% 0px' }}
                  transition={{
                    duration: reducedMotion ? 0 : 0.6,
                    delay: reducedMotion ? 0 : i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="font-control-tnt text-heading text-ink"
                >
                  {logo}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
