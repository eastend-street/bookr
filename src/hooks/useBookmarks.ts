import { useState, useEffect } from "react";
import { chromeApi } from "@/lib/chromeApi";

export type BookmarkItem = {
  id: string;
  title: string;
  url?: string;
  children?: BookmarkItem[];
};

function buildTree(nodes: chrome.bookmarks.BookmarkTreeNode[]): BookmarkItem[] {
  return nodes.map((node) => ({
    id: node.id,
    title: node.title,
    url: node.url,
    children: node.children ? buildTree(node.children) : undefined,
  }));
}

function searchTree(items: BookmarkItem[], query: string): BookmarkItem[] {
  const q = query.toLowerCase();
  const results: BookmarkItem[] = [];
  for (const item of items) {
    const matches =
      item.title.toLowerCase().includes(q) ||
      (item.url?.toLowerCase().includes(q) ?? false);
    if (matches) results.push(item);
    if (item.children) results.push(...searchTree(item.children, q));
  }
  return results;
}

export function useBookmarks(searchQuery: string) {
  const [rootItems, setRootItems] = useState<BookmarkItem[]>([]);
  const [folderStack, setFolderStack] = useState<BookmarkItem[]>([]);

  useEffect(() => {
    chromeApi.bookmarks.getTree((tree) => {
      // Chrome's root has built-in folders (Bookmarks Bar, Other Bookmarks,
      // Mobile Bookmarks) that shouldn't be shown as user folders — skip them
      // and merge their children directly into the root view.
      const defaultFolders = tree[0]?.children ?? [];
      const topLevel = defaultFolders.flatMap((f) => f.children ?? []);
      setRootItems(buildTree(topLevel));
    });
  }, []);

  const currentFolder = folderStack[folderStack.length - 1] ?? null;

  const displayedItems = searchQuery
    ? searchTree(rootItems, searchQuery)
    : (currentFolder?.children ?? rootItems);

  const navigateInto = (folder: BookmarkItem) => {
    setFolderStack((prev) => [...prev, folder]);
  };

  const navigateBack = () => {
    setFolderStack((prev) => prev.slice(0, -1));
  };

  const navigateTo = (index: number) => {
    setFolderStack((prev) => prev.slice(0, index + 1));
  };

  return {
    displayedItems,
    folderStack,
    navigateInto,
    navigateBack,
    navigateTo,
  };
}
