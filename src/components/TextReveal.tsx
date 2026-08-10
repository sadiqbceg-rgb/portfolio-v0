'use client';

import { motion, useReducedMotion } from 'motion/react';

/* ============================================================================
 * TEXT REVEAL — line-level clip entrance for headings.
 *
 * Each line sits in an overflow-hidden mask and slides up into it, so the type
 * appears to be uncovered rather than to fade in. That difference is most of
 * what separates an editorial reveal from a generic one.
 *
 * Headings only. Body copy is never animated line-by-line — it delays reading
 * for no benefit and is actively unpleasant at paragraph length.
 *
 * ---------------------------------------------------------------------------
 * Two things here are load-bearing and easy to break:
 *
 * 1. THE OBSERVER WATCHES THE MASK, NOT THE TEXT.
 *    The inner span starts translated 110% down, which puts it entirely
 *    outside its overflow-hidden parent. IntersectionObserver accounts for
 *    clipping by ancestors, so an observer on the inner span reports "never
 *    intersecting" and the animation never fires — the text sits invisible
 *    forever. The mask is unclipped, so `whileInView` lives there and drives
 *    the child through variant propagation.
 *
 * 2. STRUCTURE AND INITIAL STATE DO NOT BRANCH ON REDUCED MOTION.
 *    `useReducedMotion()` is false during SSR and true on a client that asked
 *    for it. Rendering different markup for each produces a hydration
 *    mismatch. Reduced motion changes only the transition *duration* to zero,
 *    so the DOM is byte-identical in both modes and the text simply arrives
 *    instantly.
 *
 * Known limitation: because Motion serialises the hidden state into the SSR
 * markup, these lines require JavaScript to become visible. That is already
 * true of this site's filters, navigation and 3D hero, so it introduces no new
 * class of failure — but do not use this component for content that must
 * survive a JS failure.
 * ---------------------------------------------------------------------------
 * ==========================================================================*/

export function TextReveal({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 90,
  as: Tag = 'span',
  once = true,
}: {
  /** One entry per visual line. Line breaking is the author's decision. */
  lines: React.ReactNode[];
  className?: string;
  lineClassName?: string;
  /** Milliseconds before the first line moves. */
  delay?: number;
  /** Milliseconds between consecutive lines. */
  stagger?: number;
  as?: 'span' | 'div' | 'h1' | 'h2';
  once?: boolean;
}) {
  const reduced = useReducedMotion();

  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <motion.span
          key={i}
          className="reveal-line"
          initial="hidden"
          whileInView="visible"
          // amount: 0 fires as soon as a single pixel of the mask is visible,
          // which matters for masks that are shorter than the trigger margin.
          viewport={{ once, amount: 0, margin: '0px 0px -15% 0px' }}
        >
          <motion.span
            className={lineClassName}
            style={{ display: 'block' }}
            variants={{
              hidden: { y: '110%' },
              visible: { y: '0%' },
            }}
            transition={{
              duration: reduced ? 0 : 0.75,
              ease: [0.22, 1, 0.36, 1],
              delay: reduced ? 0 : (delay + i * stagger) / 1000,
            }}
          >
            {line}
          </motion.span>
        </motion.span>
      ))}
    </Tag>
  );
}
