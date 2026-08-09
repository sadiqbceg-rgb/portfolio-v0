'use client';

import { useEffect, useState } from 'react';
import { identity, nav } from '@/content/site';

/* Navigation — minimal 72px top bar, left-aligned links, right-aligned ghost
 * actions. Transparent over the hero, picking up a hairline border and a solid
 * canvas once the page scrolls so links stay legible over content.
 */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile sheet on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${
        scrolled || open
          ? 'border-b hairline bg-black-void/90 backdrop-blur-sm'
          : 'border-b border-transparent'
      }`}
    >
      <nav
        aria-label="Primary"
        className="shell flex h-nav items-center justify-between gap-6"
      >
        <a
          href="#top"
          className="font-control-tnt text-subheading text-whiteout shrink-0"
        >
          {identity.wordmark}
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {nav.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-caption text-whiteout/75 transition-colors hover:text-whiteout"
              >
                {link.label}
              </a>
            </li>
          ))}
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
        <div id="mobile-nav" className="border-t hairline md:hidden">
          <ul className="shell flex flex-col py-4">
            {nav.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-body text-whiteout/80"
                >
                  {link.label}
                </a>
              </li>
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
