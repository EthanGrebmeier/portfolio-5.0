import { atom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import { Color } from "./types";

const colorOne = {
  color: "#fefefe",
  id: 1,
};

const colorTwo = {
  color: "#000000",
  id: 2,
};
const initialColors: Color[] = [
  colorOne,
  colorTwo,
  {
    color: "#ff0000",
    id: 3,
  },
  {
    color: "#0000ff",
    id: 4,
  },
  {
    color: "#00ff00",
    id: 5,
  },
] as const;

const paletteSwatchesJsonStorage = createJSONStorage<Color[]>(
  () => localStorage,
);

export const paletteSwatchesAtom = atomWithStorage<Color[]>(
  "paletteColors",
  initialColors,
  paletteSwatchesJsonStorage,
  {
    getOnInit: true,
  },
);

const ditherColorOneJsonStorage = createJSONStorage<Color>(() => localStorage);
const ditherColorTwoJsonStorage = createJSONStorage<Color>(() => localStorage);

export const ditherColorOneAtom = atomWithStorage<Color>(
  "ditherColorOne",
  colorOne,
  ditherColorOneJsonStorage,
);
export const ditherColorTwoAtom = atomWithStorage<Color>(
  "ditherColorTwo",
  colorTwo,
  ditherColorTwoJsonStorage,
);

const savedImageJsonStorage = createJSONStorage<string[]>(() => localStorage);

export const savedImagesAtom = atomWithStorage<string[]>(
  "savedImages",
  [],
  savedImageJsonStorage,
  {
    getOnInit: true,
  },
);
