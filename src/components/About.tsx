import { Artwork } from './Artwork';
import { about, identity } from '@/content/site';

/* About — two-column split: long-form copy at 400 weight beside an Image Card.
 * This is the one place the style guide allows body text to drop below 500.
 */
export function About() {
  return (
    <section id="about" className="py-section">
      <div className="shell grid grid-cols-1 items-center gap-10 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <p className="text-subheading text-twilight-soft">{about.eyebrow}</p>
          <h2 className="font-control-tnt text-heading-lg text-whiteout">
            {about.title}
          </h2>
          {about.paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className="prose-longform text-body max-w-[56ch] text-whiteout/75"
            >
              {paragraph}
            </p>
          ))}
          <p className="text-caption pt-2 text-whiteout/50">
            {identity.location}
          </p>
        </div>

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
      </div>
    </section>
  );
}
