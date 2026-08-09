import { Reveal } from './Reveal';
import { SectionHeader } from './SectionHeader';
import { skills } from '@/content/site';

/* Skills — three-column grid of Haze cards. Light islands on dark canvas. */
export function Skills() {
  return (
    <section id="skills" className="py-section">
      <div className="shell flex flex-col gap-section">
        <Reveal>
          <SectionHeader eyebrow={skills.eyebrow} title={skills.title} />
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {skills.groups.map((group, i) => (
            <Reveal key={group.name} delay={i * 80}>
              <div className="card-haze flex h-full flex-col gap-4">
                <h3 className="font-control-tnt text-subheading text-ink">
                  {group.name}
                </h3>
                <ul className="flex flex-col gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="text-body text-ink/75 border-b border-ink/10 pb-2 last:border-b-0 last:pb-0"
                    >
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
