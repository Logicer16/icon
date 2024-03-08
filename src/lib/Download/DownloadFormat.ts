/**
 * @file A class for defining a file format.
 */
import type {Vips} from "$lib/vips/vips";

type ImageResult = BlobPart | Promise<BlobPart | undefined> | undefined;

type ImageProcessor = (image: Vips.Image, extension: string) => ImageResult;

export interface DownloadFormatOptions {
  additionalExtensions?: string[];
  displayName?: string;
  extension: string;
  mime?: string;
  imageProcessor?: ImageProcessor;
}

export class DownloadFormat {
  private additionalExtensions?: string[];
  private definedDisplayName?: string;
  public readonly extension: string;
  private imageProcessor: ImageProcessor;
  private rawMime?: string;

  constructor(options: DownloadFormatOptions) {
    this.additionalExtensions = options.additionalExtensions;
    this.definedDisplayName = options.displayName;
    this.extension = options.extension;
    this.imageProcessor =
      options.imageProcessor ?? DownloadFormat.defaultImageProcessor;
    this.rawMime = options.mime;
  }

  private static defaultImageProcessor(
    image: Vips.Image,
    extension: string
  ): BlobPart {
    return image.writeToBuffer(`.${extension}`);
  }

  public processImage(image: Vips.Image): ImageResult {
    return this.imageProcessor(image, this.extension);
  }

  public get displayName(): string {
    return this.definedDisplayName ?? this.extension;
  }

  public get mime(): string {
    return `image/${this.rawMime ?? this.extension}`;
  }

  public get extensions(): string[] {
    if (this.additionalExtensions === undefined) return [this.extension];
    return [this.extension, ...this.additionalExtensions];
  }

  public static getFormatFromExtension(
    formats: DownloadFormat[],
    extension: string
  ): DownloadFormat | undefined {
    return formats.find((value) => {
      return value.extension === extension;
    });
  }

  public static getFormatFromMime(
    formats: DownloadFormat[],
    mime: string
  ): DownloadFormat | undefined {
    return formats.find((value) => {
      return value.mime === mime;
    });
  }
}
