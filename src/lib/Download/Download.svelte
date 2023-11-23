<script lang="ts">
  import {
    DownloadFormat,
    type DownloadFormatOptions
  } from "$lib/DownloadFormat";
  import {IconIcns, IconIco} from "@shockpkg/icon-encoder";
  import {
    ListBox,
    ListBoxItem,
    popup,
    type PopupSettings,
    ProgressRadial
  } from "@skeletonlabs/skeleton";
  import {browser} from "$app/environment";
  import FileSaver from "file-saver";
  import type {SVGData} from "$lib/svgManipulator";
  import {vips} from "$lib/vips/vips";
  import type Vips from "wasm-vips";

  export let svg: SVGData | undefined;

  const value = undefined;

  type WellKnownDirectory =
    | "desktop"
    | "documents"
    | "downloads"
    | "music"
    | "pictures"
    | "videos";

  interface ShowSaveFilePickerOptions {
    excludeAcceptAllOption?: boolean;
    id?: string;
    startIn?: FileSystemHandle | WellKnownDirectory;
    suggestedName?: string;
    types?: {description?: string; accept: Record<string, string[]>}[];
  }

  type ShowSaveFilePickerSignature = (
    options: ShowSaveFilePickerOptions
  ) => Promise<FileSystemFileHandle>;

  const defaultDownloadFormats = "png";

  const downloadFormatsOptions: DownloadFormatOptions[] = [
    {extension: "png"},
    {displayName: "jpeg", extension: "jpg", mime: "jpeg"},
    {extension: "svg", mime: "svg+xml"},
    {extension: "gif"},
    {extension: "webp"},
    {displayName: "jpeg xl", extension: "jxl"},
    {extension: "ico", mime: "x-icon"},
    {extension: "icns", mime: "x-icns"},
    {extension: "avif"},
    // Unsupported due to GPL licencing.
    // {extension: "heif"},
    {extension: "tiff"}
    // {displayName: "jpeg 2000", extension: "jp2"}
  ];

  const downloadFormats = downloadFormatsOptions.map((options) => {
    return new DownloadFormat(options);
  });

  let comboboxValue = defaultDownloadFormats;

  const popupCombobox: PopupSettings = {
    closeQuery: ".listbox-item",
    event: "click",
    placement: "bottom",
    target: "popupCombobox"
  };

  const canUseFileSystemAPI =
    browser &&
    "showSaveFilePicker" in window &&
    ((): boolean => {
      try {
        return window.self === window.top;
      } catch {
        return false;
      }
    })();

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

  async function getFile(): Promise<File | undefined> {
    const format = DownloadFormat.getFormatFromExtension(
      downloadFormats,
      comboboxValue
    );
    if (format === undefined || svg === undefined) return;
    let data: BlobPart | undefined;
    if (format.extension === "svg") {
      data = svg;
    } else {
      if (vips === undefined) return;
      const image = vips.Image.svgloadBuffer(svg);
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
      type: format.mime
    });
    return file;
  }

  async function download(): Promise<void> {
    const file = await getFile();
    if (file === undefined) return;
    FileSaver(file);
  }

  async function saveAs(): Promise<void> {
    if (!canUseFileSystemAPI) return;
    const file = await getFile();
    if (!("showSaveFilePicker" in window) || file === undefined) return;
    const format = DownloadFormat.getFormatFromMime(downloadFormats, file.type);
    if (format === undefined) return;

    const showPicker = window.showSaveFilePicker as ShowSaveFilePickerSignature;
    try {
      // Show the file save dialog.
      const handle = await showPicker({
        suggestedName: file.name,
        types: [
          {
            accept: {
              [format.mime]: format.extensions.map((extension) => {
                return `.${extension}`;
              })
            },
            description: format.displayName
          }
        ]
      });
      // Write the blob to the file.
      const writable = await handle.createWritable();
      await writable.write(file);
      await writable.close();
      return;
    } catch (error) {
      // Fail silently if the user has simply canceled the dialog.
      if (
        !(
          error instanceof Object &&
          "name" in error &&
          error.name === "AbortError"
        )
      ) {
        throw error;
      }
    }
  }
</script>

<div class="container mx-auto space-x-2 space-y-8">
  <ProgressRadial
    {value}
    stroke="{100}"
    meter="stroke-primary-500"
    track="stroke-primary-500/30"
    strokeLinecap="{'round'}">{value}%</ProgressRadial>

  <div class="inline space-y-0">
    <button
      class="variant-soft btn w-48 justify-between"
      use:popup="{popupCombobox}">
      <span
        >{DownloadFormat.getFormatFromExtension(downloadFormats, comboboxValue)
          ?.displayName}</span>
      <span>↓</span>
    </button>
    <div
      class="card max-h-64 w-48 overflow-y-scroll shadow-xl"
      data-popup="popupCombobox">
      <ListBox rounded="rounded-none">
        {#each downloadFormats as downloadFormat}
          <ListBoxItem
            bind:group="{comboboxValue}"
            name="medium"
            value="{downloadFormat.extension}"
            >{downloadFormat.displayName}</ListBoxItem>
        {/each}
      </ListBox>
    </div>
  </div>
  <button type="button" class="variant-soft btn" on:click="{download}"
    >Download</button>
  {#if canUseFileSystemAPI}
    <button type="button" class="variant-soft btn" on:click="{saveAs}"
      >Save As</button>
  {/if}
</div>
