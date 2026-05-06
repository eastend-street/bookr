import React from "react";
import { Button } from "@/ui/Button";
import { TextField } from "@/ui/TextField";
import {
  FeatherBookmark,
  FeatherBookmarkPlus,
  FeatherSearch,
  FeatherFolder,
  FeatherChevronLeft,
} from "@subframe/core";
import { Breadcrumb } from "@/components/Breadcrumb";
import { getFaviconUrl, getDomain } from "@/lib/utils";
import type { BookmarkItem } from "@/hooks/useBookmarks";

export interface AppProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  displayedItems: BookmarkItem[];
  folderStack: BookmarkItem[];
  isInFolder: boolean;
  onNavigateBack: () => void;
  onNavigateTo: (index: number) => void;
  onNavigateInto: (folder: BookmarkItem) => void;
  onOpenBookmark: (url: string) => void;
  onAddCurrentPage: () => void;
}

export default function App({
  searchQuery,
  onSearchChange,
  displayedItems,
  folderStack,
  isInFolder,
  onNavigateBack,
  onNavigateTo,
  onNavigateInto,
  onOpenBookmark,
  onAddCurrentPage,
}: AppProps) {
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
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </TextField>
        <Button
          className="h-9 w-full flex-none bg-neutral-900 hover:bg-neutral-800"
          icon={<FeatherBookmarkPlus />}
          onClick={onAddCurrentPage}
        >
          Add current page
        </Button>
      </div>

      {isInFolder && (
        <div className="flex w-full items-center gap-1 border-b border-solid border-neutral-200 px-2 py-1.5">
          <button
            className="flex items-center gap-1 rounded px-1.5 py-1 text-caption font-caption text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 flex-none"
            onClick={onNavigateBack}
          >
            <FeatherChevronLeft className="text-[14px]" />
            Back
          </button>
          <span className="text-caption font-caption text-neutral-300 flex-none">/</span>
          <Breadcrumb stack={folderStack} onNavigateTo={onNavigateTo} />
        </div>
      )}

      <div className="flex w-full grow shrink-0 basis-0 flex-col items-start overflow-auto">
        {displayedItems.map((item) =>
          item.url ? (
            <div
              key={item.id}
              className="flex w-full items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 cursor-pointer"
              onClick={() => onOpenBookmark(item.url!)}
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
              onClick={() => onNavigateInto(item)}
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
