import React, { useState } from "react";
import { Button } from "@/ui/Button";
import { TextField } from "@/ui/TextField";
import {
  FeatherBookmark,
  FeatherBookmarkPlus,
  FeatherSearch,
} from "@subframe/core";
import { useBookmarks } from "@/hooks/useBookmarks";
import { getFaviconUrl, getDomain } from "@/lib/utils";
import { chromeApi } from "@/lib/chromeApi";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const { filteredBookmarks, addCurrentPage } = useBookmarks(searchQuery);

  return (
    <div className="flex h-[560px] w-[384px] flex-col items-start border-r border-solid border-neutral-200 bg-default-background relative">
      <div className="flex w-full flex-col items-start gap-3 border-b border-solid border-neutral-200 px-4 pt-4 pb-3">
        <div className="flex w-full items-center gap-2">
          <div className="flex items-center gap-1.5">
            <FeatherBookmark className="text-heading-3 font-heading-3 text-neutral-900" />
            <span className="text-heading-3 font-heading-3 text-neutral-900">
              Bookr
            </span>
          </div>
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
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </TextField>
        <Button
          className="h-9 w-full flex-none bg-neutral-900 hover:bg-neutral-800"
          icon={<FeatherBookmarkPlus />}
          onClick={addCurrentPage}
        >
          Add current page
        </Button>
      </div>
      <div className="flex w-full grow shrink-0 basis-0 flex-col items-start overflow-auto">
        {filteredBookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="flex w-full items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 cursor-pointer"
            onClick={() => chromeApi.tabs.create({ url: bookmark.url })}
          >
            <img
              className="h-8 w-8 flex-none rounded-sm border border-solid border-neutral-200 object-cover"
              src={getFaviconUrl(bookmark.url)}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="flex min-w-[0px] grow shrink-0 basis-0 flex-col items-start">
              <span className="line-clamp-1 w-full text-body-bold font-body-bold text-neutral-900">
                {bookmark.title || getDomain(bookmark.url)}
              </span>
              <span className="line-clamp-1 w-full text-caption font-caption text-neutral-500">
                {getDomain(bookmark.url)}
              </span>
            </div>
          </div>
        ))}
        {filteredBookmarks.length === 0 && (
          <div className="flex w-full items-center justify-center py-8">
            <span className="text-body font-body text-neutral-400">
              No bookmarks found
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
