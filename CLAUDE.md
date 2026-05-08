# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Bookr is a Chrome Extension (Manifest V3) for browsing and managing bookmarks, built with React + TypeScript + Vite. The popup is fixed at 384×560px and activates via Alt+Shift+B.

## Commands

```bash
npm run dev      # Start dev server (mock Chrome API used automatically)
npm run build    # tsc && vite build → outputs to dist/
npm run lint     # ESLint with zero warnings tolerance
npm run preview  # Preview built output
```

To load the extension: build first, then load the `dist/` folder in Chrome via `chrome://extensions` (Developer mode → Load unpacked).

There are no tests in this project.

## Architecture

**Pattern:** Container/Presentational with a custom hook for all state.

```
App
└── BookmarksContainer   ← all state and Chrome API calls
    └── Bookmarks        ← pure presentational
        ├── SearchHeader
        ├── Breadcrumb
        └── BookmarkList
```

**`useBookmarks` hook** (`src/hooks/useBookmarks.ts`) owns all state: the bookmark tree, folder navigation stack, search query, and current tab info. This is the right place to add any new bookmark-related logic.

**Chrome API abstraction** (`src/lib/chromeApi.ts`) wraps `chrome.bookmarks` and `chrome.tabs`. When `typeof chrome === 'undefined'` (i.e., running in the Vite dev server), it falls back to mock data automatically—no manual switching needed.

**UI components** in `src/ui/` are generated from the [Subframe](https://subframe.com) design system (project ID: `b1a7d7646424`). Don't hand-edit these; use `/subframe:design` and `/subframe:develop` skills instead. Subframe icons come from `@subframe/core` (e.g., `FeatherBookmark`, `FeatherFolder`).

**Path alias:** `@/*` resolves to `src/*` (configured in `tsconfig.json` and `vite.config.ts`).

## Communication

- Always respond in Japanese.

## Key Conventions

- All components use `type` (not `interface`) for props — enforced across the codebase.
- Tailwind CSS for all styling; custom theme tokens are in `tailwind.config.js`.
- Strict TypeScript (`strict: true`); ESLint at zero-warning threshold.
- Favicons are fetched from Google's favicon service via `src/lib/utils.ts` — no backend required.
