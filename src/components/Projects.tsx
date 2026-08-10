'use client';

import { useMemo, useState } from 'react';
import { Reveal } from './Reveal';
import { SectionHeader } from './SectionHeader';
import { projects } from '@/content/site';

/* Projects — pill filters (the only fully rounded shape the design allows)
 * above a three-column grid of hairline-topped entries.
 *
 * Filters derive from the tags used in src/content/site.ts, so adding a
 * project with a new tag adds its chip automatically.
 */
const ALL = 'All';

export function Projects() {
  const [active, setActive] = useState(ALL);

  const filters = useMemo(
    () => [ALL, ...Array.from(new Set(projects.items.map((p) => p.tag)))],
    [],
  );

  const visible = useMemo(
    () =>
      active === ALL
        ? projects.items
        : projects.items.filter((p) => p.tag === active),
    [active],
  );

  return (
    <section id="projects" className="py-section">
      <div className="shell flex flex-col gap-12">
        <Reveal>
          <SectionHeader
            eyebrow={projects.eyebrow}
            title={projects.title}
            subtitle={projects.subtitle}
          />
        </Reveal>

        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter projects by category"
        >
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              className="pill"
              aria-pressed={active === filter}
              onClick={() => setActive(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <ul className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <li
              key={project.name}
              className="flex flex-col gap-3 border-t hairline pt-5"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-control-tnt text-subheading text-whiteout">
                  {project.name}
                </h3>
                <span className="text-caption tabular-nums text-whiteout/55">
                  {project.year}
                </span>
              </div>

              <p className="prose-longform text-body text-whiteout/65">
                {project.description}
              </p>

              <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                <span className="text-caption text-twilight-soft">
                  {project.tag}
                </span>
                <a href={project.href} className="link-underline text-caption">
                  View
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
