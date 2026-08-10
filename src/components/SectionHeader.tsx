'use client';

import { motion, useReducedMotion } from 'motion/react';
import { Eyebrow } from './Eyebrow';
import { TextReveal } from './TextReveal';

/* Section header — left-aligned on a hairline that draws itself in from the
 * left as the section arrives. The rule is what ties the stack of sections
 * into one grid rather than five separate blocks, so animating it is what
 * makes a section feel like it is being *laid down* rather than fading up.
 */
export function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <header className="flex flex-col gap-6">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: reduced ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: 'left' }}
        className="h-px w-full bg-whiteout/15"
      />

      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}

      <div className="grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
        <TextReveal
          as="h2"
          className="font-control-tnt text-heading-lg text-whiteout max-w-[16ch] text-balance"
          lines={[title]}
        />
        {subtitle ? (
          <p className="prose-longform text-body self-end text-whiteout/65">
            {subtitle}
          </p>
        ) : null}
      </div>
    </header>
  );
}
