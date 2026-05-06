import React, { useState } from "react";
import { Button } from "@/ui/Button";
import { TextField } from "@/ui/TextField";
import {
  FeatherBookmark,
  FeatherBookmarkPlus,
  FeatherSearch,
  FeatherFolder,
  FeatherChevronLeft,
} from "@subframe/core";
import { useBookmarks } from "@/hooks/useBookmarks";
import { getFaviconUrl, getDomain } from "@/lib/utils";
import { chromeApi } from "@/lib/chromeApi";
import type { BookmarkItem } from "@/hooks/useBookmarks";

interface BreadcrumbProps {
  stack: BookmarkItem[];
  onNavigateTo: (index: number) => void;
}

function Breadcrumb({ stack, onNavigateTo }: BreadcrumbProps) {
  const segments =
    stack.length > 2
      ? [stack[0], null, stack[stack.length - 1]]
      : stack;

  return (
    <div className="flex min-w-0 items-center gap-1 overflow-hidden">
      {segments.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <span className="text-caption font-caption text-neutral-300 flex-none">/</span>
          )}
          {item === null ? (
            <span className="text-caption font-caption text-neutral-400 flex-none">…</span>
          ) : (
            <button
              className="min-w-0 max-w-[100px] truncate rounded px-1 py-0.5 text-left text-caption font-caption text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 last:text-caption-bold last:font-caption-bold last:text-neutral-700"
              onClick={() => onNavigateTo(stack.indexOf(item))}
            >
              {item.title}
            </button>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const { displayedItems, folderStack, navigateInto, navigateBack, navigateTo, addCurrentPage } =
    useBookmarks(searchQuery);

  const isInFolder = folderStack.length > 0 && !searchQuery;
  const currentFolder = folderStack[folderStack.length - 1];

  const handleNavigateInto = (folder: Parameters<typeof navigateInto>[0]) => {
    setSearchQuery("");
    navigateInto(folder);
  };

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

      {isInFolder && (
        <div className="flex w-full items-center gap-1 border-b border-solid border-neutral-200 px-2 py-1.5">
          <button
            className="flex items-center gap-1 rounded px-1.5 py-1 text-caption font-caption text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 flex-none"
            onClick={navigateBack}
          >
            <FeatherChevronLeft className="text-[14px]" />
            Back
          </button>
          <span className="text-caption font-caption text-neutral-300 flex-none">/</span>
          <Breadcrumb stack={folderStack} onNavigateTo={navigateTo} />
        </div>
      )}

      <div className="flex w-full grow shrink-0 basis-0 flex-col items-start overflow-auto">
        {displayedItems.map((item) =>
          item.url ? (
            <div
              key={item.id}
              className="flex w-full items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 cursor-pointer"
              onClick={() => chromeApi.tabs.create({ url: item.url! })}
            >
              <img
                className="h-8 w-8 flex-none rounded-sm border border-solid border-neutral-200 object-cover"
                src={getFaviconUrl(item.url)}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <div className="flex min-w-[0px] grow shrink-0 basis-0 flex-col items-start">
                <span className="line-clamp-1 w-full text-body-bold font-body-bold text-neutral-900">
                  {item.title || getDomain(item.url)}
                </span>
                <span className="line-clamp-1 w-full text-caption font-caption text-neutral-500">
                  {getDomain(item.url)}
                </span>
              </div>
            </div>
          ) : (
            <div
              key={item.id}
              className="flex w-full items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 cursor-pointer"
              onClick={() => handleNavigateInto(item)}
            >
              <div className="flex h-8 w-8 flex-none items-center justify-center rounded-sm border border-solid border-neutral-200 bg-neutral-50">
                <FeatherFolder className="text-body font-body text-neutral-500" />
              </div>
              <div className="flex min-w-[0px] grow shrink-0 basis-0 flex-col items-start">
                <span className="line-clamp-1 w-full text-body-bold font-body-bold text-neutral-900">
                  {item.title}
                </span>
                <span className="text-caption font-caption text-neutral-400">
                  {item.children?.length ?? 0} items
                </span>
              </div>
            </div>
          )
        )}
        {displayedItems.length === 0 && (
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
