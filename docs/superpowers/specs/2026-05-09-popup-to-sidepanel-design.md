# Design: Popup → Chrome Side Panel

**Date:** 2026-05-09  
**Status:** Approved

## Overview

Bookrの表示形式を現在のポップアップ（384×560px固定）からChrome Side Panel APIを使ったサイドパネル（右側、フル高さ）に変更する。

## Goals

- 拡張機能アイコンクリック / `Alt+Shift+B` でブラウザ右側にサイドパネルを開く
- サイドパネルはフル高さで表示される
- 幅はChromeのデフォルト動作に従い、ユーザーがドラッグでリサイズ可能
- ページ遷移をまたいでパネルが維持される（Side Panel APIのネイティブ動作）

## Out of Scope

- 幅を画面の正確に1/3に固定すること（Chrome Side Panel APIでは不可）
- アニメーション、ドロワーのスライドイン演出

## Architecture

### 変更ファイル一覧

| ファイル | 変更内容 |
|---|---|
| `public/manifest.json` | `sidePanel`権限追加、`side_panel`エントリ追加、`background`追加、`default_popup`削除 |
| `public/background.js` | 新規作成：アクションクリック時にサイドパネルを開くサービスワーカー |
| `index.html` | `<body>`と`#root`の固定サイズ（384px×560px）を削除 |
| `src/components/Bookmarks/Bookmarks.tsx` | `h-[560px] w-[384px]` → `h-screen w-full` |

## Detailed Design

### manifest.json

```json
{
  "permissions": ["bookmarks", "tabs", "sidePanel"],
  "side_panel": {
    "default_path": "index.html"
  },
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_title": "Bookr",
    "default_icon": { ... }
  }
}
```

- `default_popup` を `action` から削除する（アイコンと`default_title`は維持）
- `_execute_action` コマンドは `chrome.action.onClicked` を発火するため、キーボードショートカット `Alt+Shift+B` は引き続き動作する

### background.js

```js
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});
```

### index.html

`<body>` と `#root` の `style` 属性から固定サイズを削除する。

**Before:**
```html
<body style="margin:0;width:384px;height:560px;overflow:hidden;">
  <div id="root" style="width:384px;height:560px;"></div>
```

**After:**
```html
<body style="margin:0;">
  <div id="root"></div>
```

### Bookmarks.tsx (line 34)

`h-[560px] w-[384px]` を `h-screen w-full` に変更し、パネル全体を埋めるようにする。

## Testing

1. `npm run build` でビルド
2. `chrome://extensions` で `dist/` をリロード
3. 拡張機能アイコンをクリック → 右側にサイドパネルが開くことを確認
4. `Alt+Shift+B` → サイドパネルが開くことを確認
5. ページ遷移後もパネルが維持されることを確認
6. 検索、フォルダナビゲーション、ブックマーク追加が正常に動作することを確認
