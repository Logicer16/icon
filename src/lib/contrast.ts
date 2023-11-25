import {derived, readable, type Readable} from "svelte/store";
import {browser} from "$app/environment";
import Color from "colorjs.io";
import type {ColorTypes} from "colorjs.io/types/src/color";

function initPrefersColorSchemeStore(): Readable<"dark" | "light"> {
  // Skeleton defaults to dark theme.
  if (!browser) return readable("dark");

  const prefersColorSchemeMatch = window.matchMedia(
    "(prefers-color-scheme: dark)"
  );
  return readable(colourSchemeMatches(prefersColorSchemeMatch), (set) => {
    prefersColorSchemeMatch.addEventListener("change", (event) => {
      set(event.matches ? "dark" : "light");
    });
    set(colourSchemeMatches(prefersColorSchemeMatch));
  });
}

const prefersColorScheme = initPrefersColorSchemeStore();

function colourSchemeMatches(match: MediaQueryList): "dark" | "light" {
  return match.matches ? "dark" : "light";
}

function contrast(colour: Color, comparison: ColorTypes): number {
  return Math.abs(colour.contrastAPCA(comparison));
}

export function contrastCSSColor(
  color: string | Readable<string>
): Readable<string> {
  let processedColor: Readable<Color>;
  if (typeof color === "string") {
    processedColor = readable(new Color(color));
  } else {
    processedColor = derived([color], ([$color]) => {
      return new Color($color);
    });
  }

  return derived(
    [processedColor, prefersColorScheme],
    ([$processedColor, $prefersColorScheme]) => {
      const black = contrast($processedColor, "black");
      const white = contrast($processedColor, "white");

      let blackIsContrasting = black > white;
      if (black === white) {
        blackIsContrasting = $prefersColorScheme === "light";
      }
      return blackIsContrasting ? "black" : "white";
    }
  );
}
