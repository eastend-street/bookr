const IS_EXTENSION = typeof chrome !== "undefined" && !!chrome.bookmarks;

type BookmarkNode = chrome.bookmarks.BookmarkTreeNode;

const mockTree: BookmarkNode[] = [
  {
    id: "1",
    title: "",
    children: [
      {
        id: "2",
        title: "Bookmarks Bar",
        children: [
          { id: "10", title: "GitHub", url: "https://github.com" },
          { id: "11", title: "Figma", url: "https://figma.com" },
          { id: "12", title: "React Docs", url: "https://react.dev" },
        ],
      },
    ],
  },
] as BookmarkNode[];

export const chromeApi: typeof chrome = IS_EXTENSION
  ? chrome
  : ({
      bookmarks: {
        getTree: (cb: (tree: BookmarkNode[]) => void) => cb(mockTree),
        create: (
          props: { title?: string; url?: string },
          cb?: (result: BookmarkNode) => void
        ) =>
          cb?.({
            id: String(Date.now()),
            title: props.title ?? "",
            url: props.url,
          } as BookmarkNode),
      },
      tabs: {
        query: (
          _: chrome.tabs.QueryInfo,
          cb: (tabs: chrome.tabs.Tab[]) => void
        ) =>
          cb([
            { title: "Example Page", url: "https://example.com" } as chrome.tabs.Tab,
          ]),
        create: (_: chrome.tabs.CreateProperties) => {},
      },
    } as unknown as typeof chrome);
