/*
 * Latin text to kebab-case slug. Strings containing non-ASCII characters
 * (e.g. Thai) pass through unchanged; the app deliberately does not
 * transliterate (spec section 7 non-goal) and the user edits the name by hand.
 */
const NON_ASCII = /[^\u0000-\u007f]/;

export function slugify(input: string): string {
  const trimmed = input.trim();
  if (NON_ASCII.test(trimmed)) return trimmed;
  return (
    trimmed
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'untitled'
  );
}
