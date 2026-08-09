/* Feature Section Header — Control 500 at 20px for the eyebrow, display cut at
 * 32–56px for the title, centre-aligned on the dark canvas with generous gaps.
 */
export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'center',
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
}) {
  const alignment =
    align === 'center' ? 'items-center text-center' : 'items-start text-left';

  return (
    <div className={`flex flex-col gap-2 ${alignment}`}>
      {eyebrow ? (
        <p className="text-subheading text-twilight-soft">{eyebrow}</p>
      ) : null}
      <h2 className="font-control-tnt text-heading-lg text-whiteout max-w-[20ch]">
        {title}
      </h2>
      {subtitle ? (
        <p className="prose-longform text-body mt-2 max-w-[60ch] text-whiteout/70">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
