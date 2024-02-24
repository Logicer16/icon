/**
 * @file Manipulates the svg icon's css.
 */
import {themeColour} from "../const";
import type {Vips} from "../vips/vips";
// eslint-disable-next-line n/file-extension-in-import
import rawSVG from "./favicon.svg?raw";

export type SVGData = BlobPart & Vips.Blob;

/**
 * Parameters to process the svg against.
 */
export interface SVGProcessParameters {
  /**
   * The icon's fill colour as the value for the css `fill` property.
   * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Content_type#paint
   */
  fillColour?: string;
}

/**
 * Processes the svg according to a set of parameters.
 * @param parameters The parameters to process the svg against.
 * @returns The processed svg.
 */
export function processSvg(parameters: SVGProcessParameters): string {
  const styles: string[] = [];
  styles.push(`#Fill * {fill:${parameters.fillColour ?? themeColour};}`);

  return rawSVG.replace("</svg>", `<style>${styles.join("\n")}</style></svg>`);
}
