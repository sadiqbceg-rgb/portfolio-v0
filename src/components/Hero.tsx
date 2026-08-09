import { Atmosphere } from './Artwork';
import { hero } from '@/content/site';

/* Full-Bleed Photographic Section + Dual-Style Headline.
 *
 * Breaks the 1150px container to fill the viewport, with the headline mixing
 * upright Control TNT against one italic Control Cursive word — the reference's
 * signature typographic tension.
 */
export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-svh items-center overflow-hidden pt-nav"
    >
      <Atmosphere uid="hero" variant="clouds" />

      <div className="shell flex flex-col items-center gap-8 py-24 text-center">
        <p className="text-subheading text-twilight-soft">{hero.eyebrow}</p>

        <h1 className="font-control-tnt text-heading-lg text-whiteout max-w-[18ch] text-balance">
          {hero.headline.map((part, i) => (
            <span key={i}>
              <span className={part.accent ? 'accent-cursive' : undefined}>
                {part.text}
              </span>
              {i < hero.headline.length - 1 ? ' ' : ''}
            </span>
          ))}
        </h1>

        <p className="prose-longform text-body max-w-[52ch] text-whiteout/80">
          {hero.subhead}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {hero.actions.map((action) => (
            <a key={action.label} href={action.href} className="btn-ghost">
              {action.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
