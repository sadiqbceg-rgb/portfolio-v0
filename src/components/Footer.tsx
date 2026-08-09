import { contact, footer, identity } from '@/content/site';

/* Footer — sits on the dark canvas with light text. */
export function Footer() {
  return (
    <footer className="border-t hairline py-12">
      <div className="shell flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <p className="font-control-tnt text-subheading text-whiteout">
            {identity.name}
          </p>
          <p className="text-caption text-whiteout/50">{footer.note}</p>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          <ul className="flex flex-wrap gap-4">
            {contact.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-caption text-whiteout/60 transition-colors hover:text-whiteout"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-caption text-whiteout/55">
            © {new Date().getFullYear()} {identity.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
