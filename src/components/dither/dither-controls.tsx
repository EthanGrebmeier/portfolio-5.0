import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { RotateCcw } from "lucide-react";

import { Button } from "../ui/button";
import ColorControls from "./color-controls";
import RangeControl from "./range-control";
import type { DitherSettings, DitherType } from "./types";

type DitherControlsProps = {
  idPrefix: string;
  settings: DitherSettings;
  onChange: (settings: DitherSettings) => void;
  onReset: () => void;
};

const DitherControls = ({
  idPrefix,
  settings,
  onChange,
  onReset,
}: DitherControlsProps) => {
  const update = <Key extends keyof DitherSettings>(
    key: Key,
    value: DitherSettings[Key],
  ) => onChange({ ...settings, [key]: value });

  return (
    <div className="grid gap-6">
      <section className="grid gap-4">
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
          Dither
        </h2>
        <div className="grid gap-2">
          <label
            htmlFor={`${idPrefix}-algorithm`}
            className="text-sm font-medium text-slate-800"
          >
            Algorithm
          </label>
          <Select
            onValueChange={(value: DitherType) => update("type", value)}
            value={settings.type}
          >
            <SelectTrigger
              id={`${idPrefix}-algorithm`}
              className="h-10 w-full rounded-xl border-slate-200 bg-white"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fsb">Floyd–Steinberg</SelectItem>
              <SelectItem value="ordered">Ordered Dither</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <RangeControl
          id={`${idPrefix}-threshold`}
          label="Threshold"
          value={settings.threshold}
          displayValue={`${Math.round(settings.threshold * 100)}%`}
          min={0}
          max={1}
          step={0.01}
          onChange={(value) => update("threshold", value)}
        />
        <RangeControl
          id={`${idPrefix}-pixel-size`}
          label="Pixel size"
          value={settings.pixelSize}
          displayValue={`${settings.pixelSize} px`}
          min={1}
          max={12}
          step={1}
          onChange={(value) => update("pixelSize", value)}
        />
      </section>

      <section className="grid gap-4 border-t border-slate-200 pt-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
          Colors
        </h2>
        <ColorControls
          idPrefix={idPrefix}
          colorOne={settings.colorOne}
          colorTwo={settings.colorTwo}
          onChange={(key, value) => update(key, value)}
          onSwap={() =>
            onChange({
              ...settings,
              colorOne: settings.colorTwo,
              colorTwo: settings.colorOne,
            })
          }
        />
      </section>

      <details className="group border-t border-slate-200 pt-5">
        <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-slate-700 marker:hidden">
          Advanced
          <span className="text-lg font-light text-slate-400 transition-transform group-open:rotate-45">
            +
          </span>
        </summary>
        <div className="mt-4">
          {settings.type === "fsb" ? (
            <RangeControl
              id={`${idPrefix}-diffusion`}
              label="Diffusion"
              value={settings.diffusion}
              displayValue={`${Math.round(settings.diffusion * 100)}%`}
              min={0}
              max={1}
              step={0.01}
              onChange={(value) => update("diffusion", value)}
            />
          ) : (
            <fieldset className="grid gap-2">
              <legend className="text-sm font-medium text-slate-800">
                Matrix size
              </legend>
              <div className="grid grid-cols-3 rounded-xl bg-slate-100 p-1">
                {([2, 4, 8] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => update("matrixSize", size)}
                    className={`rounded-lg px-2 py-1.5 text-sm transition ${
                      settings.matrixSize === size
                        ? "bg-white text-blue-700 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                    aria-pressed={settings.matrixSize === size}
                  >
                    {size}×{size}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
        </div>
      </details>

      <Button
        type="button"
        variant="ghost"
        onClick={onReset}
        className="justify-start rounded-xl px-0 text-sm text-slate-500 hover:bg-transparent hover:text-blue-700"
      >
        <RotateCcw />
        Reset adjustments
      </Button>
    </div>
  );
};

export default DitherControls;
