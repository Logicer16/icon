declare module "qoijs" {
  /**
   * The properties of the image.
   */
  export interface QOIDataDescription {
    /** The number of channels in the image (3: RGB, 4: RGBA) */
    channels: 3 | 4;
    /** The colorspace used in the image (0: sRGB with linear alpha, 1: linear) */
    colorspace: 0 | 1;
    /** The width of the image */
    width: number;
    /** The height of the image */
    height: number;
  }

  export interface DecodedDataDescription extends QOIDataDescription {
    /** The data of the QOI file. */
    data: Uint8Array;
    /** True if an error occurred in the decoding process. */
    error: boolean;
  }

  /**
   * Decode a QOI file given as an ArrayBuffer.
   *
   * @param arrayBuffer ArrayBuffer containing the QOI file.
   * @param byteOffset Offset to the start of the QOI file in arrayBuffer
   * @param byteLength Length of the QOI file in bytes
   * @param outputChannels Number of channels to include in the decoded array
   *
   * @returns The deconstructed data of the QOI file.
   */
  export function decode(
    arrayBuffer: ArrayBuffer,
    byteOffset?: number | null,
    byteLength?: number | null,
    outputChannels?: number | null
  ): DecodedQOIData;

  /**
   * Encode a QOI file.
   *
   * @param colorData The color information for each pixel of the image (left to right, top to bottom)
   * @param description The properties of the image.
   *
   * @returns The QOI file content
   */
  export function encode(
    colorData: Uint8Array | Uint8ClampedArray,
    description: QOIDataDescription
  ): ArrayBuffer;
}
