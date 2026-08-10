/* Section header — left-aligned, sitting on a hairline that runs the full
 * column width. The eyebrow sits in the rule's left margin so the title starts
 * at the same optical line as the content below it, which is what makes a
 * stack of sections read as one grid rather than five separate blocks.
 */
export function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="flex flex-col gap-6 border-t hairline pt-6">
      {eyebrow ? (
        <p className="text-caption uppercase tracking-[0.16em] text-twilight-soft">
          {eyebrow}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
        <h2 className="font-control-tnt text-heading-lg text-whiteout max-w-[16ch] text-balance">
          {title}
        </h2>
        {subtitle ? (
          <p className="prose-longform text-body self-end text-whiteout/65">
            {subtitle}
          </p>
        ) : null}
      </div>
    </header>
  );
}
