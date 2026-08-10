'use client';

import { useEffect, useRef, useState } from 'react';
import {
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react';

/* ============================================================================
 * SCROLL SCENE — the single source of scroll position for the whole site.
 *
 * Every scroll-linked animation reads from this. That is the point: one place
 * to tune pacing, one place to audit, and no component inventing its own
 * scroll listener. Motion shares a single rAF loop across all consumers, so
 * ten scenes cost roughly what one costs.
 *
 * It also enforces the reduced-motion contract in the type system rather than
 * by convention. `useSceneRange` requires a `restValue` — the value the
 * property must hold when motion is off — so an author physically cannot wire
 * up a scroll animation without deciding what a reduced-motion visitor sees.
 *
 * That matters because the obvious default is wrong. For an opacity ramp of
 * 0.35 → 1 → 0.35, "the last value" is 0.35, which would leave the content
 * half-invisible for exactly the users who asked for less motion. The rest
 * value there is 1. Making it an explicit argument is what stops that bug.
 * ==========================================================================*/

/** Where a section's scroll range starts and ends, in Motion's offset syntax. */
export type SceneOffset = Parameters<typeof useScroll>[0] extends
  | { offset?: infer O }
  | undefined
  ? O
  : never;

export type Scene = {
  /** Attach to the element whose scroll range drives the animation. */
  ref: React.RefObject<HTMLDivElement | null>;
  /** 0 when the section enters, 1 when it leaves. */
  progress: MotionValue<number>;
  /** True when the visitor has asked for reduced motion. */
  reduced: boolean;
};

/**
 * Create a scene bound to a section element.
 *
 * Default offset runs from "this section's top hits the viewport bottom" to
 * "this section's bottom hits the viewport top" — i.e. the whole time any part
 * of it is on screen.
 */
export function useScene(
  offset: [string, string] = ['start end', 'end start'],
): Scene {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: ref,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    offset: offset as any,
  });

  return { ref, progress: scrollYProgress, reduced };
}

/**
 * Map a scene's progress onto an output range.
 *
 * @param restValue What this property holds under reduced motion. Required —
 *   see the note at the top of this file for why it is not defaulted.
 *
 * @example
 *   const y = useSceneRange(scene, [0, 1], [0, -80], 0);        // exits upward
 *   const o = useSceneRange(scene, [0, .5, 1], [.35, 1, .35], 1); // peaks at centre
 */
export function useSceneRange<T extends number | string>(
  scene: Scene,
  input: number[],
  output: T[],
  restValue: T,
): MotionValue<T> {
  // Both hooks always run, in a stable order — only the returned value differs.
  const mapped = useTransform(scene.progress, input, output);
  const rest = useMotionValue(output[0]);

  // The rest value is applied only after mount, never during render.
  //
  // `useReducedMotion()` is false on the server and true on a client that
  // asked for it. Swapping the returned value during render would therefore
  // serialise one number into the SSR markup and a different one on hydration
  // — a genuine hydration mismatch, and precisely the bug this primitive
  // exists to prevent elsewhere. So the first client render still matches the
  // server (both read `mapped` at progress 0), and reduced-motion visitors
  // snap to the rest value on the next tick. The jump is instant and
  // unanimated, which is what they asked for anyway.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (scene.reduced && mounted) rest.set(restValue);
  }, [scene.reduced, mounted, rest, restValue]);

  return scene.reduced && mounted ? rest : (mapped as MotionValue<T>);
}
