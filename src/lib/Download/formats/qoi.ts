/**
 * @file Methods for generating a qoi file.
 */
import {encode as qoiEncode, type QOIDataDescription} from "qoijs";
import {type Vips, vips} from "$lib/vips/vips";

/**
 * Generate an .qoi file from an image.
 * @param image The image to convert.
 * @returns Encoded ico file data.
 */
export function qoi(image: Vips.Image): ArrayBuffer | undefined {
  if (vips === undefined) return;
  const processedImage = image.colourspace(vips.Interpretation.srgb);

  const metadata: QOIDataDescription = {
    channels: image.hasAlpha() ? 4 : 3,
    colorspace: 0,
    height: image.height,
    width: image.width
  };
  return qoiEncode(processedImage.writeToMemory(), metadata);
}
