'use client';

import { useReducedMotion } from 'motion/react';
import { Tilt } from '@/components/animate-ui/primitives/effects/tilt';
import { Artwork } from './Artwork';
import { Reveal } from './Reveal';
import { SectionHeader } from './SectionHeader';
import { work } from '@/content/site';

/* Selected Work — Haze cards as light islands on the dark canvas, each holding
 * an Image Card with Radius. Two-column grid with 24px gutters.
 *
 * Cards tilt slightly toward the cursor. maxTilt is kept low (4°) — enough to
 * feel responsive, not enough to read as a gimmick on a restrained layout.
 */
export function Work() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="work" className="py-section">
      <div className="shell flex flex-col gap-section">
        <Reveal>
          <SectionHeader
            eyebrow={work.eyebrow}
            title={work.title}
            subtitle={work.subtitle}
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {work.items.map((item, i) => {
            const card = (
              <article className="card-haze flex h-full flex-col gap-5">
                <div className="card-image aspect-[8/5] w-full">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={`${item.title} screenshot`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Artwork variant={item.art} uid={`work-${i}`} />
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-control-tnt text-heading text-ink">
                      {item.title}
                    </h3>
                    <p className="text-caption text-ink/70">
                      {item.role} · {item.year}
                    </p>
                  </div>

                  <p className="prose-longform text-body text-ink/80">
                    {item.summary}
                  </p>

                  <ul className="flex flex-wrap gap-2 pt-1">
                    {item.stack.map((tech) => (
                      <li key={tech} className="text-caption text-signal-on-light">
                        {tech}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    {item.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        className="link-underline link-underline-ink text-caption"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </article>
            );

            return (
              <Reveal key={item.title} delay={i * 80}>
                {reducedMotion ? (
                  card
                ) : (
                  <Tilt maxTilt={4} perspective={1200} className="h-full">
                    {card}
                  </Tilt>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
