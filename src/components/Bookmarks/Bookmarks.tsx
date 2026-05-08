import React from "react";
import { FeatherChevronLeft } from "@subframe/core";
import { SearchHeader } from "@/components/Bookmarks/components/SearchHeader";
import { BookmarkList } from "@/components/Bookmarks/components/BookmarkList";
import { Breadcrumb } from "@/components/Bookmarks/components/Breadcrumb";
import type { BookmarkItem } from "@/hooks/useBookmarks";

export type BookmarksProps = {
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
};

export function Bookmarks({
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
}: BookmarksProps) {
  return (
    <div className="flex h-screen w-full flex-col items-start bg-default-background relative">
      <SearchHeader
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onAddCurrentPage={onAddCurrentPage}
      />

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
        <BookmarkList
          items={displayedItems}
          onOpenBookmark={onOpenBookmark}
          onNavigateInto={onNavigateInto}
        />
      </div>
    </div>
  );
}
