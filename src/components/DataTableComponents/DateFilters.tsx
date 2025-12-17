 
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  filterByLast7Days,
  filterByThisMonth,
  filterByThisYear,
  filterByToday,
  filterByYesterday,
} from "@/lib/dateFilters";

interface DateFiltersProps {
  data: any[];
  onFilter: (data: any[]) => void;
  setIsSearch: (isSearch: boolean) => void;
}

export default function DateFilters({
  data,
  onFilter,
  setIsSearch,
}: DateFiltersProps) {
  const [selectedFilter, setSelectedFilter] = React.useState("life");

  const handleChange = (value: string) => {
    setSelectedFilter(value);
    setIsSearch(false);

    let filteredData: any[];
    switch (value) {
      case "today":
        filteredData = filterByToday(data);
        break;
      case "yesterday":
        filteredData = filterByYesterday(data);
        break;
      case "last-7-days":
        filteredData = filterByLast7Days(data);
        break;
      case "month":
        filteredData = filterByThisMonth(data);
        break;
      case "year":
        filteredData = filterByThisYear(data);
        break;
      case "life":
      default:
        filteredData = data;
    }

    onFilter(filteredData);
  };

  return (
    <div className="w-[150px]">
      <Select value={selectedFilter} onValueChange={handleChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select time" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="life">Life time</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="yesterday">Yesterday</SelectItem>
          <SelectItem value="last-7-days">Last 7 days</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
          <SelectItem value="year">This year</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}