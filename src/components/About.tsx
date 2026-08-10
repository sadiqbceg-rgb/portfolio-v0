'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { Artwork } from './Artwork';
import { SectionHeader } from './SectionHeader';
import { useScene, useSceneRange } from './ScrollScene';
import { about, identity } from '@/content/site';

/* ============================================================================
 * ABOUT — editorial two-column, portrait unmasked on entry.
 *
 * The portrait is revealed by animating a clip-path inset from the bottom, so
 * it is uncovered rather than faded in — the same gesture as the headline
 * reveals, which keeps the site's motion vocabulary to one idea.
 *
 * It then parallaxes counter to the page: as you scroll down it drifts down
 * relative to its frame, which reads as sitting deeper in space. 40px each
 * way, inside an overflow-hidden frame so nothing escapes the crop.
 *
 * Copy is paragraph-level fade only. Body text is never animated word by word.
 * ==========================================================================*/

export function About() {
  const reduced = useReducedMotion();
  const scene = useScene();
  const portraitY = useSceneRange(scene, [0, 1], ['-6%', '6%'], '0%');

  return (
    <section id="about" className="py-section-lg">
      <div className="shell flex flex-col gap-12">
        <SectionHeader eyebrow={about.eyebrow} title={about.title} />

        <div
          ref={scene.ref}
          className="grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-[minmax(0,1fr)_20rem] md:items-start"
        >
          <div className="flex flex-col gap-5">
            {about.paragraphs.map((paragraph, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -15% 0px' }}
                transition={{
                  duration: reduced ? 0 : 0.6,
                  delay: reduced ? 0 : i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="prose-longform text-body max-w-[62ch] text-whiteout/75"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <motion.div
              initial={{ clipPath: 'inset(0 0 100% 0)' }}
              whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
              viewport={{ once: true, margin: '0px 0px -20% 0px' }}
              transition={{
                duration: reduced ? 0 : 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="card-image relative aspect-[4/5] w-full overflow-hidden"
            >
              {/* The inner layer is oversized so the parallax drift never
                  exposes an edge inside the frame. */}
              <motion.div
                style={{ y: portraitY }}
                className="absolute inset-x-0 -inset-y-[8%]"
              >
                {about.portrait ? (
                  <Image
                    src={about.portrait}
                    alt={about.portraitAlt}
                    fill
                    sizes="(min-width: 768px) 20rem, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <Artwork variant="orbit" uid="about" />
                )}
              </motion.div>
            </motion.div>

            <p className="text-caption text-whiteout/55">{identity.location}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
