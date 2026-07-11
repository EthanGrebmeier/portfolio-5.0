import { atomWithStorage } from "jotai/utils";

import type { DitherSettings } from "./types";

export const DEFAULT_DITHER_SETTINGS: DitherSettings = {
  type: "fsb",
  threshold: 0.5,
  pixelSize: 1,
  diffusion: 1,
  matrixSize: 8,
  colorOne: "#f7f5ef",
  colorTwo: "#000000",
};

export const ditherSettingsAtom = atomWithStorage<DitherSettings>(
  "ditherSettingsV2",
  DEFAULT_DITHER_SETTINGS,
  undefined,
  { getOnInit: true },
);

export const recentColorsAtom = atomWithStorage<string[]>(
  "ditherRecentColorsV2",
  [DEFAULT_DITHER_SETTINGS.colorTwo, DEFAULT_DITHER_SETTINGS.colorOne],
  undefined,
  { getOnInit: true },
);
