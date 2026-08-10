'use client';

import { useEffect, useState } from 'react';

/* ============================================================================
 * USE ACTIVE SECTION — which section currently owns the viewport.
 *
 * One IntersectionObserver watches every section, not one observer per link.
 * The nav is the only consumer today, but anything that needs to know "where
 * am I on the page" should read from here rather than adding a scroll listener.
 *
 * The rootMargin collapses the viewport to a thin band across its middle
 * (-45% top, -55% bottom). A section is "active" only while it crosses that
 * band, which means exactly one section is active at a time and the nav never
 * flickers between two entries during a scroll — the failure mode you get from
 * naive threshold-based detection.
 * ==========================================================================*/

export function useActiveSection(
  /** Section ids in document order, without the leading '#'. */
  ids: string[],
  { rootMargin = '-45% 0px -55% 0px' }: { rootMargin?: string } = {},
): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (ids.length === 0) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // Only promote on entry. Ignoring exits is what keeps the last
          // section active while scrolling past the end of the page, instead
          // of clearing the indicator into an empty state.
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin, threshold: 0 },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
    // `ids` is a literal array at every call site; join it so a new array
    // identity with identical contents does not tear down the observer.
  }, [ids.join('|'), rootMargin]); // eslint-disable-line react-hooks/exhaustive-deps

  return active;
}
