import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const PLACEHOLDERS = ["Best", "2nd", "3rd", "Worst"];

export const DropdownSelection = ({
  label,
  description,
  options,
  selectedOptions,
  setOptions,
}: {
  label: string;
  description: string;
  options: string[];
  selectedOptions: (string | undefined)[];
  setOptions: React.Dispatch<React.SetStateAction<(string | undefined)[]>>;
}) => {
  return (
    <>
      <div className="h-4" />
      <h4 className="text-xl font-bold pl-4 pt-4">{label}</h4>
      <p className="text-sm pl-4 pb-2">{description}</p>
      <div className="h-2" />
      <div className="flex flex-row flex-wrap ml-4">
        {Array.from({ length: 4 }).map((_, i) => {
          const localSelectionOptions = options.filter(
            (x) => x === selectedOptions[i] || !selectedOptions.includes(x)
          );
          localSelectionOptions.push("undefined");
          return (
            <div className="m-2">
              <Select
                onValueChange={(e) =>
                  setOptions((prev) => {
                    prev[i] = e;
                    return [...prev];
                  })
                }
                value={selectedOptions[i]}
              >
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder={PLACEHOLDERS[i]} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{PLACEHOLDERS[i]}</SelectLabel>
                    {localSelectionOptions.map((option) => (
                      <SelectItem value={option}>{option}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          );
        })}
      </div>
    </>
  );
};
