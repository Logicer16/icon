/**
 * @file Determine the contrast of a colour.
 */
import {derived, readable, type Readable} from "svelte/store";
import Color from "colorjs.io";
import type {ColorTypes} from "colorjs.io/types/src/color";
import {prefersColorScheme} from "./prefersColourScheme.js";

/**
 * Determine the contrast of two colours.
 * @param colour The first colour to compare.
 * @param comparison The second colour to compare.
 * @returns A value which is greater the more contrasting a colour is.
 */
function contrast(colour: ColorTypes, comparison: ColorTypes): number {
  return Math.abs(Color.contrastAPCA(colour, comparison));
}

/**
 * Get the either black or white as css colours depending on which contrasts more.
 * @param colour The colour to compare against.
 * @returns Either black or white as css colours depending on which contrasts more.
 */
export function contrastBWColorCSS(
  colour: Readable<string> | string
): Readable<string> {
  const colourStore =
    typeof colour === "string" ? readable(new Color(colour)) : colour;

  return derived(
    [colourStore, prefersColorScheme],
    ([$colourStore, $prefersColorScheme]) => {
      const black = contrast($colourStore, "black");
      const white = contrast($colourStore, "white");

      let blackIsContrasting = black > white;
      if (black === white) {
        blackIsContrasting = $prefersColorScheme === "light";
      }
      return blackIsContrasting ? "black" : "white";
    }
  );
}
