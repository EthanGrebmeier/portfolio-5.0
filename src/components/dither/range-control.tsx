type RangeControlProps = {
  id: string;
  label: string;
  value: number;
  displayValue: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
};

const RangeControl = ({
  id,
  label,
  value,
  displayValue,
  min,
  max,
  step,
  onChange,
}: RangeControlProps) => (
  <div className="grid gap-2">
    <div className="flex items-center justify-between gap-4 text-sm">
      <label htmlFor={id} className="font-medium text-slate-800">
        {label}
      </label>
      <output htmlFor={id} className="tabular-nums text-slate-500">
        {displayValue}
      </output>
    </div>
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
      className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-700"
    />
  </div>
);

export default RangeControl;
