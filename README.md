# CodeZen — Minimalist Browser-Based Code Editor

CodeZen is a sleek, minimal online code editor designed for developers, students, and prototyping. Built with React 18, TypeScript, and CodeMirror 6, it features a confidence-driven, dark editorial developer-tool aesthetic inspired by modern tools like Linear and Vercel. 

The editor combines syntax highlighting, real-time live preview, responsive device emulation, and a built-in terminal console into a distraction-free single-page interface.

---

## Technical Features

### Core Capabilities
* **Live Code Editing** — Standalone editors for HTML, CSS, and JavaScript with syntax highlighting powered by CodeMirror 6.
* **Instant Preview** — Auto-updates the running preview frame as you type with debounced performance.
* **Built-in Console Terminal** — Debug JavaScript directly on-page; captures `console.log`, `console.warn`, `console.error`, and `console.info` in a custom monospace terminal panel.
* **Responsive Emulation** — View output inside a simulated window frame at Mobile (375px), Tablet (768px), Desktop (1200px), or Full-width layouts.
* **Intelligent Auto-Save** — Persists your working state locally via browser storage to prevent accidental data loss.

### Design System & Theme config
* **Editorial Typography** — Set in Syne for headings/tabs and JetBrains Mono for code, buttons, and console outputs.
* **High Contrast / High Legibility** — Deep backgrounds (`#0d0d0d`/`#111`), subtle clean borders (`#1f1f1f`/`#2a2a2a`), with a single bright highlight in acid yellow (`#e8ff47`) and danger states in solid red (`#ff5555`).
* **5 Editor Themes** — Toggle between One Dark, VSCode Dark, Dracula, Monokai, and GitHub Light.
* **Refined Micro-interactions** — Smooth transitions, hover border enhancements, and clean, scale-in animations replace bounce effects.

### Utility Actions
* **Intelligent Auto-Format** — Pretty-prints your current HTML, CSS, and JS code in one click.
* **Template Library** — Select and load boilerplate structures (Landing Page, Profile Card, Navigation Bar, Todo List, Animated Buttons).
* **Export Options** — Download individual `.html`, `.css`, or `.js` source files, or export a single self-contained HTML file containing all assets.
* **Keyboard Shortcuts** — Maximize productivity with quick keys:
  * `F11` — Toggle Fullscreen Mode
  * `Esc` — Exit Fullscreen Mode
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

## License

Distributed under the MIT License. See [LICENSE](https://github.com/bedigambar/CodeZen-Editor/blob/main/LICENSE) for details.
