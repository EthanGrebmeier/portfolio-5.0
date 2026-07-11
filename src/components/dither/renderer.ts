import type { DitherSettings, PixelBuffer } from "./types";
import type {
  DitherWorkerRequest,
  DitherWorkerResponse,
} from "../../workers/dither.worker";

const PREVIEW_MAX_DIMENSION = 1400;

const getRenderDimensions = (
  image: ImageBitmap,
  maxDimension?: number,
): { width: number; height: number } => {
  if (!maxDimension || Math.max(image.width, image.height) <= maxDimension) {
    return { width: image.width, height: image.height };
  }

  const scale = maxDimension / Math.max(image.width, image.height);
  return {
    width: Math.max(1, Math.round(image.width * scale)),
    height: Math.max(1, Math.round(image.height * scale)),
  };
};

const getPixels = (image: ImageBitmap, maxDimension?: number): PixelBuffer => {
  const { width, height } = getRenderDimensions(image, maxDimension);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Canvas is unavailable");

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(image, 0, 0, width, height);
  const imageData = context.getImageData(0, 0, width, height);

  return { data: imageData.data, width, height };
};

const runWorker = (
  image: PixelBuffer,
  settings: DitherSettings,
  signal?: AbortSignal,
): Promise<PixelBuffer> =>
  new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL("../../workers/dither.worker.ts", import.meta.url),
    );
    const request: DitherWorkerRequest = { id: 1, image, settings };

    const stop = () => {
      worker.terminate();
      reject(new DOMException("Rendering cancelled", "AbortError"));
    };

    if (signal?.aborted) {
      stop();
      return;
    }

    signal?.addEventListener("abort", stop, { once: true });
    worker.onerror = () => {
      signal?.removeEventListener("abort", stop);
      worker.terminate();
      reject(new Error("The image worker stopped unexpectedly"));
    };
    worker.onmessage = (event: MessageEvent<DitherWorkerResponse>) => {
      signal?.removeEventListener("abort", stop);
      worker.terminate();

      if ("error" in event.data) {
        reject(new Error(event.data.error));
        return;
      }

      resolve(event.data.result);
    };

    worker.postMessage(request, [image.data.buffer]);
  });

const pixelsToBlob = (image: PixelBuffer): Promise<Blob> => {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext("2d");
  if (!context) return Promise.reject(new Error("Canvas is unavailable"));

  const imageData = new ImageData(
    new Uint8ClampedArray(image.data),
    image.width,
    image.height,
  );
  context.putImageData(imageData, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("PNG encoding failed"));
    }, "image/png");
  });
};

export const renderPreview = async (
  image: ImageBitmap,
  settings: DitherSettings,
  signal: AbortSignal,
): Promise<Blob> => {
  const pixels = getPixels(image, PREVIEW_MAX_DIMENSION);
  return pixelsToBlob(await runWorker(pixels, settings, signal));
};

export const renderFullResolution = async (
  image: ImageBitmap,
  settings: DitherSettings,
): Promise<Blob> => {
  const pixels = getPixels(image);
  return pixelsToBlob(await runWorker(pixels, settings));
};
