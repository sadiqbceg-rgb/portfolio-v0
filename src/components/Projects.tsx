'use client';

import { useMemo, useState } from 'react';
import { SectionHeader } from './SectionHeader';
import { projects } from '@/content/site';

/* Projects — Pill Toggle Buttons as filter chips above a three-column grid.
 * Pills are the only place the design permits a fully rounded shape.
 *
 * Filters derive from the tags used in src/content/site.ts, so adding a project
 * with a new tag adds its chip automatically — there is no second list to keep
 * in sync.
 */
const ALL = 'All';

export function Projects() {
  const [active, setActive] = useState(ALL);

  const filters = useMemo(() => {
    const tags = projects.items.map((p) => p.tag);
    return [ALL, ...Array.from(new Set(tags))];
  }, []);

  const visible = useMemo(
    () =>
      active === ALL
        ? projects.items
        : projects.items.filter((p) => p.tag === active),
    [active],
  );

  return (
    <section id="projects" className="py-section">
      <div className="shell flex flex-col gap-section">
        <SectionHeader
          eyebrow={projects.eyebrow}
          title={projects.title}
          subtitle={projects.subtitle}
        />

        <div
          className="flex flex-wrap justify-center gap-2"
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

        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project, i) => (
            <li
              key={`${project.name}-${i}`}
              className="flex flex-col gap-3 rounded-card border hairline p-card transition-colors hover:border-whiteout/40"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-control-tnt text-subheading text-whiteout">
                  {project.name}
                </h3>
                <span className="text-caption text-whiteout/50">
                  {project.year}
                </span>
              </div>

              <p className="prose-longform text-body text-whiteout/70">
                {project.description}
              </p>

              <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                <span className="text-caption text-twilight-soft">
                  {project.tag}
                </span>
                <a
                  href={project.href}
                  className="link-underline text-caption"
                >
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
