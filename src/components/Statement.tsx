import { Atmosphere } from './Artwork';
import { statement } from '@/content/site';

/* Compressed Display Headline — Control Compressed 900 at up to 259px,
 * line-height 0.85, uppercase, bleeding to the viewport edges. Used once.
 */
export function Statement() {
  return (
    <section className="relative overflow-hidden py-24">
      <Atmosphere uid="statement" variant="flow" />

      <div className="flex flex-col items-center gap-10 px-4">
        <h2 className="display-headline text-center">
          {statement.lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>

        {statement.note ? (
          <p className="prose-longform text-body max-w-[52ch] text-center text-whiteout/70">
            {statement.note}
          </p>
        ) : null}
      </div>
    </section>
  );
}
