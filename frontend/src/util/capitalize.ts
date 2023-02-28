/**
 * Capitalizes the first letter of the provided string.
 *
 * `capitalize` will return a copy of the provided string with the first letter
 * capitalized, the original string is not modified.
 * @param string The string to capitalize.
 * @returns The provided string with the first letter capitalized.
 * @example
 * ```ts
 * capitalize('james'); // 'James'
 * ```
 */
export function capitalize(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
