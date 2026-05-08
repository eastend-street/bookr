import React from "react";
import { FeatherFolder } from "@subframe/core";
import { getFaviconUrl, getDomain } from "@/lib/utils";
import type { BookmarkItem } from "@/hooks/useBookmarks";

type BookmarkListProps = {
  items: BookmarkItem[];
  onOpenBookmark: (url: string) => void;
  onNavigateInto: (folder: BookmarkItem) => void;
};

export function BookmarkList({
  items,
  onOpenBookmark,
  onNavigateInto,
}: BookmarkListProps) {
  if (items.length === 0) {
    return (
      <div className="flex w-full items-center justify-center py-8">
        <span className="text-body font-body text-neutral-400">
          No bookmarks found
        </span>
      </div>
    );
  }

  const handleKeyDown = (e: React.KeyboardEvent, item: BookmarkItem) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (item.url) {
        onOpenBookmark(item.url);
      } else {
        onNavigateInto(item);
      }
    }
  };

  return (
    <div role="list" className="w-full">
      {items.map((item) =>
        item.url ? (
          <div
            key={item.id}
            role="button"
            tabIndex={0}
            aria-label={item.title || getDomain(item.url)}
            className="flex w-full items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 focus:bg-neutral-50 focus:outline-none cursor-pointer"
            onClick={() => onOpenBookmark(item.url!)}
            onKeyDown={(e) => handleKeyDown(e, item)}
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
            role="button"
            tabIndex={0}
            aria-label={`${item.title} フォルダー`}
            className="flex w-full items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 focus:bg-neutral-50 focus:outline-none cursor-pointer"
            onClick={() => onNavigateInto(item)}
            onKeyDown={(e) => handleKeyDown(e, item)}
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
    </div>
  );
}
