declare module "upng-js" {
  /** Encode RGBA frames into a PNG ArrayBuffer. */
  function encode(
    imgs: ArrayBuffer[],
    w: number,
    h: number,
    /** 0 = lossless, >0 = lossy quantization to N colors */
    cnum: number,
    dels?: number[],
    opts?: { alphaClean?: boolean },
  ): ArrayBuffer;
}
