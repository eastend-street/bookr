# Bookr

A bookmark manager Chrome extension built with React, TypeScript, and Subframe.

<img width="456" height="607" alt="image" src="https://github.com/user-attachments/assets/770d4b70-229b-43ab-a2f4-00882ec24733" />


## Installing the Chrome Extension

### First-time Setup

1. **Clone the repository**

   ```bash
   git clone <this repository's URL>
   cd bookr
   ```

2. **Run the setup script**

   ```bash
   ./setup.sh
   ```

   This installs dependencies, builds the extension, opens `chrome://extensions/` in Chrome, and opens the `dist/` folder in Finder.

3. **Load the extension into Chrome** *(one click)*

   1. Enable **Developer mode** (toggle in the top-right corner of `chrome://extensions/`)
   2. Click **Load unpacked** and select the `dist/` folder that opened in Finder

4. **Done** — The Bookr icon will appear in your Chrome toolbar.  
   Press `Alt+Shift+B` to open the popup.

> **Shortcut conflict?** If `Alt+Shift+B` is already taken by another extension or app, you can reassign it at `chrome://extensions/shortcuts` — find Bookr in the list and set a new key combination.

---

### Using on Another Computer

Follow the same steps above. Clone this repository and run `./setup.sh` — it handles everything and opens Chrome for you.

> **Note:** The `dist/` folder is not tracked by Git, so you need to build it on each machine.

---

## Development

To run the UI in development mode:

```bash
npm run dev
```

## Build

```bash
npm run build
```

The extension files will be output to the `dist/` folder. Load this folder into Chrome as described above.

---

## Tech Stack

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Subframe](https://subframe.com/)
