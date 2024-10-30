import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { Upload } from "lucide-react";
import ColorControls from "./color-controls";
import { DitherType } from "./types";

type DitherControlsProps = {
  ditherType: DitherType;
  setDitherType: (type: DitherType) => void;
  setImageSrc: (src: string) => void;
};

const DitherControls = ({
  ditherType,
  setDitherType,
  setImageSrc,
}: DitherControlsProps) => {
  return (
    <div className="flex flex-col items-start justify-center gap-2 lg:h-full ">
      <div className="flex flex-col gap-2">
        <label>Type</label>
        <Select
          onValueChange={(value: DitherType) => value && setDitherType(value)}
          value={ditherType}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Floyd-Steinberg" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fsb">Floyd-Steinberg</SelectItem>
            <SelectItem value="ordered">Ordered</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ColorControls />
      <div className=" z-10 flex w-full flex-col gap-2 font-sans text-xl text-black">
        <p className="text-lg font-light"> Image </p>
        <div className="w-full rounded-xl bg-black">
          <div className="w-full -translate-y-1.5 cursor-pointer overflow-hidden rounded-2xl border-2 border-black bg-green-400 px-2 py-1 font-sans text-xl font-medium  text-black transition-all hover:-translate-y-1 active:-translate-y-0.5">
            <label
              htmlFor="image-upload"
              className="flex  cursor-pointer items-center justify-center gap-2"
            >
              <span>Upload </span>
              <Upload size={20} aria-hidden="true" />
            </label>
          </div>
        </div>
        <input
          id="image-upload"
          className="hidden"
          type="file"
          accept="image/png, image/jpeg"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
              const image = new Image();
              image.src = e.target?.result as string;
              image.onload = () => {
                setImageSrc(image.src);
              };
            };
            reader.readAsDataURL(file);
          }}
        />
      </div>
    </div>
  );
};

export default DitherControls;
