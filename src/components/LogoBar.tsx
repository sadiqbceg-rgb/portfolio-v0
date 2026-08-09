import { logoBar } from '@/content/site';

/* Logo Bar Row — single row of monochrome wordmarks on the dark canvas,
 * 32px column gap / 48px row gap, rendered in semi-transparent white.
 *
 * These are text wordmarks so the site ships with no image dependencies. To use
 * real logos, replace the <span> with an <img src="/logos/name.svg" /> and keep
 * the opacity classes — monochrome white is the reference's treatment.
 */
export function LogoBar() {
  return (
    <section className="border-y hairline py-section">
      <div className="shell flex flex-col items-center gap-8">
        <p className="text-caption uppercase tracking-[0.18em] text-whiteout/50">
          {logoBar.caption}
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-12">
          {logoBar.logos.map((logo) => (
            <li
              key={logo}
              className="font-control-tnt text-subheading text-whiteout/55 transition-opacity hover:text-whiteout"
            >
              {logo}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
