import type {
  BayerSize,
  DitherSettings,
  PixelBuffer,
  RGBA,
} from "~/components/dither/types";

const HEX_COLOR = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

const BAYER_MATRICES: Record<BayerSize, number[][]> = {
  2: [
    [0, 2],
    [3, 1],
  ],
  4: [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
  ],
  8: [
    [0, 32, 8, 40, 2, 34, 10, 42],
    [48, 16, 56, 24, 50, 18, 58, 26],
    [12, 44, 4, 36, 14, 46, 6, 38],
    [60, 28, 52, 20, 62, 30, 54, 22],
    [3, 35, 11, 43, 1, 33, 9, 41],
    [51, 19, 59, 27, 49, 17, 57, 25],
    [15, 47, 7, 39, 13, 45, 5, 37],
    [63, 31, 55, 23, 61, 29, 53, 21],
  ],
};

export const getRgbaFromHex = (hex: string): RGBA | null => {
  const result = HEX_COLOR.exec(hex);
  if (!result?.[1] || !result[2] || !result[3]) return null;

  return {
    red: parseInt(result[1], 16),
    green: parseInt(result[2], 16),
    blue: parseInt(result[3], 16),
    alpha: 255,
  };
};

const getLuminance = (data: Uint8ClampedArray, offset: number) =>
  0.299 * (data[offset] ?? 0) +
  0.587 * (data[offset + 1] ?? 0) +
  0.114 * (data[offset + 2] ?? 0);

const setColor = (data: Uint8ClampedArray, pixelIndex: number, color: RGBA) => {
  const offset = pixelIndex * 4;
  data[offset] = color.red;
  data[offset + 1] = color.green;
  data[offset + 2] = color.blue;
  data[offset + 3] = color.alpha;
};

const downsample = (image: PixelBuffer, pixelSize: number): PixelBuffer => {
  if (pixelSize === 1) {
    return {
      data: new Uint8ClampedArray(image.data),
      width: image.width,
      height: image.height,
    };
  }

  const width = Math.ceil(image.width / pixelSize);
  const height = Math.ceil(image.height / pixelSize);
  const data = new Uint8ClampedArray(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let red = 0;
      let green = 0;
      let blue = 0;
      let alpha = 0;
      let count = 0;

      const maxY = Math.min((y + 1) * pixelSize, image.height);
      const maxX = Math.min((x + 1) * pixelSize, image.width);

      for (let sourceY = y * pixelSize; sourceY < maxY; sourceY++) {
        for (let sourceX = x * pixelSize; sourceX < maxX; sourceX++) {
          const offset = (sourceY * image.width + sourceX) * 4;
          red += image.data[offset] ?? 0;
          green += image.data[offset + 1] ?? 0;
          blue += image.data[offset + 2] ?? 0;
          alpha += image.data[offset + 3] ?? 255;
          count++;
        }
      }

      const offset = (y * width + x) * 4;
      data[offset] = red / count;
      data[offset + 1] = green / count;
      data[offset + 2] = blue / count;
      data[offset + 3] = alpha / count;
    }
  }

  return { data, width, height };
};

const upscale = (
  image: PixelBuffer,
  width: number,
  height: number,
  pixelSize: number,
): PixelBuffer => {
  if (pixelSize === 1) return image;

  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const sourceX = Math.min(Math.floor(x / pixelSize), image.width - 1);
      const sourceY = Math.min(Math.floor(y / pixelSize), image.height - 1);
      const sourceOffset = (sourceY * image.width + sourceX) * 4;
      const targetOffset = (y * width + x) * 4;

      data[targetOffset] = image.data[sourceOffset] ?? 0;
      data[targetOffset + 1] = image.data[sourceOffset + 1] ?? 0;
      data[targetOffset + 2] = image.data[sourceOffset + 2] ?? 0;
      data[targetOffset + 3] = image.data[sourceOffset + 3] ?? 255;
    }
  }

  return { data, width, height };
};

const ditherFloydSteinberg = (
  image: PixelBuffer,
  settings: DitherSettings,
  light: RGBA,
  dark: RGBA,
): PixelBuffer => {
  const luminance = new Float32Array(image.width * image.height);
  const output = new Uint8ClampedArray(image.data.length);
  const threshold = settings.threshold * 255;

  for (let index = 0; index < luminance.length; index++) {
    luminance[index] = getLuminance(image.data, index * 4);
  }

  const addError = (x: number, y: number, error: number, weight: number) => {
    if (x < 0 || x >= image.width || y < 0 || y >= image.height) return;
    const index = y * image.width + x;
    luminance[index] = (luminance[index] ?? 0) + error * weight;
  };

  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      const index = y * image.width + x;
      const current = luminance[index] ?? 0;
      const value = current < threshold ? 0 : 255;
      const error = (current - value) * settings.diffusion;

      setColor(output, index, value === 255 ? light : dark);
      addError(x + 1, y, error, 7 / 16);
      addError(x - 1, y + 1, error, 3 / 16);
      addError(x, y + 1, error, 5 / 16);
      addError(x + 1, y + 1, error, 1 / 16);
    }
  }

  return { data: output, width: image.width, height: image.height };
};

const ditherOrdered = (
  image: PixelBuffer,
  settings: DitherSettings,
  light: RGBA,
  dark: RGBA,
): PixelBuffer => {
  const output = new Uint8ClampedArray(image.data.length);
  const matrix = BAYER_MATRICES[settings.matrixSize];
  const divisor = settings.matrixSize * settings.matrixSize;
  const thresholdOffset = settings.threshold - 0.5;

  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      const index = y * image.width + x;
      const luminance = getLuminance(image.data, index * 4) / 255;
      const matrixValue =
        ((matrix[y % settings.matrixSize]?.[x % settings.matrixSize] ?? 0) +
          0.5) /
        divisor;
      setColor(
        output,
        index,
        luminance - thresholdOffset > matrixValue ? light : dark,
      );
    }
  }

  return { data: output, width: image.width, height: image.height };
};

export const ditherImage = (
  image: PixelBuffer,
  settings: DitherSettings,
): PixelBuffer => {
  const light = getRgbaFromHex(settings.colorOne);
  const dark = getRgbaFromHex(settings.colorTwo);
  if (!light || !dark) throw new Error("Invalid dither color");

  const pixelSize = Math.max(1, Math.round(settings.pixelSize));
  const sampled = downsample(image, pixelSize);
  const dithered =
    settings.type === "fsb"
      ? ditherFloydSteinberg(sampled, settings, light, dark)
      : ditherOrdered(sampled, settings, light, dark);

  return upscale(dithered, image.width, image.height, pixelSize);
};
