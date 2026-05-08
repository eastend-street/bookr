import React, { useRef } from "react";
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
  const listRef = useRef<HTMLUListElement>(null);

  if (items.length === 0) {
    return (
      <div className="flex w-full items-center justify-center py-8">
        <span className="text-body font-body text-neutral-400">
          No bookmarks found
        </span>
      </div>
    );
  }

  const handleArrowKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const focusable = listRef.current?.querySelectorAll<HTMLElement>("a, button");
    if (!focusable) return;
    const arr = Array.from(focusable);
    const idx = arr.indexOf(document.activeElement as HTMLElement);
    const next = e.key === "ArrowDown" ? arr[idx + 1] : arr[idx - 1];
    next?.focus();
  };

  return (
    <ul ref={listRef} className="w-full list-none p-0 m-0">
      {items.map((item) =>
        item.url ? (
          <li key={item.id}>
            <a
              href={item.url}
              aria-label={item.title || getDomain(item.url)}
              className="flex w-full items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 focus:bg-neutral-100 focus:outline-none cursor-pointer no-underline"
              onClick={(e) => {
                e.preventDefault();
                onOpenBookmark(item.url!);
              }}
              onKeyDown={handleArrowKey}
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
            </a>
          </li>
        ) : (
          <li key={item.id}>
            <button
              type="button"
              aria-label={`${item.title} フォルダー`}
              className="flex w-full items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 focus:bg-neutral-100 focus:outline-none cursor-pointer bg-transparent border-0 text-left"
              onClick={() => onNavigateInto(item)}
              onKeyDown={handleArrowKey}
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
            </button>
          </li>
        )
      )}
    </ul>
  );
}
