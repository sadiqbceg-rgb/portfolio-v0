import { Reveal } from './Reveal';
import { SectionHeader } from './SectionHeader';
import { experience } from '@/content/site';

/* Experience — hairline-separated rows sharing the same left rail as the work
 * index, so the two sections scan as one grid rather than two treatments.
 */
export function Experience() {
  return (
    <section id="experience" className="py-section">
      <div className="shell flex flex-col gap-12">
        <Reveal>
          <SectionHeader eyebrow={experience.eyebrow} title={experience.title} />
        </Reveal>

        <ol className="flex flex-col">
          {experience.items.map((job) => (
            <li
              key={`${job.company}-${job.period}`}
              className="border-t hairline"
            >
              <Reveal>
                <div className="grid grid-cols-1 gap-x-10 gap-y-4 py-10 md:grid-cols-[13rem_minmax(0,1fr)]">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-control-tnt text-subheading text-whiteout">
                      {job.company}
                    </h3>
                    <p className="text-caption tabular-nums text-whiteout/50">
                      {job.period}
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <p className="text-body text-twilight-soft">{job.role}</p>
                    <p className="prose-longform text-body max-w-[62ch] text-whiteout/70">
                      {job.summary}
                    </p>
                    <ul className="flex flex-col gap-2">
                      {job.highlights.map((highlight, i) => (
                        <li
                          key={i}
                          className="prose-longform text-body flex max-w-[62ch] gap-3 text-whiteout/70"
                        >
                          <span aria-hidden="true" className="text-whiteout/50">
                            —
                          </span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
