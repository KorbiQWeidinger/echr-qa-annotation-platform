import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export const RankSelection = ({
  label,
  description,
  selected,
  setSelected,
}: {
  label: string;
  description: string;
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  return (
    <>
      <div className="h-4" />
      <h4 className="text-xl font-bold pl-4 pt-4">{label}</h4>
      <p className="text-sm pl-4 pb-2">{description}</p>
      <div className="h-2" />
      <div className="flex flex-row flex-wrap ml-4">
        {Array.from(["A", "B", "C", "D"]).map((letter, i) => {
          return (
            <div className="m-2 flex items-center justify-center">
              <div className="font-lg font-bold pr-4">{letter}:</div>
              <Select
                onValueChange={(e) =>
                  setSelected((prev) => {
                    prev[i] = e;
                    return [...prev];
                  })
                }
                value={`${selected[i] ?? ""}`}
              >
                <SelectTrigger className="w-[80px]">
                  <SelectValue placeholder={""} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{letter}</SelectLabel>
                    {[1, 2, 3, 4].map((option) => (
                      <SelectItem value={`${option}`}>{option}</SelectItem>
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
