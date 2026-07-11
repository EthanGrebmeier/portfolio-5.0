export type DitherType = "fsb" | "ordered";
export type BayerSize = 2 | 4 | 8;

export type RGBA = {
  red: number;
  green: number;
  blue: number;
  alpha: number;
};

export type DitherSettings = {
  type: DitherType;
  threshold: number;
  pixelSize: number;
  diffusion: number;
  matrixSize: BayerSize;
  colorOne: string;
  colorTwo: string;
};

export type PixelBuffer = {
  data: Uint8ClampedArray;
  width: number;
  height: number;
};
