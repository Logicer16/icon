/**
 * @file Determine the user's prefered colour scheme.
 */
import {readable, type Readable} from "svelte/store";
import {browser} from "$app/environment";

export const prefersColorScheme = getPrefersColourSchemeStore();

/**
 * Creates a store representing the browser's `prefers-color-scheme` preference.
 * @returns A svelte store for containing either of "dark" or "light" based on the user's preference.
 */
function getPrefersColourSchemeStore(): Readable<"dark" | "light"> {
  // Skeleton defaults to dark theme.
  if (!browser) return readable("dark");

  const prefersColorSchemeMatch = window.matchMedia(
    "(prefers-color-scheme: dark)"
  );
  return readable(colourSchemeMatches(prefersColorSchemeMatch), (set) => {
    prefersColorSchemeMatch.addEventListener("change", (event) => {
      set(colourSchemeMatches(event));
    });
    set(colourSchemeMatches(prefersColorSchemeMatch));
  });
}

/**
 * Process the `prefers-color-scheme` media query.
 * @param query The query containing matches to test against.
 * @returns Either of "dark" or "light" based on the user's preference.
 */
function colourSchemeMatches(
  query: MediaQueryList | MediaQueryListEvent
): "dark" | "light" {
  return query.matches ? "dark" : "light";
}
