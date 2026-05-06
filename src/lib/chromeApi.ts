const IS_EXTENSION = typeof chrome !== "undefined" && !!chrome.bookmarks;

type BookmarkNode = chrome.bookmarks.BookmarkTreeNode;

const mockTree: BookmarkNode[] = [
  {
    id: "0",
    title: "",
    children: [
      {
        id: "1",
        title: "Bookmarks Bar",
        children: [
          { id: "10", title: "GitHub", url: "https://github.com" },
          { id: "11", title: "Figma", url: "https://figma.com" },
          {
            id: "20",
            title: "Dev Tools",
            children: [
              { id: "21", title: "React Docs", url: "https://react.dev" },
              { id: "22", title: "TypeScript", url: "https://typescriptlang.org" },
            ],
          },
        ],
      },
      {
        id: "2",
        title: "Other Bookmarks",
        children: [
          { id: "30", title: "Example", url: "https://example.com" },
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
