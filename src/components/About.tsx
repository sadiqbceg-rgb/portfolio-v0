'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { Artwork } from './Artwork';
import { RichText } from './RichText';
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
  /* Kept small on purpose. The inner layer is oversized so the drift never
   * exposes an edge, which means whatever the overscan and the drift add up
   * to is permanently cropped off the top of the portrait. At 8% overscan and
   * 6% drift that was up to 14%, and the subject's hair sits about 5% down —
   * so the top of his head was being cut off. 4% + 3% keeps the crop under
   * half of what it was; the portrait itself was also regenerated with extra
   * headroom. Both were needed: either alone still clipped. */
  const portraitY = useSceneRange(scene, [0, 1], ['-3%', '3%'], '0%');

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
                /* Emphasis is set on the paragraph rather than globally: body
                   copy runs at 75% white so it sits behind the headings, and a
                   <strong> that only changed weight would barely register
                   against that. Full-strength white is what makes it read.
                   Scoping it here keeps the rule correct — the same markup on
                   the light panel would need the opposite colour. */
                className="prose-longform text-body max-w-[62ch] text-whiteout/75 [&_strong]:font-medium [&_strong]:text-whiteout"
              >
                <RichText text={paragraph} />
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
                className="absolute inset-x-0 -inset-y-[4%]"
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
