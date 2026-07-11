import { useRef, useState } from "react";
import { useAtom } from "jotai";
import { ArrowRightLeft } from "lucide-react";

import { cn } from "~/lib/utils";

import { recentColorsAtom } from "./atom";

type ColorKey = "colorOne" | "colorTwo";

const PRESET_COLORS = [
  { name: "Black", value: "#000000" },
  { name: "Off-white", value: "#f7f5ef" },
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Yellow", value: "#eab308" },
  { name: "Green", value: "#22c55e" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#a855f7" },
  { name: "Pink", value: "#ec4899" },
] as const;

const PRESET_COLOR_VALUES = new Set<string>(
  PRESET_COLORS.map(({ value }) => value),
);

type ColorControlsProps = {
  idPrefix: string;
  colorOne: string;
  colorTwo: string;
  onChange: (key: ColorKey, value: string) => void;
  onSwap: () => void;
};

const ColorControls = ({
  idPrefix,
  colorOne,
  colorTwo,
  onChange,
  onSwap,
}: ColorControlsProps) => {
  const [activeColor, setActiveColor] = useState<ColorKey>("colorOne");
  const [recentColors, setRecentColors] = useAtom(recentColorsAtom);
  const colorInputRefs = useRef<Record<ColorKey, HTMLInputElement | null>>({
    colorOne: null,
    colorTwo: null,
  });
  const customRecentColors = recentColors.filter(
    (color) => !PRESET_COLOR_VALUES.has(color.toLowerCase()),
  );

  const rememberColor = (color: string) => {
    const normalized = color.toLowerCase();
    setRecentColors((current) =>
      [
        normalized,
        ...current.filter((item) => item.toLowerCase() !== normalized),
      ].slice(0, 8),
    );
  };

  const setColor = (key: ColorKey, color: string, remember = false) => {
    onChange(key, color);
    if (remember) rememberColor(color);
  };

  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
        {(
          [
            ["colorOne", "Color 1", colorOne],
            ["colorTwo", "Color 2", colorTwo],
          ] as const
        ).map(([key, label, value], index) => (
          <div
            key={key}
            className={cn(
              "grid gap-1.5",
              index === 1 && "col-start-3 row-start-1",
            )}
          >
            <span className="text-xs font-medium text-slate-500">{label}</span>
            <div
              className={cn(
                "flex h-11 items-center rounded-xl border bg-white transition",
                activeColor === key
                  ? "border-blue-700 ring-2 ring-blue-700/10"
                  : "border-slate-200 hover:border-slate-300",
              )}
            >
              <button
                type="button"
                onClick={() => {
                  colorInputRefs.current[key]?.focus();
                  colorInputRefs.current[key]?.click();
                }}
                className="m-1.5 shrink-0 rounded-lg ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
                aria-label={`Choose a custom ${label.toLowerCase()}`}
              >
                <span
                  className="block size-7 rounded-lg border border-black/10"
                  style={{ backgroundColor: value }}
                />
              </button>
              <button
                type="button"
                onClick={() => setActiveColor(key)}
                className="h-full min-w-0 flex-1 truncate rounded-r-xl pr-2 text-left font-mono text-xs uppercase text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-700"
                aria-label={`Select ${label} for preset colors`}
                aria-pressed={activeColor === key}
              >
                {value}
              </button>
              <input
                ref={(input) => {
                  colorInputRefs.current[key] = input;
                }}
                id={`${idPrefix}-${key}`}
                type="color"
                value={value}
                onChange={(event) => setColor(key, event.target.value)}
                onBlur={(event) => rememberColor(event.target.value)}
                className="sr-only"
                aria-label={`Custom ${label.toLowerCase()}`}
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={onSwap}
          className="col-start-2 row-start-1 flex size-9 items-center justify-center self-end rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-blue-700 hover:text-blue-700"
          aria-label="Swap colors"
        >
          <ArrowRightLeft size={16} />
        </button>
      </div>

      <div className="grid gap-1.5">
        <span className="text-xs font-medium text-slate-500">Palette</span>
        <div className="flex flex-wrap gap-2" aria-label="Preset colors">
          {PRESET_COLORS.map(({ name, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => setColor(activeColor, value)}
              className="size-7 rounded-full border border-black/10 ring-offset-2 transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
              style={{ backgroundColor: value }}
              aria-label={`Use ${name} for the selected color`}
            />
          ))}
        </div>
      </div>

      {customRecentColors.length > 0 && (
        <div className="grid gap-1.5">
          <span className="text-xs font-medium text-slate-500">Recent</span>
          <div
            className="flex flex-wrap gap-2"
            aria-label="Recent custom colors"
          >
            {customRecentColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setColor(activeColor, color, true)}
                className="size-7 rounded-full border border-black/10 ring-offset-2 transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
                style={{ backgroundColor: color }}
                aria-label={`Use recent custom color ${color}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorControls;
