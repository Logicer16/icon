/**
 * @file Methods for generating an icns file.
 */
import {IconIco} from "@shockpkg/icon-encoder";
import {type Vips, vips} from "$lib/vips/vips";

/**
 * Generate an .ico file from an image.
 * @param image The image to convert.
 * @returns Encoded ico file data.
 */
export async function ico(image: Vips.Image): Promise<Uint8Array | undefined> {
  const vipsInstance = vips;
  if (vipsInstance === undefined) return;
  const ico = new IconIco();
  const dimensions = [16, 32, 48, 64, 128, 256];
  await Promise.all(
    dimensions.map(async (dimension) => {
      const png = image
        .resize(dimension / image.width, {kernel: vipsInstance.Kernel.nearest})
        .writeToBuffer(".png");
      return ico.addFromPng(png, undefined, false);
    })
  );
  return ico.encode();
}
