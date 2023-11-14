<script lang="ts">
  import {IconIcns, IconIco} from "@shockpkg/icon-encoder";
  import FileSaver from "file-saver";
  import {ProgressRadial} from "@skeletonlabs/skeleton";
  import {vips} from "$lib/vips/vips";
  import type Vips from "wasm-vips";

  const value = undefined;

  interface DownloadFormat {
    displayName?: string;
    extension: string;
    mime?: string;
  }

  const downloadFormats: DownloadFormat[] = [
    {extension: "png"},
    {displayName: "jpeg", extension: "jpg", mime: "jpeg"},
    {extension: "ico", mime: "x-icon"},
    {extension: "icns", mime: "x-icns"},
    {displayName: "jpeg xl", extension: "jxl"},
    {extension: "svg", mime: "svg+xml"},
    {extension: "gif"},
    {extension: "avif"},
    // Unsupported due to GPL licencing.
    // {extension: "heif"},
    {extension: "tiff"},
    {extension: "webp"}
    // {displayName: "jpeg 2000", extension: "jp2"}
  ];

  type EventHandlerEvent<
    E extends Event = Event,
    T extends EventTarget = Element
  > = E & {currentTarget: EventTarget & T};

  function getFormat(ext: string | undefined): DownloadFormat | undefined {
    return downloadFormats.find((value) => {
      return value.extension === ext;
    });
  }

  async function ico(image: Vips.Image): Promise<Uint8Array> {
    const ico = new IconIco();
    const dimensions = [16, 32, 48, 64, 128, 256];
    await Promise.all(
      dimensions.map(async (dimension) => {
        if (vips === undefined)
          throw new Error(
            "You have somehow called a function requiring a vips image without a vips instance. Well done."
          );
        const png = image
          .resize(dimension / image.width, {kernel: vips.Kernel.nearest})
          .writeToBuffer(".png");
        return ico.addFromPng(png, null, false);
      })
    );
    return ico.encode();
  }

  interface IcnsType {
    dimension: number;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    OSTypes: string[];
  }

  async function icns(image: Vips.Image): Promise<Uint8Array> {
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
    dimensions;
    await Promise.all(
      dimensions.map(async (dimension) => {
        if (vips === undefined)
          throw new Error(
            "You have somehow called a function requiring a vips image without a vips instance. Well done."
          );
        const png = image
          .resize(dimension.dimension / image.width, {
            kernel: vips.Kernel.nearest
          })
          .writeToBuffer(".png");
        return icns.addFromPng(png, dimension.OSTypes, false);
      })
    );
    return icns.encode();
  }

  async function download(
    event: EventHandlerEvent<MouseEvent, HTMLButtonElement>
  ): Promise<void> {
    if (vips === undefined) return;

    const svg = await (await fetch("/favicon/favicon.svg")).arrayBuffer();
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) return;
    const format = getFormat(target.dataset.downloadFormat);
    if (format === undefined) return;
    let data: BlobPart | undefined;
    const image = vips.Image.svgloadBuffer(svg);
    if (format.extension === "svg") {
      data = svg;
    } else {
      switch (format.extension) {
        case "ico":
          data = await ico(image);
          break;
        case "icns":
          data = await icns(image);
          break;
        case "webp":
          data = image.webpsaveBuffer({lossless: true});
          break;
        case "jpg":
          data = image.jpegsaveBuffer({background: 255});
          break;
        case "jp2":
          data = image.jp2ksaveBuffer({lossless: true});
          break;
        case "jxl":
          data = image.jxlsaveBuffer({lossless: true});
          break;
        case "avif":
          data = image.heifsaveBuffer({
            compression: vips.ForeignHeifCompression.av1,
            lossless: true
          });
          break;

        default:
          data = image.writeToBuffer(`.${format.extension}`);
          break;
      }
    }
    let file: File = new File([data], `icon.${format.extension}`, {
      type: `image/${format.mime ?? format.extension}`
    });
    FileSaver(file);
  }
</script>

<div class="container mx-auto p-8 space-y-8">
  <h1 class="h1">Image Conversion Test</h1>
  <ProgressRadial
    {value}
    stroke="{100}"
    meter="stroke-primary-500"
    track="stroke-primary-500/30"
    strokeLinecap="{'round'}">{value}%</ProgressRadial>

  {#each downloadFormats as downloadFormat}
    <button
      type="button"
      class="btn variant-soft mx-1"
      on:click="{download}"
      data-download-format="{downloadFormat.extension}"
      >{downloadFormat.displayName ?? downloadFormat.extension}</button>
  {/each}
</div>
