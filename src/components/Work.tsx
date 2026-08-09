import { Artwork } from './Artwork';
import { SectionHeader } from './SectionHeader';
import { work } from '@/content/site';

/* Selected Work — Haze cards as light islands on the dark canvas, each holding
 * an Image Card with Radius. Two-column grid with 24px gutters.
 */
export function Work() {
  return (
    <section id="work" className="py-section">
      <div className="shell flex flex-col gap-section">
        <SectionHeader
          eyebrow={work.eyebrow}
          title={work.title}
          subtitle={work.subtitle}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {work.items.map((item, i) => (
            <article key={item.title} className="card-haze flex flex-col gap-5">
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
                    <li
                      key={tech}
                      className="text-caption text-signal-on-light"
                    >
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
          ))}
        </div>
      </div>
    </section>
  );
}
