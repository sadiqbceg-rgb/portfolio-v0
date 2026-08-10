'use client';

import { useReducedMotion } from 'motion/react';
import { Tilt } from '@/components/animate-ui/primitives/effects/tilt';
import { Artwork } from './Artwork';
import { Reveal } from './Reveal';
import { SectionHeader } from './SectionHeader';
import { work } from '@/content/site';

/* Selected work — an indexed list rather than a grid of cards.
 *
 * Four large light cards on a dark page read as four identical slabs; a list
 * with a year rail and hairline rules reads as a body of work. The year is the
 * left column because it is real information, so it earns the position that a
 * decorative 01 / 02 / 03 counter would otherwise take.
 *
 * The thumbnail is deliberately small. It gives each row a visual anchor
 * without pretending the generated artwork is a screenshot.
 */
export function Work() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="work" className="py-section">
      <div className="shell flex flex-col gap-12">
        <Reveal>
          <SectionHeader
            eyebrow={work.eyebrow}
            title={work.title}
            subtitle={work.subtitle}
          />
        </Reveal>

        <ol className="flex flex-col">
          {work.items.map((item, i) => {
            const thumb = (
              <div className="card-image aspect-[16/11] w-full">
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
            );

            return (
              <li key={item.title} className="border-t hairline">
                <Reveal>
                  <article className="grid grid-cols-1 gap-x-10 gap-y-6 py-10 md:grid-cols-[5rem_minmax(0,1fr)_20rem]">
                    {/* Year rail */}
                    <div className="flex flex-row items-baseline gap-3 md:flex-col md:gap-1">
                      <p className="text-body tabular-nums text-whiteout">
                        {item.year}
                      </p>
                      <p className="text-caption text-whiteout/50">{item.role}</p>
                    </div>

                    <div className="flex flex-col gap-4">
                      <h3 className="font-control-tnt text-heading text-whiteout">
                        {item.title}
                      </h3>

                      <p className="prose-longform text-body max-w-[62ch] text-whiteout/70">
                        {item.summary}
                      </p>

                      <ul className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        {item.stack.map((tech) => (
                          <li key={tech} className="text-caption text-twilight-soft">
                            {tech}
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap items-center gap-5 pt-1">
                        {item.links.map((link) => (
                          <a
                            key={link.label}
                            href={link.href}
                            className="link-underline text-caption"
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                    </div>

                    {reducedMotion ? (
                      thumb
                    ) : (
                      <Tilt maxTilt={6} perspective={900}>
                        {thumb}
                      </Tilt>
                    )}
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
