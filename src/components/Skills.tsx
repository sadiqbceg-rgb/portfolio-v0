'use client';

import { motion, useReducedMotion } from 'motion/react';
import { SectionHeader } from './SectionHeader';
import { skills } from '@/content/site';

/* ============================================================================
 * SKILLS — three movements, not a wall of pills.
 *
 * Each group is a full-width row on a shared grid: a large numeral, the
 * movement name, and its items flowed as text rather than listed as chips.
 * Chips fragment the eye; a flowed line reads as a sentence about what you do.
 *
 * The whole interaction is one hairline drawing left to right per row. This
 * section sits between two heavier ones and its job is to stay quiet.
 * ==========================================================================*/

export function Skills() {
  const reduced = useReducedMotion();

  return (
    <section id="skills" className="py-section-lg">
      <div className="shell flex flex-col gap-12">
        <SectionHeader eyebrow={skills.eyebrow} title={skills.title} />

        <div className="flex flex-col">
          {skills.groups.map((group, i) => (
            <div key={group.name} className="flex flex-col gap-6 py-10">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: '0px 0px -12% 0px' }}
                transition={{
                  duration: reduced ? 0 : 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ transformOrigin: 'left' }}
                className="h-px w-full bg-whiteout/15"
              />

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -12% 0px' }}
                transition={{
                  duration: reduced ? 0 : 0.6,
                  delay: reduced ? 0 : 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-[5rem_14rem_minmax(0,1fr)] md:items-baseline"
              >
                <span className="font-control-tnt text-heading tabular-nums text-whiteout/45">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <h3 className="font-control-tnt text-subheading text-whiteout">
                  {group.name}
                </h3>

                <p className="prose-longform text-body text-whiteout/70">
                  {group.items.join(' · ')}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
