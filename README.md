# CodeZen — Minimalist Browser-Based Code Editor

CodeZen is a sleek, minimal online code editor designed for developers, students, and prototyping. Built with React 18, TypeScript, and CodeMirror 6, it features a confidence-driven, dark editorial developer-tool aesthetic inspired by modern tools like Linear and Vercel. 

The editor combines syntax highlighting, real-time live preview, responsive device emulation, and a built-in terminal console into a distraction-free single-page interface.

---

## Technical Features

### Distraction-Free Developer Workspace
* **Zen Mode (`Ctrl + Shift + Z`)** — Instantly strips away all panels, headers, and tabs, leaving a full-bleed active editor and preview layout. Press `Tab` in Zen Mode to cycle panels (HTML → CSS → JS) and `Esc` to exit.
* **Focus Lock** — Promotes visual flow. If the keyboard is inactive for 3 seconds, non-active editor panels fade out to `0.15` opacity. Move the mouse to restore them.
* **Fuzzy Command Palette (`Ctrl + K` or Search Icon)** — Fast-action control center. Access and activate all editor themes, boilerplate templates, and system shortcuts instantly with fuzzy autocomplete typing.

### Visual Prototyping & Emulation
* **Responsive Emulation** — View live page renders inside simulated device viewports (Mobile 375px, Tablet 768px, Desktop 1200px).
* **Side-by-Side Device Comparison** — View Mobile, Tablet, and Desktop rendering frames side-by-side simultaneously in scrollable columns.
* **Custom Device Viewports & Flip Orientation** — Create, name, and save your own custom device screen dimensions (saved in `localStorage`), and rotate active viewports between portrait and landscape.
* **Persisted Canvas Snapshots & Diff Splitter** — Capture layout snapshots of HTML/CSS/JS, see preview frame thumbnails, and compare any two snapshots side-by-side using an interactive draggable comparison slider.

### Exceptional Monospace Console
* **Collapsible Object/Array Inspection** — Logs complex objects and arrays into tree graphs (Chrome DevTools style) allowing multi-level expansion.
* **Real-time Error Underlining** — Automatically runs JS preview execution checks. If an error is thrown, the exact failing line in the CodeMirror JS editor is highlighted in red, clearing once the user edits.
* **Execution Timeline** — Benchmarks the speed of code execution. Every log features a relative timestamp (e.g. `+12.4ms`) and a visual timing scale bar corresponding to when it fired relative to page load.

### Code Editing & Utilities
* **Live Code Editing & Auto-Save** — Editors for HTML, CSS, and JS powered by CodeMirror 6 with syntax highlighting, automatic asset recovery, and session saving.
* **Intelligent Auto-Format** — Pretty-prints your markup and code styling in one click.
* **Template Library** — Select and load ready-to-run code templates, including a custom console showcase demo.
* **Export Options** — Download source code as separate files or compiled into a single self-contained HTML pack.
* **Keyboard Shortcuts**:
  * `Ctrl + Shift + Z` — Toggle Zen distraction-free mode
  * `Ctrl + K` or `🔍` — Toggle Command Palette
  * `?` or `Ctrl + /` — Open Keyboard Shortcuts Guide

---

## Directory Layout

```
frontend/
├── public/
│   ├── assets/
│   │   ├── logo.png              # Brand logo
│   │   └── uplogo.png            # Favicon
│   ├── index.html                # App entry HTML template
│   └── manifest.json             # PWA metadata configuration
├── src/
│   ├── components/
│   │   ├── CodeEditor.tsx        # Central code editor layout
│   │   ├── Home.tsx              # Minimalist landing page
│   │   ├── ConsoleOutput.tsx     # Custom monospace console terminal
│   │   ├── ResponsivePreview.tsx # Device preview frame simulator
│   │   ├── CommandPalette.tsx    # Fuzzy search palette (Ctrl+K)
│   │   ├── SnapshotManager.tsx   # Persisted canvas snapshots & splitter diffs
│   │   ├── TemplatesModal.tsx    # Code templates panel
│   │   ├── ConfirmModal.tsx      # Warning confirmation modal
│   │   ├── KeyboardShortcutsModal.tsx  # Shortcuts cheat sheet
│   │   └── Toast.tsx             # Clean toast notification system
│   ├── data/
│   │   ├── templates.ts          # Boilerplate code templates
│   │   └── themes.ts             # Editor color themes configs
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   ├── App.tsx                   # Core React router config
│   ├── index.tsx                 # React DOM mount entrypoint
│   └── index.css                 # CSS layout imports & Tailwind rules
├── package.json                  # Dependencies manifest
├── tsconfig.json                 # TypeScript compiler configuration
└── tailwind.config.js            # Design tokens & animation definitions
```

---

## Tech Stack
* **Framework:** React 18
* **Language:** TypeScript 4.9
* **Editor Core:** CodeMirror 6
* **CSS Framework:** Tailwind CSS 3.4
* **Icons:** FontAwesome 6

---

## Getting Started

### Installation

1. **Clone the repository and go to the frontend directory**
   ```bash
   git clone https://github.com/bedigambar/CodeZen-Editor
   cd CodeZen-Editor/frontend
   ```

2. **Install node package dependencies**
   ```bash
   npm install
   ```

3. **Start the local development server**
   ```bash
   npm start
   ```

4. **Open your browser to preview**
   ```
   http://localhost:3000
   ```

### Production Build

Compile a minified production build:
```bash
npm run build
```
The optimized bundle will be generated under the `build/` folder.

---

## License & Attribution

CodeZen is released under the [MIT License](https://github.com/bedigambar/CodeZen-Editor/blob/main/LICENSE) — © 2025 bedigambar.

You're welcome to use, modify and build on this code, but you must keep the copyright notice and license intact (i.e. give credit). If you ship something based on CodeZen, a shout-out and a link back to [this repo](https://github.com/bedigambar/CodeZen-Editor) is hugely appreciated. 🙏

