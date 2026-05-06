import { useState, useEffect } from "react";
import { chromeApi } from "@/lib/chromeApi";

export interface Bookmark {
  id: string;
  title: string;
  url: string;
}

function flattenBookmarks(
  nodes: chrome.bookmarks.BookmarkTreeNode[]
): Bookmark[] {
  const result: Bookmark[] = [];
  for (const node of nodes) {
    if (node.url) {
      result.push({ id: node.id, title: node.title, url: node.url });
    }
    if (node.children) {
      result.push(...flattenBookmarks(node.children));
    }
  }
  return result;
}

export function useBookmarks(searchQuery: string) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [currentTab, setCurrentTab] = useState<{
    title: string;
    url: string;
  } | null>(null);

  useEffect(() => {
    chromeApi.bookmarks.getTree((tree) => {
      setBookmarks(flattenBookmarks(tree));
    });

    chromeApi.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        setCurrentTab({ title: tabs[0].title ?? "", url: tabs[0].url ?? "" });
      }
    });
  }, []);

  const filteredBookmarks = searchQuery
    ? bookmarks.filter(
        (b) =>
          b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.url.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : bookmarks;

  const addCurrentPage = () => {
    if (!currentTab?.url) return;
    chromeApi.bookmarks.create(
      { title: currentTab.title, url: currentTab.url },
      (newBookmark) => {
        setBookmarks((prev) => [
          {
            id: newBookmark.id,
            title: newBookmark.title,
            url: newBookmark.url ?? "",
          },
          ...prev,
        ]);
      }
    );
  };

  return { filteredBookmarks, currentTab, addCurrentPage };
}
