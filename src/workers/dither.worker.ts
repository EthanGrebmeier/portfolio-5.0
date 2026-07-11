/// <reference lib="webworker" />

import type { DitherSettings, PixelBuffer } from "../components/dither/types";
import { ditherImage } from "../lib/dither";

export type DitherWorkerRequest = {
  id: number;
  image: PixelBuffer;
  settings: DitherSettings;
};

export type DitherWorkerResponse =
  | {
      id: number;
      result: PixelBuffer;
    }
  | {
      id: number;
      error: string;
    };

self.onmessage = (event: MessageEvent<DitherWorkerRequest>) => {
  const { id, image, settings } = event.data;

  try {
    const result = ditherImage(image, settings);
    const response: DitherWorkerResponse = { id, result };
    self.postMessage(response, { transfer: [result.data.buffer] });
  } catch (error) {
    const response: DitherWorkerResponse = {
      id,
      error: error instanceof Error ? error.message : "Dithering failed",
    };
    self.postMessage(response);
  }
};
