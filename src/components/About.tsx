import { Artwork } from './Artwork';
import { Reveal } from './Reveal';
import { SectionHeader } from './SectionHeader';
import { about, identity } from '@/content/site';

/* About — long-form copy at 400 weight beside a portrait slot.
 * This is the one place the style guide allows body text below weight 500.
 */
export function About() {
  return (
    <section id="about" className="py-section">
      <div className="shell flex flex-col gap-12">
        <Reveal>
          <SectionHeader eyebrow={about.eyebrow} title={about.title} />
        </Reveal>

        <Reveal>
          <div className="grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-[minmax(0,1fr)_18rem] md:items-start">
            <div className="flex flex-col gap-5">
              {about.paragraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className="prose-longform text-body max-w-[62ch] text-whiteout/75"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <div className="card-image aspect-[4/5] w-full">
                {about.portrait ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={about.portrait}
                    alt={about.portraitAlt}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Artwork variant="glass" uid="about" />
                )}
              </div>
              <p className="text-caption text-whiteout/50">
                {identity.location}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
