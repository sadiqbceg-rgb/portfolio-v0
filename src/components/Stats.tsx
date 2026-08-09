'use client';

import { useReducedMotion } from 'motion/react';
import { CountingNumber } from '@/components/animate-ui/primitives/texts/counting-number';
import { Reveal } from './Reveal';
import { stats } from '@/content/site';

/* Stats — figures that count up as they enter the viewport.
 *
 * Under reduced motion the final value renders immediately as plain text; the
 * number is the content, so it must never depend on an animation to appear.
 */
export function Stats() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="border-y hairline py-section">
      <div className="shell grid grid-cols-2 gap-8 md:grid-cols-4">
        {stats.items.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 80}>
            <div className="flex flex-col gap-2">
              <p className="font-control-tnt text-heading-lg text-whiteout tabular-nums">
                {reducedMotion ? (
                  <span>{stat.value.toFixed(stat.decimalPlaces ?? 0)}</span>
                ) : (
                  <CountingNumber
                    number={stat.value}
                    decimalPlaces={stat.decimalPlaces ?? 0}
                    inView
                    inViewOnce
                    inViewMargin="-80px"
                    /* Animate UI's default spring (stiffness 90 / damping 50)
                     * takes ~7s to settle on a decimal value — long enough that
                     * a visitor scrolls past mid-count. This lands in ~1.5s. */
                    transition={{ stiffness: 260, damping: 34 }}
                  />
                )}
                <span aria-hidden="true">{stat.suffix}</span>
              </p>
              <p className="text-caption text-whiteout/60">{stat.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
