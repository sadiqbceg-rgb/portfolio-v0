import { Reveal } from './Reveal';
import { SectionHeader } from './SectionHeader';
import { skills } from '@/content/site';

/* Skills — three hairline-separated columns on the dark canvas.
 *
 * Previously three light cards, which put another row of pale slabs on the
 * page for content that is really just three short lists. Rules do the same
 * separating job without the visual weight.
 */
export function Skills() {
  return (
    <section id="skills" className="py-section">
      <div className="shell flex flex-col gap-12">
        <Reveal>
          <SectionHeader eyebrow={skills.eyebrow} title={skills.title} />
        </Reveal>

        <div className="grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-3">
          {skills.groups.map((group, i) => (
            <Reveal key={group.name} delay={i * 70}>
              <div className="flex h-full flex-col gap-4 border-t hairline pt-5">
                <h3 className="text-caption uppercase tracking-[0.14em] text-whiteout/55">
                  {group.name}
                </h3>
                <ul className="flex flex-col gap-2">
                  {group.items.map((item) => (
                    <li key={item} className="text-body text-whiteout/80">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
