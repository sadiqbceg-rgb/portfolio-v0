import { contact, footer, identity } from '@/content/site';

/* Footer — minimal, two rows, hairline top border.
 *
 * Deliberately no live clock. The reference has one; it is an SSR hydration
 * hazard and adds nothing to a portfolio. The copyright year is safe because
 * this is a Server Component, so `new Date()` runs server-side only and is
 * serialised into the HTML — there is no client render to disagree with it.
 *
 * Links use a wiping underline rather than a fading one: a transform-only
 * hover that never touches layout.
 */
export function Footer() {
  const links = [
    ...contact.socials,
    { label: 'Email', href: `mailto:${identity.email}` },
  ];

  return (
    <footer className="border-t hairline py-12">
      <div className="shell flex flex-col gap-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="font-control-tnt text-subheading text-whiteout">
            {identity.name}
          </p>

          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(link.href.startsWith('mailto:')
                    ? {}
                    : { target: '_blank', rel: 'noreferrer' })}
                  className="group relative inline-block text-caption text-whiteout/65 transition-colors hover:text-whiteout"
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-whiteout transition-transform duration-200 group-hover:scale-x-100 group-focus-visible:scale-x-100"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2 border-t hairline pt-6 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="text-caption text-whiteout/55">
            © {new Date().getFullYear()} {identity.name}
          </p>
          <p className="text-caption text-whiteout/55">{footer.note}</p>
        </div>
      </div>
    </footer>
  );
}
