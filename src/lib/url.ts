/**
 * Returns a URL path prefixed with the site's base URL.
 * Works correctly both locally (base = "/") and on GitHub Pages (base = "/FreeSpaceFactory/").
 *
 * Usage:  href={u('/lo-studio/')}  →  "/FreeSpaceFactory/lo-studio/"
 */
const _base = import.meta.env.BASE_URL.replace(/\/?$/, '/');

export function u(path: string): string {
  // Strip leading slash from path so we don't double up
  return `${_base}${path.replace(/^\//, '')}`;
}

export const base = _base;
