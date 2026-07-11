import { describe, expect, it } from "vitest";

import type { DitherSettings, PixelBuffer } from "../components/dither/types";
import { ditherImage } from "./dither";

const settings: DitherSettings = {
  type: "fsb",
  threshold: 0.5,
  pixelSize: 1,
  diffusion: 0,
  matrixSize: 8,
  colorOne: "#fefefe",
  colorTwo: "#000000",
};

const image = (
  width: number,
  height: number,
  pixels: number[][],
): PixelBuffer => ({
  width,
  height,
  data: new Uint8ClampedArray(pixels.flat()),
});

const pixelAt = (result: PixelBuffer, x: number, y: number) => {
  const offset = (y * result.width + x) * 4;
  return Array.from(result.data.slice(offset, offset + 4));
};

describe("ditherImage", () => {
  it("uses the blue channel when calculating luminance", () => {
    const result = ditherImage(image(1, 1, [[0, 0, 255, 255]]), {
      ...settings,
      threshold: 0.05,
    });

    expect(pixelAt(result, 0, 0)).toEqual([254, 254, 254, 255]);
  });

  it("processes every pixel, including the final row and column", () => {
    const result = ditherImage(
      image(2, 2, [
        [255, 255, 255, 255],
        [255, 255, 255, 255],
        [255, 255, 255, 255],
        [255, 255, 255, 255],
      ]),
      settings,
    );

    expect(pixelAt(result, 1, 1)).toEqual([254, 254, 254, 255]);
  });

  it("moves the split between the output colors with threshold", () => {
    const source = image(1, 1, [[128, 128, 128, 255]]);

    expect(
      pixelAt(ditherImage(source, { ...settings, threshold: 0.25 }), 0, 0),
    ).toEqual([254, 254, 254, 255]);
    expect(
      pixelAt(ditherImage(source, { ...settings, threshold: 0.75 }), 0, 0),
    ).toEqual([0, 0, 0, 255]);
  });

  it("scales Floyd-Steinberg error diffusion", () => {
    const source = image(2, 1, [
      [100, 100, 100, 255],
      [100, 100, 100, 255],
    ]);

    const withoutDiffusion = ditherImage(source, settings);
    const withDiffusion = ditherImage(source, {
      ...settings,
      diffusion: 1,
    });

    expect(pixelAt(withoutDiffusion, 1, 0)).toEqual([0, 0, 0, 255]);
    expect(pixelAt(withDiffusion, 1, 0)).toEqual([254, 254, 254, 255]);
  });

  it("supports distinct ordered-dither matrix sizes", () => {
    const pixels = Array.from({ length: 64 }, () => [80, 80, 80, 255]);
    const source = image(8, 8, pixels);
    const twoByTwo = ditherImage(source, {
      ...settings,
      type: "ordered",
      matrixSize: 2,
    });
    const eightByEight = ditherImage(source, {
      ...settings,
      type: "ordered",
      matrixSize: 8,
    });

    expect(Array.from(twoByTwo.data)).not.toEqual(
      Array.from(eightByEight.data),
    );
  });

  it("maps output to the selected colors", () => {
    const result = ditherImage(
      image(2, 1, [
        [255, 255, 255, 255],
        [0, 0, 0, 255],
      ]),
      {
        ...settings,
        colorOne: "#123456",
        colorTwo: "#abcdef",
      },
    );

    expect(pixelAt(result, 0, 0)).toEqual([18, 52, 86, 255]);
    expect(pixelAt(result, 1, 0)).toEqual([171, 205, 239, 255]);
  });

  it("expands each sampled pixel into a crisp output block", () => {
    const result = ditherImage(
      image(4, 2, [
        [255, 255, 255, 255],
        [255, 255, 255, 255],
        [0, 0, 0, 255],
        [0, 0, 0, 255],
        [255, 255, 255, 255],
        [255, 255, 255, 255],
        [0, 0, 0, 255],
        [0, 0, 0, 255],
      ]),
      { ...settings, pixelSize: 2 },
    );

    expect(pixelAt(result, 0, 0)).toEqual(pixelAt(result, 1, 1));
    expect(pixelAt(result, 2, 0)).toEqual(pixelAt(result, 3, 1));
    expect(pixelAt(result, 0, 0)).not.toEqual(pixelAt(result, 2, 0));
  });
});
