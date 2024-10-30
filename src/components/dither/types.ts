import { ditherTypes } from "~/lib/dither";

export type DitherType = keyof typeof ditherTypes;

export type Color = {
  color: string;
  id: number;
};
export type RGBA = {
  red: number;
  green: number;
  blue: number;
  alpha: number;
};
