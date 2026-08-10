'use client';

import { useReducedMotion } from 'motion/react';
import { CountingNumber } from '@/components/animate-ui/primitives/texts/counting-number';
import { Reveal } from './Reveal';
import { stats } from '@/content/site';

/* Stats — a hairline-divided row, left-aligned within each cell.
 *
 * Under reduced motion the final value renders immediately as plain text. The
 * number is the content, so it must never depend on an animation to appear.
 */
export function Stats() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="py-section">
      <div className="shell">
        <dl className="grid grid-cols-2 gap-px overflow-hidden md:grid-cols-4">
          {stats.items.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 70}>
              <div className="flex h-full flex-col gap-2 border-t hairline pt-5 md:border-l md:pl-6 md:first:border-l-0 md:first:pl-0">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-control-tnt text-heading text-whiteout tabular-nums">
                  {reducedMotion ? (
                    <span>{stat.value.toFixed(stat.decimalPlaces ?? 0)}</span>
                  ) : (
                    <CountingNumber
                      number={stat.value}
                      decimalPlaces={stat.decimalPlaces ?? 0}
                      inView
                      inViewOnce
                      inViewMargin="-80px"
                      /* The library default (stiffness 90 / damping 50) takes
                       * ~7s to settle on a decimal — long enough to scroll
                       * past mid-count. This lands in about a second. */
                      transition={{ stiffness: 260, damping: 34 }}
                    />
                  )}
                  <span aria-hidden="true">{stat.suffix}</span>
                </dd>
                <p aria-hidden="true" className="text-caption max-w-[22ch] text-whiteout/55">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
