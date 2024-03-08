/**
 * @file Methods for generating an ico file.
 */
import {IconIcns} from "@shockpkg/icon-encoder";
import {type Vips, vips} from "$lib/vips/vips";

interface IcnsType {
  dimension: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  OSTypes: string[];
}

/**
 * Generate an .icns file from an image.
 * @param image The image to convert.
 * @returns Encoded icns file data.
 */
export async function icns(image: Vips.Image): Promise<Uint8Array | undefined> {
  const vipsInstance = vips;
  if (vipsInstance === undefined) return;
  const icns = new IconIcns();
  /* eslint-disable @typescript-eslint/naming-convention */
  const dimensions: IcnsType[] = [
    {OSTypes: ["ic10"], dimension: 1024},
    {OSTypes: ["ic09", "ic14"], dimension: 512},
    {OSTypes: ["ic08", "ic13"], dimension: 256},
    {OSTypes: ["ic07"], dimension: 128},
    {OSTypes: ["ic12"], dimension: 64},
    {OSTypes: ["ic05", "ic11"], dimension: 32},
    {OSTypes: ["ic04"], dimension: 16}
  ];
  /* eslint-enable @typescript-eslint/naming-convention */
  await Promise.all(
    dimensions.map(async (dimension) => {
      const png = image
        .resize(dimension.dimension / image.width, {
          kernel: vipsInstance.Kernel.nearest
        })
        .writeToBuffer(".png");
      return icns.addFromPng(png, dimension.OSTypes, false);
    })
  );
  return icns.encode();
}
