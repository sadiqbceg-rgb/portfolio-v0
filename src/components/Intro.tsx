'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Eyebrow } from './Eyebrow';
import { TextReveal } from './TextReveal';
import { useScene, useSceneRange, type Scene } from './ScrollScene';
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
 *
 * ---------------------------------------------------------------------------
 * THE PROCESS LINE
 *
 * Research → Prototype → Build → Test → Ship is the one genuinely
 * scroll-driven thing on the page outside Selected Work. Each stage owns a
 * slice of the section's scroll range and fades up as that slice passes,
 * so the sequence draws itself at the speed the visitor scrolls rather than
 * playing a fixed animation once triggered. That is the same idea Selected
 * Work uses — position in the scroll range decides what is lit — applied to
 * five words instead of eight projects.
 *
 * Deliberately restrained: opacity plus 10px of travel, no per-letter motion,
 * no bounce. The line has to stay readable while it assembles.
 * ==========================================================================*/

/* Each stage's fade-in window, as a fraction of the process block's own scroll
   range. The block gets a separate scene from the panel: the panel's range
   ends when its top reaches the viewport top, by which point this line is
   still below the fold, so driving the stages from it would finish the
   sequence before anyone had seen it start. */
const STAGE_START = 0.05;
const STAGE_SPAN = 0.25; // how long one stage takes to arrive
const STAGE_GAP = 0.15; // offset between consecutive stages

/**
 * Small-screen check that never changes the rendered tree.
 *
 * Returns false on the server and on the first client render, so SSR and
 * hydration agree; the real answer arrives on the next tick and only ever
 * changes numbers handed to the animation, never markup.
 */
function useSmallScreen() {
  const [small, setSmall] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)');
    const sync = () => setSmall(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return small;
}

function ProcessStage({
  scene,
  label,
  index,
  simplified,
}: {
  scene: Scene;
  label: string;
  index: number;
  /* On a phone the whole line arrives together. Staggering five stages across
     a scroll range that is only a few hundred pixels tall on a small screen
     makes the line flicker in and out under a thumb, which is the opposite of
     comfortable. */
  simplified: boolean;
}) {
  const start = simplified ? STAGE_START : STAGE_START + index * STAGE_GAP;
  const end = start + STAGE_SPAN;

  const opacity = useSceneRange(scene, [start, end], [0, 1], 1);
  const y = useSceneRange(scene, [start, end], [10, 0], 0);

  return (
    <motion.span
      style={{ opacity, y }}
      className="font-control-tnt text-subheading text-ink"
    >
      {label}
    </motion.span>
  );
}

export function Intro() {
  const smallScreen = useSmallScreen();

  // Progress runs from "panel enters the viewport" to "panel top reaches the
  // viewport top" — i.e. the whole slide-up, and nothing after it.
  const scene = useScene(['start end', 'start start']);
  const radius = useSceneRange(scene, [0, 1], ['40px', '0px'], '0px');

  // The process line reveals against its own position on screen, from just
  // below the fold to a little past centre.
  const processScene = useScene(['start 85%', 'center 55%']);

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
        <div className="shell flex flex-col gap-16 py-section-lg">
          <div className="flex flex-col gap-6">
            <Eyebrow className="text-ink/70">{intro.build.eyebrow}</Eyebrow>
            <TextReveal
              as="h2"
              className="font-control-tnt text-heading-lg text-ink max-w-[24ch] text-balance"
              stagger={100}
              lines={[intro.build.statement]}
            />
          </div>

          <div ref={processScene.ref} className="flex flex-col gap-6">
            <Eyebrow className="text-ink/70">{intro.process.eyebrow}</Eyebrow>

            {/* Arrows are decoration between stages, not content a screen
                reader should read aloud as "arrow"; the list order already
                carries the sequence. They are still held to the 4.5:1 body
                minimum rather than taking the exemption decorative glyphs
                get — at ink/40 they measured 2.46:1, and this arrow is the
                only thing showing the stages are ordered. */}
            <ol className="flex flex-wrap items-center gap-x-4 gap-y-3">
              {intro.process.steps.map((step, i) => (
                <li key={step} className="flex items-center gap-4">
                  {i > 0 ? (
                    <span aria-hidden="true" className="text-body text-ink/70">
                      →
                    </span>
                  ) : null}
                  <ProcessStage
                    scene={processScene}
                    label={step}
                    index={i}
                    simplified={smallScreen}
                  />
                </li>
              ))}
            </ol>
          </div>

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
                    duration: scene.reduced ? 0 : 0.6,
                    delay: scene.reduced ? 0 : i * 0.08,
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
