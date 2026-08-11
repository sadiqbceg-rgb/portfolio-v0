'use client';

import { motion } from 'motion/react';
import { Eyebrow } from './Eyebrow';
import { TextReveal } from './TextReveal';
import { useScene, useSceneRange } from './ScrollScene';
import { contact, footer, identity } from '@/content/site';

/* ============================================================================
 * FOOTER — the closing chapter, not a legal strip.
 *
 * The page ends on a question and a way to answer it. Everything below that —
 * name, role, copyright — is deliberately small and quiet; it is reference
 * material, and giving it the same weight as the call to action is what made
 * the previous version read as boilerplate.
 *
 * THE ARRIVAL
 *
 * Three things move as the footer comes up, all driven from one scroll scene
 * so they stay in step:
 *
 *   - an ambient glow fades in from nothing and settles
 *   - the statement is uncovered line by line, the same gesture as every
 *     other heading on the site
 *   - the whole block drifts up ~40px into its resting position
 *
 * That is the entire effect. No mouse tracking, no animation loop, no canvas:
 * the footer is the last thing on the page and a permanently running
 * animation there is a battery cost with nothing watching it. The glow is a
 * static radial gradient whose opacity and scale are scroll-linked, which
 * costs one composited layer and nothing per frame.
 *
 * Reduced motion resolves every scroll-linked value to its settled state, so
 * the footer simply arrives complete — see ScrollScene for why `restValue` is
 * required rather than defaulted.
 * ==========================================================================*/

export function Footer() {
  const scene = useScene(['start end', 'end end']);

  const glowOpacity = useSceneRange(scene, [0, 0.7], [0, 1], 1);
  const glowScale = useSceneRange(scene, [0, 1], [0.7, 1], 1);
  const lift = useSceneRange(scene, [0, 0.8], [40, 0], 0);

  const year = new Date().getFullYear();

  return (
    <footer ref={scene.ref} className="relative overflow-hidden">
      {/* Ambient wash behind the CTA. aria-hidden and pointer-events-none:
          it is atmosphere, not content, and must never eat a click. */}
      <motion.div
        aria-hidden="true"
        style={{ opacity: glowOpacity, scale: glowScale }}
        className="glow-radial pointer-events-none absolute inset-x-0 bottom-0 top-[-20%] -z-10"
      />

      <div className="shell flex flex-col gap-16 pb-12 pt-section-lg">
        <motion.div style={{ y: lift }} className="flex flex-col gap-8">
          <Eyebrow>{footer.eyebrow}</Eyebrow>

          <TextReveal
            as="h2"
            className="font-control-tnt text-heading-lg text-whiteout max-w-[16ch] text-balance"
            stagger={110}
            lines={footer.statement}
          />

          {/* The CTA is a mailto rather than a link to the contact section:
              by the time someone has read to here, sending them back up the
              page to a form is friction, not navigation. */}
          <a
            href={`mailto:${identity.email}`}
            className="tap-safe group inline-flex w-fit items-baseline gap-3 border-b-2 border-whiteout/25 pb-2 transition-colors hover:border-whiteout focus-visible:border-whiteout"
          >
            <span className="font-control-tnt text-heading text-whiteout">
              {footer.ctaLabel}
            </span>
            <span
              aria-hidden="true"
              className="text-subheading text-whiteout/70 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-focus-visible:-translate-y-1 group-focus-visible:translate-x-1"
            >
              ↗
            </span>
          </a>

          <a
            href={`mailto:${identity.email}`}
            className="link-underline w-fit text-body"
          >
            {identity.email}
          </a>
        </motion.div>

        <div className="flex flex-col gap-8 border-t hairline pt-8">
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {contact.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="tap-safe group relative inline-block text-body text-whiteout/70 transition-colors hover:text-whiteout focus-visible:text-whiteout"
                >
                  {social.label}
                  {/* Wipes in from the left on hover — a transform, so it
                      never touches layout. */}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-whiteout transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100"
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <p className="text-caption text-whiteout/55">
              © {year} {footer.name}
            </p>
            <p className="text-caption text-whiteout/55">{footer.note}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
