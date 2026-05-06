import React from "react";
import type { BookmarkItem } from "@/hooks/useBookmarks";

interface BreadcrumbProps {
  stack: BookmarkItem[];
  onNavigateTo: (index: number) => void;
}

export function Breadcrumb({ stack, onNavigateTo }: BreadcrumbProps) {
  const segments =
    stack.length > 2
      ? [stack[0], null, stack[stack.length - 1]]
      : stack;

  return (
    <div className="flex min-w-0 items-center gap-1 overflow-hidden">
      {segments.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <span className="text-caption font-caption text-neutral-300 flex-none">/</span>
          )}
          {item === null ? (
            <span className="text-caption font-caption text-neutral-400 flex-none">…</span>
          ) : (
            <button
              className="min-w-0 max-w-[100px] truncate rounded px-1 py-0.5 text-left text-caption font-caption text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 last:text-caption-bold last:font-caption-bold last:text-neutral-700"
              onClick={() => onNavigateTo(stack.indexOf(item))}
            >
              {item.title}
            </button>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
