 

import { Search } from "lucide-react";
import React from "react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  data: any[];
  onSearch: (data: any[]) => void;
  setIsSearch: (isSearch: boolean) => void;
  placeholder?: string;
}

export default function SearchBar({
  data,
  onSearch,
  setIsSearch,
  placeholder = "Search",
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim() === "") {
      onSearch(data);
      setIsSearch(false);
      return;
    }

    setIsSearch(true);
    const filteredData = data.filter((item: any) =>
      Object.values(item).some(
        (valueItem: any) =>
          valueItem &&
          valueItem.toString().toLowerCase().includes(value.toLowerCase())
      )
    );
    onSearch(filteredData);
  };

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearch}
        className="pl-10 w-full"
      />
    </div>
  );
}