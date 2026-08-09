import { Reveal } from './Reveal';
import { SectionHeader } from './SectionHeader';
import { experience } from '@/content/site';

/* Experience — hairline-separated rows on the dark canvas. Surfaces separate
 * with 1px strokes, never shadows.
 */
export function Experience() {
  return (
    <section id="experience" className="py-section">
      <div className="shell flex flex-col gap-section">
        <Reveal>
          <SectionHeader eyebrow={experience.eyebrow} title={experience.title} />
        </Reveal>

        <ol className="flex flex-col">
          {experience.items.map((job) => (
            <li
              key={`${job.company}-${job.period}`}
              className="grid grid-cols-1 gap-4 border-t hairline py-8 md:grid-cols-[220px_1fr] md:gap-8"
            >
              <div className="flex flex-col gap-1">
                <h3 className="font-control-tnt text-subheading text-whiteout">
                  {job.company}
                </h3>
                <p className="text-caption text-whiteout/50">{job.period}</p>
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-body text-twilight-soft">{job.role}</p>
                <p className="prose-longform text-body text-whiteout/70">
                  {job.summary}
                </p>
                <ul className="flex flex-col gap-2 pt-1">
                  {job.highlights.map((highlight, i) => (
                    <li
                      key={i}
                      className="prose-longform text-body flex gap-3 text-whiteout/70"
                    >
                      <span aria-hidden="true" className="text-whiteout/50">
                        —
                      </span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
