import React, { useLayoutEffect } from "react";
import { Color } from "./types";
import DitherColorSelector from "./dither-color";
import { cn } from "~/helpers/cn";
import { Brush, Plus, Trash2, XCircle } from "lucide-react";
import { useAtom } from "jotai";
import { paletteSwatchesAtom } from "./atom";
import { getRgbaFromHex } from "~/lib/dither";
import { AnimatePresence, motion } from "framer-motion";
import useMeasure from "react-use-measure";

type ColorPaletteProps = {
  ditherColor: Color;
  setDitherColor: (color: Color, shouldClose?: boolean) => void;
};

const ColorPalette = ({ ditherColor, setDitherColor }: ColorPaletteProps) => {
  const [colorInput, setColorInput] = React.useState<string>("");
  const [panelName, setPanelName] = React.useState<"palette" | "input">(
    "palette",
  );
  const [paletteSwatches, setPaletteSwatches] = useAtom(paletteSwatchesAtom);
  const [elementRef, bounds] = useMeasure();

  const colorInputRef = React.useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (!colorInputRef.current) return;
    colorInputRef.current.focus();
  }, [panelName]);

  const isInputValid = React.useMemo(() => {
    return getRgbaFromHex(colorInput);
  }, [colorInput]);

  const missingColors = React.useMemo(() => {
    const difference = 12 - paletteSwatches.length;
    return difference > 0 ? difference : 0;
  }, [paletteSwatches]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="flex h-auto w-[200px] flex-col gap-2 overflow-hidden rounded-xl border-2 border-black bg-background px-2 "
    >
      <motion.div
        animate={{
          height: bounds.height,
          width: bounds.width,
        }}
        transition={{ duration: 0.15 }}
      >
        <div ref={elementRef}>
          {panelName === "palette" ? (
            <div className="">
              <div className="">
                <h2 className="text-base font-bold">Palette</h2>
              </div>
              <div className="z-20 flex justify-between gap-2">
                <div className="group grid w-full grid-cols-6 gap-1 py-1">
                  {Object.values(paletteSwatches).map((color) => (
                    <DitherColorSelector
                      key={color.id}
                      color={color}
                      style={{ backgroundColor: color.color }}
                      isSelected={ditherColor.id === color.id}
                      className={cn(
                        " group-hover:bg-blend-darken group-hover:hover:border-[4px] group-hover:hover:bg-blend-normal data-[selected=true]:border-[4px] ",
                      )}
                      onSelect={(color) => setDitherColor(color)}
                    />
                  ))}
                  {Array(missingColors)
                    .fill(0)
                    .map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setPanelName("input")}
                        className="size-7 rounded-full border-2 border-black bg-sky-100 transition-colors hover:border-4 hover:bg-sky-300"
                      ></button>
                    ))}
                </div>
                <div className="flex flex-col gap-1  border-black py-1 pl-2">
                  <button
                    onClick={() => setPanelName("input")}
                    className="group flex size-7 items-center justify-center rounded-full border-2 border-black bg-green-400 transition-colors disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    <Plus size={17} aria-hidden="true" fill="green" />
                  </button>
                  <button
                    className="group flex size-7 items-center justify-center rounded-full border-2 border-black bg-red-400 transition-colors disabled:cursor-not-allowed disabled:bg-gray-400"
                    disabled={ditherColor.id === 1}
                    onClick={() => {
                      if (ditherColor.id === 1) return;
                      const ditherColorIndex = paletteSwatches.findIndex(
                        (color) => color.id === ditherColor.id,
                      );
                      setDitherColor(
                        paletteSwatches[ditherColorIndex - 1] ??
                          paletteSwatches[0] ?? {
                            color: "#fefefe",
                            id: 1,
                          },
                      );
                      const newColors = [...paletteSwatches];
                      newColors.splice(ditherColorIndex, 1);
                      setPaletteSwatches(newColors);
                    }}
                  >
                    <Trash2 size={17} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative w-full px-2 py-2">
              <h2 className="mb-2 text-xl font-bold">Add Color </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const isValid = getRgbaFromHex(colorInput);
                  if (!isValid) return;
                  const formattedColor = {
                    id: Date.now(),
                    color:
                      colorInput[0] === "#" ? colorInput : "#" + colorInput,
                  };
                  setPaletteSwatches([...paletteSwatches, formattedColor]);
                  setDitherColor(formattedColor, false);
                  setPanelName("palette");
                  setColorInput("");
                }}
                className="flex w-full flex-col gap-1"
              >
                <label>Hex Color</label>

                <div className="flex w-full gap-1">
                  <input
                    className="h-10 min-w-0 flex-shrink rounded-xl border-2 border-black px-2 py-1"
                    placeholder="#000000"
                    value={colorInput}
                    ref={colorInputRef}
                    onChange={(e) => setColorInput(e.target.value)}
                  />
                  <div className="relative h-10 w-16 overflow-hidden rounded-xl border-2 border-black bg-none">
                    <div className="h-full w-full overflow-hidden rounded-lg">
                      <input
                        className="-left-1/2 -top-1/2 h-[250%] w-[275%] -translate-x-1/4 -translate-y-1/4 cursor-pointer rounded-full border-none p-0 outline-none"
                        type="color"
                        value={colorInput}
                        onChange={(e) => setColorInput(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4  grid grid-cols-2 gap-2 text-sm">
                  <button
                    type="button"
                    className="rounded-xl border-2 border-black bg-yellow-200 px-3 py-1 font-bold"
                    onClick={() => setPanelName("palette")}
                  >
                    Back
                  </button>
                  <button
                    className=" rounded-xl border-2 border-black bg-green-500 px-2 py-1 font-bold transition-all disabled:opacity-40"
                    disabled={!isInputValid}
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ColorPalette;
