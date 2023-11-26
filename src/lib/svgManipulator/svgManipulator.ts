import rawSVG from "./favicon.svg?raw";
import {themeColour} from "../const";
import type Vips from "wasm-vips";

export type SVGData = Vips.Blob & BlobPart;

export interface SVGProcessParameters {
  fillColour?: string;
}

export function processSvg(parameters: SVGProcessParameters): string {
  const styles: string[] = [];
  styles.push(`#Fill * {fill:${parameters.fillColour ?? themeColour};}`);

  return rawSVG.replace("</svg>", `<style>${styles.join("\n")}</style></svg>`);
}
