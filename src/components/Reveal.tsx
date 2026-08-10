'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { Fade } from '@/components/animate-ui/primitives/effects/fade';

/* Reveal — the scroll entrance used for supporting content.
 *
 * Wraps Animate UI's Fade with this project's defaults so motion stays
 * consistent: a short rise, a soft fade, once per element, triggered slightly
 * before the element reaches the viewport. The reference calls for visual
 * quietness, so it is deliberately small — 14px of travel and half a second.
 *
 * Headline moments use TextReveal instead; this is for everything else.
 *
 * ---------------------------------------------------------------------------
 * Reduced motion is handled WITHOUT branching the markup.
 *
 * The previous version returned a plain <div> for reduced-motion visitors and
 * a <Fade> for everyone else. Because `useReducedMotion()` is false during SSR
 * and true on a client that asked for it, that rendered two different trees
 * and produced a real hydration mismatch — React discarded the server HTML and
 * re-rendered the whole page on the client. It only ever surfaced for
 * reduced-motion users, which is exactly why it went unnoticed.
 *
 * Now the tree is identical in both modes. After mount, reduced-motion
 * visitors get `inView={false}`, which makes useIsInView return true
 * unconditionally (`isInView = !inView || inViewResult`), so the content
 * animates to its visible state immediately with a zero-length transition —
 * no observer dependency, nothing that can leave content stranded.
 * ---------------------------------------------------------------------------
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

  // The reduced-motion decision is applied after mount, never during render,
  // so the first client render still matches the server.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const motionOff = Boolean(reducedMotion) && mounted;

  return (
    <Fade
      inView={!motionOff}
      inViewOnce
      inViewMargin="-80px"
      delay={motionOff ? 0 : delay}
      transition={{ duration: motionOff ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
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
