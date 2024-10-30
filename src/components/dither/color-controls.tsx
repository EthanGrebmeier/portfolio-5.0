import React from "react";
import ColorSelector from "./color-select";
import { useAtom } from "jotai";
import { ditherColorOneAtom, ditherColorTwoAtom } from "./atom";
import { ArrowRightLeft, RotateCw } from "lucide-react";

const ColorControls = () => {
  const [ditherColorOne, setDitherColorOne] = useAtom(ditherColorOneAtom);
  const [ditherColorTwo, setDitherColorTwo] = useAtom(ditherColorTwoAtom);

  const handleSwapColors = () => {
    const temp = ditherColorOne;
    setDitherColorOne(ditherColorTwo);
    setDitherColorTwo(temp);
  };

  return (
    <div className="grid w-full">
      <div className="flex flex-col gap-2">
        <label>Colors</label>
        <div className="flex gap-2">
          <ColorSelector color={ditherColorOne} onSelect={setDitherColorOne} />
          <ColorSelector color={ditherColorTwo} onSelect={setDitherColorTwo} />
          <button
            className="flex size-7 items-center justify-center rounded-full border-2 border-black"
            onClick={handleSwapColors}
          >
            <ArrowRightLeft size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorControls;
