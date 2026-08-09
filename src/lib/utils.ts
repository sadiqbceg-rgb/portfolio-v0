import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes, resolving conflicts so a later class wins.
 *
 * Required by shadcn-style components — including several Animate UI ones. The
 * shadcn CLI expects to find this at the `utils` alias declared in
 * components.json.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
