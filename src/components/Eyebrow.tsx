import { cn } from '@/lib/utils';

/* ============================================================================
 * EYEBROW — the bracketed micro-label.
 *
 * ( SELECTED WORK ) · ( READY ) · ( ABOUT )
 *
 * Trivial on its own; centralising it is the whole point. A typographic
 * signature only reads as deliberate when it is identical everywhere, and the
 * fastest way to lose that is to hand-write the brackets and tracking in nine
 * different components.
 *
 * The brackets are drawn with CSS pseudo-elements rather than put in the
 * markup, so a screen reader announces "selected work" instead of
 * "left paren selected work right paren" before every section.
 * ==========================================================================*/

export function Eyebrow({
  children,
  bracketed = true,
  as: Tag = 'p',
  className,
}: {
  children: React.ReactNode;
  /** Set false for labels inside a rail, where brackets would be noise. */
  bracketed?: boolean;
  as?: 'p' | 'span' | 'h2';
  className?: string;
}) {
  return (
    <Tag className={cn('eyebrow', bracketed && 'eyebrow-bracketed', className)}>
      {children}
    </Tag>
  );
}
