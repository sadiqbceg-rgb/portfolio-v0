import { Fragment } from 'react';

/* ============================================================================
 * RICH TEXT — inline emphasis for body copy held in src/content/site.ts.
 *
 * Supports exactly one rule: `**text**` becomes <strong>. Not Markdown, and
 * deliberately not. Body paragraphs need emphasis and nothing else, and the
 * two obvious alternatives are both worse — a Markdown dependency for one
 * inline rule, or dangerouslySetInnerHTML, which turns a content file into an
 * HTML-injection surface.
 *
 * Text is never passed through a parser that can emit markup: the string is
 * split on the delimiter and the pieces are rendered as React children, so
 * anything that is not a delimiter stays literal text.
 * ==========================================================================*/

/** Splits on `**…**`, keeping the delimiters so alternate parts are the bold ones. */
const EMPHASIS = /\*\*(.+?)\*\*/g;

export function RichText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(EMPHASIS)) {
    const start = match.index;
    if (start > cursor) parts.push(text.slice(cursor, start));
    parts.push(<strong key={start}>{match[1]}</strong>);
    cursor = start + match[0].length;
  }

  if (cursor < text.length) parts.push(text.slice(cursor));

  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>{part}</Fragment>
      ))}
    </>
  );
}
