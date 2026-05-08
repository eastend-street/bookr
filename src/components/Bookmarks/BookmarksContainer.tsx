import React, { useState } from "react";
import { Bookmarks } from "@/components/Bookmarks/Bookmarks";
import { useBookmarks } from "@/hooks/useBookmarks";
import { chromeApi } from "@/lib/chromeApi";

export function BookmarksContainer() {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    displayedItems,
    folderStack,
    navigateInto,
    navigateBack,
    navigateTo,
  } = useBookmarks(searchQuery);

  const isInFolder = folderStack.length > 0 && !searchQuery;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape" && folderStack.length > 0) {
      e.preventDefault();
      navigateBack();
    }
  };

  const handleNavigateInto = (folder: Parameters<typeof navigateInto>[0]) => {
    setSearchQuery("");
    navigateInto(folder);
  };

  return (
    <Bookmarks
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      displayedItems={displayedItems}
      folderStack={folderStack}
      isInFolder={isInFolder}
      onNavigateBack={navigateBack}
      onNavigateTo={navigateTo}
      onNavigateInto={handleNavigateInto}
      onOpenBookmark={(url) => chromeApi.tabs.create({ url })}
      onKeyDown={handleKeyDown}
    />
  );
}
