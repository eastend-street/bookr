import React from "react";
import { TextField } from "@/ui/TextField";
import { FeatherBookmark, FeatherSearch } from "@subframe/core";

type SearchHeaderProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
};

export function SearchHeader({ searchQuery, onSearchChange }: SearchHeaderProps) {
  return (
    <div className="flex w-full flex-col items-start gap-3 border-b border-solid border-neutral-200 px-4 pt-4 pb-3">
      <div className="flex items-center gap-1.5">
        <FeatherBookmark className="text-heading-3 font-heading-3 text-neutral-900" />
        <span className="text-heading-3 font-heading-3 text-neutral-900">
          Bookr
        </span>
      </div>
      <TextField
        className="h-auto w-full flex-none"
        variant="filled"
        label=""
        helpText=""
        icon={<FeatherSearch />}
      >
        <TextField.Input
          autoFocus
          placeholder="Search your bookmarks"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </TextField>
    </div>
  );
}
