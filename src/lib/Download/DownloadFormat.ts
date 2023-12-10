/**
 * @file A class for defining a file format.
 */

export interface DownloadFormatOptions {
  additionalExtensions?: string[];
  displayName?: string;
  extension: string;
  mime?: string;
}

export class DownloadFormat {
  private additionalExtensions?: string[];
  private definedDisplayName?: string;
  public readonly extension: string;
  private rawMime?: string;

  constructor(options: DownloadFormatOptions) {
    this.additionalExtensions = options.additionalExtensions;
    this.definedDisplayName = options.displayName;
    this.extension = options.extension;
    this.rawMime = options.mime;
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
