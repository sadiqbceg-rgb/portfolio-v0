import { logoBar } from '@/content/site';

/* Logo bar — a single left-aligned row of monochrome wordmarks.
 *
 * Text wordmarks keep the site free of image dependencies. To use real logos,
 * swap the <li> contents for <img src="/logos/name.svg" /> and keep the
 * opacity treatment — monochrome white is the reference's handling.
 */
export function LogoBar() {
  return (
    <section className="py-section">
      <div className="shell flex flex-col gap-6 border-t hairline pt-6 sm:flex-row sm:items-baseline sm:gap-12">
        <p className="text-caption shrink-0 uppercase tracking-[0.16em] text-whiteout/55">
          {logoBar.caption}
        </p>
        <ul className="flex flex-wrap items-baseline gap-x-8 gap-y-3">
          {logoBar.logos.map((logo) => (
            <li
              key={logo}
              className="font-control-tnt text-subheading text-whiteout/60"
            >
              {logo}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
