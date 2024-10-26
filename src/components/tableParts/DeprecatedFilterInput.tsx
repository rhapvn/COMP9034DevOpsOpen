import { Input } from "@/components/ui/input";
import { TableForProps } from "src/types";

const FilterInput = ({ table }: TableForProps) => {
  return (
    <div>
      <div className="text-sm">Filter by common name:</div>
      <Input
        placeholder="Type chemical..."
        value={(table.getColumn("commonName")?.getFilterValue() as string) ?? ""}
        onChange={(event) => table.getColumn("commonName")?.setFilterValue(event.target.value)}
        className="max-w-sm"
      />
    </div>
  );
};

export default FilterInput;
