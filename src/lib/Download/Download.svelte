<script lang="ts">
  import {
    getToastStore,
    ListBox,
    ListBoxItem,
    popup,
    type PopupSettings,
    type ToastSettings
  } from "@skeletonlabs/skeleton";
  import FileSaver from "file-saver";
  import {browser} from "$app/environment";
  import {
    DownloadFormat,
    type DownloadFormatOptions
  } from "$lib/Download/DownloadFormat";
  import type {SVGData} from "$lib/svgManipulator/svgManipulator";
  import {vips} from "$lib/vips/vips";
  import {icns} from "./formats/icns";
  import {ico} from "./formats/ico";
  import {qoi} from "./formats/qoi";

  export let svg: SVGData | undefined;

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
    {
      displayName: "jpeg",
      extension: "jpg",
      mime: "jpeg",
      processImage: (image) => {
        return image.jpegsaveBuffer({background: 255});
      }
    },
    {extension: "svg", mime: "svg+xml"},
    {extension: "gif"},
    {
      extension: "webp",
      processImage: (image) => {
        return image.webpsaveBuffer({lossless: true});
      }
    },
    {
      displayName: "jpeg xl",
      extension: "jxl",
      processImage: (image) => {
        return image.jxlsaveBuffer({lossless: true});
      }
    },
    {
      extension: "ico",
      mime: "x-icon",
      processImage: (image) => {
        return ico(image);
      }
    },
    {
      extension: "icns",
      mime: "x-icns",
      processImage: (image) => {
        return icns(image);
      }
    },
    {
      extension: "avif",
      processImage: (image) => {
        if (vips === undefined) return;
        return image.heifsaveBuffer({
          compression: vips.ForeignHeifCompression.av1,
          lossless: true
        });
      }
    },
    // Unsupported due to GPL licencing.
    // {extension: "heif"},
    {extension: "tiff"},
    {
      displayName: "jpeg 2000",
      extension: "jp2",
      processImage: (image) => {
        return image.jp2ksaveBuffer({lossless: true});
      }
    },
    {
      extension: "qoi",
      processImage: (image) => {
        return qoi(image);
      }
    }
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

  const canUseClipboardAPI = browser && "ClipboardItem" in window;

  const toastStore = getToastStore();
  const copySuccessToast: ToastSettings = {
    background: "variant-filled-success",
    message: "Copied!"
  };

  /**
   * Generate a file for an extension.
   * @param extension The file extension corresponding to the generated file. Defaults to the value of the combo box.
   * @returns The file if a file if a file can be generated from the extension, otherwise undefined. Undefined will be returned if vips is unavailable.
   */
  async function getFile(extension?: string): Promise<File | undefined> {
    const format = DownloadFormat.getFormatFromExtension(
      downloadFormats,
      extension ?? comboboxValue
    );
    if (format === undefined || svg === undefined) return;
    let data: BlobPart | undefined;
    if (format.extension === "svg") {
      data = svg;
    } else {
      if (vips === undefined) return;
      const image = vips.Image.svgloadBuffer(svg);
      data = await format.processImage(image);
    }

    if (data === undefined) return;

    const file = new File([data], `icon.${format.extension}`, {
      type: format.mime
    });
    return file;
  }

  /**
   * Copy a png of the image to the clipboard.
   * @returns A promise which resolves when the copy operation has completed.
   */
  async function copy(): Promise<void> {
    // Only png currently has wide support for use with the clipboard api.
    // https://w3c.github.io/clipboard-apis/#writing-to-clipboard
    const file = await getFile("png");
    if (file === undefined) return;
    return navigator.clipboard
      .write([
        new ClipboardItem({
          [file.type]: file
        })
      ])
      .then(() => {
        toastStore.trigger(copySuccessToast);
      });
  }

  /**
   * Download the image.
   */
  async function download(): Promise<void> {
    const file = await getFile();
    if (file === undefined) return;
    FileSaver(file);
  }

  /**
   * Open a save as dialogue for the file.
   */
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

<div class="container flex flex-wrap gap-x-2 gap-y-4">
  {#if canUseClipboardAPI}
    <div class="basis-full">
      <button class="variant-soft btn" type="button" on:click="{copy}"
        >Copy png</button>
    </div>
  {/if}
  <div class="inline space-y-0">
    <button
      class="variant-soft btn w-48 justify-between"
      type="button"
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
        {#each downloadFormats as downloadFormat (downloadFormat.extension)}
          <ListBoxItem
            name="medium"
            value="{downloadFormat.extension}"
            bind:group="{comboboxValue}"
            >{downloadFormat.displayName}</ListBoxItem>
        {/each}
      </ListBox>
    </div>
  </div>
  <button class="variant-soft btn" type="button" on:click="{download}"
    >Download</button>
  {#if canUseFileSystemAPI}
    <button class="variant-soft btn" type="button" on:click="{saveAs}"
      >Save As</button>
  {/if}
</div>
