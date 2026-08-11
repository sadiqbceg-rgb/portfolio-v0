'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { Artwork, type ArtVariant } from './Artwork';

/* ============================================================================
 * STICKY MEDIA — the frame that holds still while the copy advances.
 *
 * The reference pins one viewport and swaps its payload. A faithful copy over
 * eight projects would mean ~800vh of scrolling with the page frozen for most
 * of it, and pinned sections feel broken under a thumb. So the visual column
 * is `position: sticky` instead: scrolling never stops, but the frame holds
 * while the copy column moves past it. Same read, roughly half the scroll
 * cost, and it degrades to a plain stacked image on mobile with no special
 * casing.
 *
 * Only the active payload is mounted. Cross-fading eight canvases or eight
 * images simultaneously would be wasteful; the exit animation is what makes
 * the swap read as a dissolve rather than a cut.
 *
 * A named image that fails to load falls back to the generative canvas instead
 * of leaving a broken frame. Filenames are the fragile part of this section —
 * a space, a capital letter, or a `/public` prefix left in the path all
 * produce a 404, and on a dark background an empty image box is easy to miss.
 * The failure is logged with the path it tried so it is findable.
 * ==========================================================================*/

export type MediaItem = {
  title: string;
  art: ArtVariant;
  image?: string;
  imagePosition?: 'left' | 'center' | 'right';
};

/* Tailwind scans source for whole class names, so these cannot be built by
   interpolation — a template literal would compile to nothing. */
const OBJECT_POSITION = {
  left: 'object-left',
  center: 'object-center',
  right: 'object-right',
} as const;

export function StickyMedia({
  items,
  activeIndex,
  className = '',
}: {
  items: MediaItem[];
  activeIndex: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  // Keyed by src, so fixing a filename and reloading clears the failure, and
  // one bad path never suppresses a different project's working image.
  const [failed, setFailed] = useState<Record<string, true>>({});
  const item = items[activeIndex];
  if (!item) return null;

  const src = item.image && !failed[item.image] ? item.image : undefined;

  return (
    <div className={`card-image relative aspect-[16/11] w-full ${className}`}>
      {/* Keyed on the index so Motion treats each payload as a new element and
          runs the enter/exit pair, rather than mutating one node in place. */}
      <motion.div
        key={activeIndex}
        initial={{ opacity: 0, scale: reduced ? 1 : 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: reduced ? 0 : 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="absolute inset-0"
      >
        {src ? (
          <Image
            src={src}
            alt={`${item.title} — project visual`}
            fill
            sizes="(min-width: 1000px) 44vw, 100vw"
            className={`object-cover ${OBJECT_POSITION[item.imagePosition ?? 'center']}`}
            onError={() => {
              console.warn(
                `[work] image failed to load: ${src} — check that the file exists in public${src} and that the name matches exactly (case included). Falling back to generated artwork.`,
              );
              setFailed((prev) => ({ ...prev, [src]: true }));
            }}
            /* Deliberately NOT priority. This component is instantiated once
             * per project for the mobile stack plus once for the desktop
             * sticky column, so any priority rule here fires for every copy —
             * an earlier version preloaded all eight images (~1.2 MB) into the
             * document head on first paint. The whole section sits below the
             * fold; lazy is correct, and LCP stays the hero headline. */
          />
        ) : (
          <Artwork variant={item.art} uid={`media-${activeIndex}`} />
        )}
      </motion.div>
    </div>
  );
}
