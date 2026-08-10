'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useActiveSection } from '@/hooks/use-active-section';
import { identity, nav } from '@/content/site';

/* ============================================================================
 * NAVIGATION — minimal, persistent, unobtrusive.
 *
 * Transparent over the hero, picking up a blurred dark ground once the page
 * scrolls so links stay legible over content.
 *
 * The active-section indicator is a single underline that slides between
 * items via a shared layoutId, rather than one underline per link fading in
 * and out. It reads as one object moving, which is both cheaper and calmer.
 *
 * Section ids are derived from the nav hrefs, so adding a nav entry in
 * site.ts wires up its indicator with no change here.
 * ==========================================================================*/

const SECTION_IDS = nav.links.map((l) => l.href.replace('#', ''));

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const active = useActiveSection(SECTION_IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Escape closes the mobile sheet, and the body cannot scroll behind it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${
        scrolled || open
          ? 'border-b hairline bg-black-void/72 backdrop-blur-md'
          : 'border-b border-transparent'
      }`}
    >
      <nav
        aria-label="Primary"
        className="shell flex h-nav items-center justify-between gap-6"
      >
        {/* Wordmark expands to the full name on wide viewports. The initials
            hold the layout so nothing shifts when it opens. */}
        <a
          href="#top"
          className="group font-control-tnt text-subheading text-whiteout shrink-0"
        >
          <span aria-hidden="true">{identity.wordmark}</span>
          <span
            className="hidden overflow-hidden whitespace-nowrap align-baseline transition-[max-width,opacity] duration-300 ease-out lg:inline-block lg:max-w-0 lg:opacity-0 lg:group-hover:max-w-[16rem] lg:group-hover:opacity-100 lg:group-focus-visible:max-w-[16rem] lg:group-focus-visible:opacity-100"
            aria-hidden="true"
          >
            <span className="pl-2">{identity.name}</span>
          </span>
          <span className="sr-only">{identity.name} — back to top</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {nav.links.map((link) => {
            const id = link.href.replace('#', '');
            const isActive = active === id;
            return (
              <li key={link.href} className="relative">
                <a
                  href={link.href}
                  aria-current={isActive ? 'true' : undefined}
                  className={`text-caption transition-colors ${
                    isActive
                      ? 'text-whiteout'
                      : 'text-whiteout/60 hover:text-whiteout'
                  }`}
                >
                  {link.label}
                </a>
                {isActive ? (
                  <motion.span
                    layoutId={reducedMotion ? undefined : 'nav-active'}
                    className="absolute -bottom-1.5 left-0 h-px w-full bg-whiteout"
                    transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                  />
                ) : null}
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          {nav.actions.map((action) => (
            <a
              key={action.label}
              href={action.href}
              className="btn-ghost"
              {...(action.external
                ? { target: '_blank', rel: 'noreferrer' }
                : {})}
            >
              {action.label}
            </a>
          ))}
        </div>

        <button
          type="button"
          className="btn-ghost md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </nav>

      {open ? (
        <div
          id="mobile-nav"
          className="border-t hairline bg-black-void/95 backdrop-blur-md md:hidden"
        >
          <ul className="shell flex flex-col py-4">
            {nav.links.map((link, i) => (
              <motion.li
                key={link.href}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reducedMotion ? 0 : 0.3,
                  delay: reducedMotion ? 0 : i * 0.04,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block py-3 text-body ${
                    active === link.href.replace('#', '')
                      ? 'text-whiteout'
                      : 'text-whiteout/75'
                  }`}
                >
                  {link.label}
                </a>
              </motion.li>
            ))}
            <li className="mt-3 flex flex-wrap gap-2">
              {nav.actions.map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  onClick={() => setOpen(false)}
                  className="btn-ghost"
                  {...(action.external
                    ? { target: '_blank', rel: 'noreferrer' }
                    : {})}
                >
                  {action.label}
                </a>
              ))}
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}
