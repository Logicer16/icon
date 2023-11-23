import type Vips from "wasm-vips";

export type SVGData = Vips.Blob & BlobPart;

export interface SVGProcessParameters {
  fillColour?: string;
}

const textDecoder = new TextDecoder("utf-8");

export function processSvg(
  rawSvg: SVGData,
  parameters: SVGProcessParameters
): string;
export function processSvg(
  rawSvg: undefined,
  parameters: SVGProcessParameters
): undefined;
export function processSvg(
  rawSvg: SVGData | undefined,
  parameters: SVGProcessParameters
): string | undefined {
  if (rawSvg === undefined) return;
  return addStyle(rawSvg, parameters);
}

function addStyle(rawSvg: SVGData, parameters: SVGProcessParameters): string {
  const styles: string[] = [];
  if (parameters.fillColour !== undefined) {
    styles.push(`#Fill * {fill:${parameters.fillColour};}`);
  }
  let parsedSvg: string | undefined;
  if (typeof rawSvg !== "string") {
    parsedSvg = textDecoder.decode(rawSvg);
  } else {
    parsedSvg = rawSvg;
  }
  return parsedSvg.replace(
    "</svg>",
    `<style>${styles.join("\n")}</style></svg>`
  );
}
