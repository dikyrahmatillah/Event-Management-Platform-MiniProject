import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/atomic/select";
import { FilterIcon } from "lucide-react";

interface AttendeeFilterProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  STATUS: Record<string, string>;
}

export function AttendeeFilter({
  statusFilter,
  setStatusFilter,
  STATUS,
}: AttendeeFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <FilterIcon className="h-4 w-4" />
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-36 sm:w-40 cursor-pointer">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(STATUS).map((status) => (
            <SelectItem
              key={status as string}
              value={status as string}
              className="cursor-pointer"
            >
              {status === "ALL"
                ? "All Status"
                : (status as string).charAt(0) +
                  (status as string).slice(1).toLowerCase().replace("_", " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
