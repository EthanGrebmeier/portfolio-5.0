import React, { CSSProperties } from "react";
import { cn } from "~/helpers/cn";
import { Color } from "./types";
type DitherColorProps = {
  color: Color;
  onSelect: (color: Color) => void;
  className?: string;
  style: CSSProperties;
  isSelected: boolean;
};

const DitherColorSelector = ({
  onSelect,
  color,
  className,
  style,
  isSelected,
}: DitherColorProps) => {
  return (
    <button
      data-selected={isSelected}
      style={style}
      onClick={() => onSelect(color)}
      className={cn(`size-7 rounded-full border-2 border-black `, className)}
    ></button>
  );
};

export default DitherColorSelector;
