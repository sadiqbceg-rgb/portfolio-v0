'use client';

import { useReducedMotion } from 'motion/react';
import { Fade } from '@/components/animate-ui/primitives/effects/fade';

/* Reveal — the single scroll-entrance used across the site.
 *
 * Wraps Animate UI's Fade primitive with this project's defaults so motion
 * stays consistent everywhere: a short rise, a soft fade, once per element,
 * triggered slightly before the element reaches the viewport.
 *
 * The reference calls for visual quietness, so this is deliberately small —
 * 14px of travel and half a second. It is an entrance, not a performance.
 *
 * Reduced motion is handled here rather than in CSS. Motion animates via
 * JavaScript, so the `prefers-reduced-motion` block in globals.css (which only
 * neutralises CSS transitions and animations) cannot reach it. When the user
 * has asked for reduced motion we render the children directly, with no
 * wrapper animation and no initial hidden state — so content is never stuck
 * invisible if an observer never fires.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  /** Stagger offset in milliseconds. */
  delay?: number;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <Fade
      inView
      inViewOnce
      inViewMargin="-80px"
      delay={delay}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      variants={{
        hidden: { opacity: 0, y: 14 },
        visible: { opacity: 1, y: 0 },
      }}
      className={className}
    >
      {children}
    </Fade>
  );
}
