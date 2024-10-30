import React from "react";
import ColorPalette from "./color-palette";
import { Color } from "./types";
import { useOutsideAlerter } from "~/hooks/useOutsideAlert";
import { AnimatePresence } from "framer-motion";

type ColorSelectorProps = {
  color: Color;
  onSelect: (color: Color) => void;
};

const ColorSelector = ({ color, onSelect }: ColorSelectorProps) => {
  const [showPalette, setShowPalette] = React.useState(false);

  const ref = React.useRef<HTMLDivElement>(null);
  useOutsideAlerter(ref, () => {
    setShowPalette(false);
  });

  return (
    <div className="relative" ref={ref}>
      <div className="absolute -left-2 top-4 z-20 -translate-y-full">
        <AnimatePresence>
          {showPalette && (
            <ColorPalette
              setDitherColor={(color, shouldClose = false) => {
                onSelect(color);
                shouldClose && setShowPalette(false);
              }}
              ditherColor={color}
            />
          )}
        </AnimatePresence>
      </div>
      <button
        className="size-7 rounded-full border-2 border-black"
        onClick={() => setShowPalette(!showPalette)}
        style={{
          backgroundColor: color.color,
        }}
      />
    </div>
  );
};

export default ColorSelector;
