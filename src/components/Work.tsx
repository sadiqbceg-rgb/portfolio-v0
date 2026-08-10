'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Eyebrow } from './Eyebrow';
import { TextReveal } from './TextReveal';
import { StickyMedia } from './StickyMedia';
import { work } from '@/content/site';

/* ============================================================================
 * SELECTED WORK — one continuous sequence.
 *
 * This merges what used to be two separate sections of six, four of which were
 * literally the same projects listed twice. It is now eight distinct pieces in
 * a single run: one body of work rather than two competing lists.
 *
 * Desktop: the visual column is sticky and its payload swaps as each copy
 * block crosses the viewport midline. Mobile: the image sits with its own copy
 * and everything stacks — no sticky, no index tracking.
 *
 * The active index is driven by whichever block last crossed the midline,
 * reported by the blocks themselves via viewport callbacks. That keeps the
 * state to one number and adds no second scroll listener.
 * ==========================================================================*/

const ALL = 'All';

export function Work() {
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState(ALL);
  const [active, setActive] = useState(0);

  const filters = useMemo(
    () => [ALL, ...Array.from(new Set(work.items.map((i) => i.tag)))],
    [],
  );

  const visible = useMemo(
    () =>
      filter === ALL ? work.items : work.items.filter((i) => i.tag === filter),
    [filter],
  );

  return (
    <section id="work" className="py-section-lg">
      <div className="shell flex flex-col gap-12">
        <header className="flex flex-col gap-6 border-t hairline pt-6">
          <Eyebrow>{work.eyebrow}</Eyebrow>
          <div className="grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
            <TextReveal
              as="h2"
              className="font-control-tnt text-heading-lg text-whiteout max-w-[16ch] text-balance"
              lines={[work.title]}
            />
            <p className="prose-longform text-body self-end text-whiteout/65">
              {work.subtitle}
            </p>
          </div>
        </header>

        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter work by category"
        >
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              className="pill"
              aria-pressed={filter === f}
              onClick={() => {
                setFilter(f);
                setActive(0);
              }}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-x-16 lg:grid-cols-[minmax(0,1fr)_44%] lg:items-start">
          {/* Copy column */}
          <ol className="flex flex-col">
            {visible.map((item, i) => (
              <motion.li
                key={item.title}
                onViewportEnter={() => setActive(i)}
                viewport={{ margin: '-45% 0px -45% 0px' }}
                className="flex flex-col gap-6 border-t hairline py-12 lg:min-h-[72vh] lg:justify-center lg:py-20"
              >
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                  <span className="font-control-tnt text-subheading tabular-nums text-whiteout/55">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-caption text-twilight-soft">
                    {item.tag}
                  </span>
                </div>

                <TextReveal
                  as="h3"
                  className="font-control-tnt text-heading text-whiteout text-balance"
                  lines={[item.title]}
                />

                {/* Mobile carries the visual inline with its own copy; on
                    desktop the sticky column holds it instead. */}
                <div className="lg:hidden">
                  <StickyMedia items={[item]} activeIndex={0} />
                </div>

                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px 0px -20% 0px' }}
                  transition={{
                    duration: reduced ? 0 : 0.6,
                    delay: reduced ? 0 : 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="prose-longform text-body max-w-[54ch] text-whiteout/70"
                >
                  {item.summary}
                </motion.p>

                {item.role || item.stack?.length ? (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '0px 0px -20% 0px' }}
                    transition={{
                      duration: reduced ? 0 : 0.6,
                      delay: reduced ? 0 : 0.12,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="flex flex-wrap items-center gap-x-3 gap-y-2"
                  >
                    {item.role ? (
                      <span className="text-caption text-whiteout/60">
                        {item.role}
                      </span>
                    ) : null}
                    {item.stack?.map((tech) => (
                      <span
                        key={tech}
                        className="text-caption text-whiteout/60"
                      >
                        · {tech}
                      </span>
                    ))}
                  </motion.div>
                ) : null}

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px 0px -20% 0px' }}
                  transition={{
                    duration: reduced ? 0 : 0.6,
                    delay: reduced ? 0 : 0.18,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="flex flex-wrap items-center gap-5"
                >
                  {item.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="link-underline group text-caption"
                    >
                      {link.label}
                      <span
                        aria-hidden="true"
                        className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-1"
                      >
                        ↗
                      </span>
                    </a>
                  ))}
                </motion.div>
              </motion.li>
            ))}
          </ol>

          {/* Sticky visual column — desktop only. */}
          <div className="sticky-media hidden lg:block">
            <StickyMedia items={visible} activeIndex={active} />
          </div>
        </div>
      </div>
    </section>
  );
}
