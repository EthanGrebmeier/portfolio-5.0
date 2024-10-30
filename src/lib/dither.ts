import { RGBA } from "~/components/dither/types";

const getRGBA = (imageData: ImageData, x: number, y: number) => {
  const offset = (y * imageData.width + x) * 4;
  const red = imageData.data[offset];
  const green = imageData.data[offset + 1];
  const blue = imageData.data[offset + 2];
  const alpha = imageData.data[offset + 3];
  if (
    (!red && red !== 0) ||
    (!green && green !== 0) ||
    (!blue && blue !== 0) ||
    (!alpha && alpha !== 0)
  ) {
    throw new Error("Invalid pixel");
  }
  return {
    red,
    green,
    blue,
    alpha,
  };
};

const setRGBA = (imageData: ImageData, x: number, y: number, rgba: RGBA) => {
  const offset = (y * imageData.width + x) * 4;
  imageData.data[offset] = rgba.red;
  imageData.data[offset + 1] = rgba.green;
  imageData.data[offset + 2] = rgba.blue;
};

export const getRgbaFromHex = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  const resultRed = result[1];
  const resultGreen = result[2];
  const resultBlue = result[3];
  if (!resultRed || !resultGreen || !resultBlue) {
    return null;
  }
  return result
    ? {
        red: parseInt(resultRed, 16),
        green: parseInt(resultGreen, 16),
        blue: parseInt(resultBlue, 16),
        alpha: 1,
      }
    : null;
};

const getModifiedRgba = (value: number, rgba: RGBA) => {
  return {
    red: value ? rgba.red : 0,
    green: value ? rgba.green : 0,
    blue: value ? rgba.blue : 0,
    alpha: 1,
  };
};

export const ditherImageFSB = (
  ctx: CanvasRenderingContext2D,
  image: ImageData,
  color: {
    rgbaOne: RGBA;
    rgbaTwo: RGBA;
  },
) => {
  for (let y = 0; y < image.height - 1; y++) {
    for (let x = 0; x < image.width - 1; x++) {
      // Get current pixel rgba
      const sampleRGBA = getRGBA(image, x, y);

      const gray = Math.round(
        0.299 * sampleRGBA.red +
          0.587 * sampleRGBA.green +
          0.114 * sampleRGBA.red,
      );

      // Apply threshold
      const newGray = gray < 128 ? 0 : 255;

      // Calculate error
      const error = gray - newGray;

      // Assign new pixel values

      setRGBA(image, x, y, newGray === 255 ? color.rgbaOne : color.rgbaTwo);

      const rightPixel = getRGBA(image, x + 1, y);

      setRGBA(image, x + 1, y, {
        red: rightPixel.red + (error * 7) / 16,
        green: rightPixel.green + (error * 7) / 16,
        blue: rightPixel.blue + (error * 7) / 16,
        alpha: 1,
      });

      const bottomLeftPixel = getRGBA(image, x - 1, y + 1);

      setRGBA(image, x - 1, y + 1, {
        red: bottomLeftPixel.red + (error * 3) / 16,
        green: bottomLeftPixel.green + (error * 3) / 16,
        blue: bottomLeftPixel.blue + (error * 3) / 16,
        alpha: 1,
      });

      const bottomPixel = getRGBA(image, x, y + 1);

      setRGBA(image, x, y + 1, {
        red: bottomPixel.red + (error * 5) / 16,
        green: bottomPixel.green + (error * 5) / 16,
        blue: bottomPixel.blue + (error * 5) / 16,
        alpha: 1,
      });

      const bottomRightPixel = getRGBA(image, x + 1, y + 1);

      setRGBA(image, x + 1, y + 1, {
        red: bottomRightPixel.red + (error * 1) / 16,
        green: bottomRightPixel.green + (error * 1) / 16,
        blue: bottomRightPixel.blue + (error * 1) / 16,
        alpha: 1,
      });
    }
  }
  ctx.putImageData(image, 0, 0);
};

const ditherImageOrdered = (
  ctx: CanvasRenderingContext2D,
  image: ImageData,
  color: {
    rgbaOne: RGBA;
    rgbaTwo: RGBA;
  },
) => {
  const ditherMatrix = [
    [1, 49, 13, 61, 4, 52, 16, 64],
    [33, 17, 45, 29, 36, 20, 48, 32],
    [9, 57, 5, 53, 12, 60, 8, 56],
    [41, 25, 37, 21, 44, 28, 40, 24],
    [3, 51, 15, 63, 2, 50, 14, 62],
    [35, 19, 47, 31, 34, 18, 46, 30],
    [11, 59, 7, 55, 10, 58, 6, 54],
    [43, 27, 39, 23, 42, 26, 38, 22],
  ];

  for (let y = 0; y < image.height - 1; y++) {
    for (let x = 0; x < image.width - 1; x++) {
      // Get current pixel rgba
      const sampleRGBA = getRGBA(image, x, y);
      const gray = Math.round(
        0.299 * sampleRGBA.red +
          0.587 * sampleRGBA.green +
          0.114 * sampleRGBA.red,
      );
      const ditherValue = (gray / 255) * 65;

      const matrixValue = ditherMatrix?.[x % 8]?.[y % 8] ?? 0;
      const newValue =
        typeof matrixValue !== "undefined" && ditherValue > matrixValue
          ? 255
          : 0;

      setRGBA(image, x, y, newValue === 255 ? color.rgbaOne : color.rgbaTwo);
    }
  }
  ctx.putImageData(image, 0, 0);
};

export const ditherTypes = {
  fsb: ditherImageFSB,
  ordered: ditherImageOrdered,
};
