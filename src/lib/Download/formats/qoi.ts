/**
 * @file Methods for generating a qoi file.
 */
import {vips, type Vips} from "$lib/vips/vips";
import {encode as qoiEncode, type QOIDataDescription} from "qoijs";

/**
 * Generate an .qoi file from an image.
 * @param image The image to convert.
 * @returns Encoded ico file data.
 */
export function qoi(image: Vips.Image): ArrayBuffer | undefined {
  if (vips === undefined) return;
  const processedImage = image.colourspace(vips.Interpretation.srgb);

  const metadata: QOIDataDescription = {
    height: image.height,
    width: image.width,
    colorspace: 0,
    channels: image.hasAlpha() ? 4 : 3
  };
  return qoiEncode(processedImage.writeToMemory(), metadata);
}
