'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { SectionHeader } from './SectionHeader';
import { useScene, useSceneRange } from './ScrollScene';
import { experience } from '@/content/site';

/* ============================================================================
 * EXPERIENCE — a tracked timeline.
 *
 * Three roles is a small enough set that heavy machinery would be
 * conspicuous, so the interaction is just two things: a progress line that
 * fills as you scroll the section, and node markers that light when their
 * role reaches the viewport midline.
 *
 * The line is scaleY on a 1px element with transform-origin at the top — no
 * height animation, so it never triggers layout.
 * ==========================================================================*/

export function Experience() {
  const reduced = useReducedMotion();
  const scene = useScene(['start 80%', 'end 60%']);
  const lineScale = useSceneRange(scene, [0, 1], [0, 1], 1);
  const [active, setActive] = useState(0);

  return (
    <section id="experience" className="py-section-lg">
      <div className="shell flex flex-col gap-12">
        <SectionHeader eyebrow={experience.eyebrow} title={experience.title} />

        <div ref={scene.ref} className="relative">
          {/* Progress rail — the track, then the fill scaling over it. */}
          <div className="absolute bottom-0 left-0 top-0 hidden w-px bg-whiteout/12 md:block" />
          <motion.div
            style={{ scaleY: lineScale, transformOrigin: 'top' }}
            className="absolute bottom-0 left-0 top-0 hidden w-px bg-whiteout/45 md:block"
          />

          <ol className="flex flex-col">
            {experience.items.map((job, i) => (
              <motion.li
                key={`${job.company}-${job.period}`}
                onViewportEnter={() => setActive(i)}
                viewport={{ margin: '-45% 0px -45% 0px' }}
                className="relative border-t hairline py-10 first:border-t-0 md:pl-10"
              >
                {/* Node marker, filled while its role owns the midline. */}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-[3.25rem] hidden h-1.5 w-1.5 -translate-x-[3px] rounded-full transition-colors duration-300 md:block ${
                    active === i ? 'bg-signal-blue' : 'bg-whiteout/30'
                  }`}
                />

                <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-[13rem_minmax(0,1fr)]">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-control-tnt text-subheading text-whiteout">
                      {job.company}
                    </h3>
                    <p className="text-caption tabular-nums text-whiteout/55">
                      {job.period}
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <p className="text-body text-twilight-soft">{job.role}</p>
                    <p className="prose-longform text-body max-w-[62ch] text-whiteout/70">
                      {job.summary}
                    </p>
                    <ul className="flex flex-col gap-2">
                      {job.highlights.map((highlight, h) => (
                        <motion.li
                          key={h}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: '0px 0px -15% 0px' }}
                          transition={{
                            duration: reduced ? 0 : 0.5,
                            delay: reduced ? 0 : h * 0.07,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="prose-longform text-body flex max-w-[62ch] gap-3 text-whiteout/70"
                        >
                          <span aria-hidden="true" className="text-whiteout/50">
                            —
                          </span>
                          <span>{highlight}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
