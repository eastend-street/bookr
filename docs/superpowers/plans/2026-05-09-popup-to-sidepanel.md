# Popup → Chrome Side Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bookrのポップアップ表示をChrome Side Panel APIを使ったブラウザ右側のサイドパネルに切り替える。

**Architecture:** `manifest.json`に`sidePanel`権限と`side_panel`エントリを追加し、アクションクリックでパネルを開くサービスワーカーを追加する。`index.html`とBookmarksコンポーネントの固定サイズ制約を削除して、パネルのフル幅・フル高さに対応させる。

**Tech Stack:** Chrome Extensions Manifest V3, Chrome Side Panel API (`chrome.sidePanel`), React, TypeScript, Tailwind CSS

---

### Task 1: manifest.jsonをSide Panel対応に更新する

**Files:**
- Modify: `public/manifest.json`

- [ ] **Step 1: `default_popup`を削除し、`sidePanel`権限・`side_panel`エントリ・`background`を追加する**

`public/manifest.json` を以下の内容に書き換える：

```json
{
  "manifest_version": 3,
  "name": "Bookr",
  "version": "1.0.0",
  "description": "A beautiful bookmark manager",
  "icons": {
    "16": "icons/icon16.png",
    "32": "icons/icon32.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "action": {
    "default_title": "Bookr",
    "default_icon": {
      "16": "icons/icon16.png",
      "32": "icons/icon32.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "side_panel": {
    "default_path": "index.html"
  },
  "background": {
    "service_worker": "background.js"
  },
  "commands": {
    "_execute_action": {
      "suggested_key": {
        "default": "Alt+Shift+B",
        "mac": "Alt+Shift+B"
      },
      "description": "Open Bookr"
    }
  },
  "permissions": [
    "bookmarks",
    "tabs",
    "sidePanel"
  ]
}
```

- [ ] **Step 2: コミット**

```bash
git add public/manifest.json
git commit -m "feat: update manifest for Chrome Side Panel API"
```

---

### Task 2: background.jsサービスワーカーを作成する

**Files:**
- Create: `public/background.js`

- [ ] **Step 1: サービスワーカーを作成する**

`public/background.js` を新規作成する：

```js
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});
```

- [ ] **Step 2: コミット**

```bash
git add public/background.js
git commit -m "feat: add service worker to open side panel on action click"
```

---

### Task 3: index.htmlの固定サイズを削除する

**Files:**
- Modify: `index.html`

- [ ] **Step 1: `<body>`と`#root`の固定サイズを削除する**

`index.html` の17〜18行目を以下のように変更する：

変更前：
```html
<body style="margin:0;width:384px;height:560px;overflow:hidden;">
  <div id="root" style="width:384px;height:560px;"></div>
```

変更後：
```html
<body style="margin:0;">
  <div id="root"></div>
```

- [ ] **Step 2: コミット**

```bash
git add index.html
git commit -m "feat: remove fixed popup dimensions from index.html"
```

---

### Task 4: Bookmarksコンポーネントをフルサイズ対応にする

**Files:**
- Modify: `src/components/Bookmarks/Bookmarks.tsx:34`

- [ ] **Step 1: 固定サイズのTailwindクラスを変更する**

`src/components/Bookmarks/Bookmarks.tsx` の34行目を変更する：

変更前：
```tsx
<div className="flex h-[560px] w-[384px] flex-col items-start border-r border-solid border-neutral-200 bg-default-background relative">
```

変更後：
```tsx
<div className="flex h-screen w-full flex-col items-start bg-default-background relative">
```

`border-r border-solid border-neutral-200` も削除する。サイドパネル内ではブラウザのフレームが境界を提供するため不要。

- [ ] **Step 2: コミット**

```bash
git add src/components/Bookmarks/Bookmarks.tsx
git commit -m "feat: make Bookmarks component fill full side panel dimensions"
```

---

### Task 5: ビルドして動作確認する

**Files:**
- No file changes

- [ ] **Step 1: ビルドを実行する**

```bash
npm run build
```

Expected: エラーなしで `dist/` に出力される。

- [ ] **Step 2: Lintを確認する**

```bash
npm run lint
```

Expected: 警告・エラーなし。

- [ ] **Step 3: Chrome拡張機能をリロードして動作確認する**

1. `chrome://extensions` を開く
2. Bookrの「再読み込み」ボタンをクリック（または「パッケージ化されていない拡張機能を読み込む」で `dist/` を再指定）
3. 拡張機能アイコンをクリック → ブラウザ右側にサイドパネルが開くことを確認
4. `Alt+Shift+B` → サイドパネルが開くことを確認
5. ページ遷移後もパネルが維持されることを確認
6. 検索、フォルダナビゲーション、ブックマーク追加が正常に動作することを確認
