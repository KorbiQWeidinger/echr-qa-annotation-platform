import { Checkbox } from "./ui/checkbox";

export function CheckboxWithLabel({
  label,
  checked,
  onCheckChanged,
}: {
  label: string;
  checked: boolean;
  onCheckChanged: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox checked={checked} onCheckedChange={onCheckChanged} />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
    </div>
  );
}
