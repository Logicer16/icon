/**
 * @file Determine the contrast of a colour.
 */
import {derived, readable, type Readable} from "svelte/store";
import Color from "colorjs.io";
import type {ColorTypes} from "colorjs.io/types/src/color";
import {prefersColorScheme} from "./prefersColourScheme";

/**
 * Determine the contrast of two colours.
 * @param colour The first colour to compare.
 * @param comparison The second colour to compare.
 * @returns A value which is greater the more contrasting a colour is.
 */
function contrast(colour: Color, comparison: ColorTypes): number {
  return Math.abs(colour.contrastAPCA(comparison));
}

/**
 * Get the either black or white as css colours depending on which contrasts more.
 * @param color The colour to compare against.
 * @returns Either black or white as css colours depending on which contrasts more.
 */
export function contrastBWColorCSS(
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
