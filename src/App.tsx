import React, { useState, useEffect } from "react";
import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import {
  FeatherBookmark,
  FeatherBookmarkPlus,
  FeatherSearch,
} from "@subframe/core";
import { chromeApi } from "@/lib/chromeApi";

interface Bookmark {
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

function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch {
    return "";
  }
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export default function App() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleAddCurrentPage = () => {
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
          onClick={handleAddCurrentPage}
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
