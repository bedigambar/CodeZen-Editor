# 🎨 CodeZen - Modern Online Code Editor

<div align="center">

![CodeZen Banner](https://img.shields.io/badge/CodeZen-Online_Code_Editor-blueviolet?style=for-the-badge)

**A sleek, feature-rich online code editor for HTML, CSS, and JavaScript with real-time preview**

[![Live Demo](https://img.shields.io/badge/🚀_Live-Demo-success?style=for-the-badge)](https://code-zen-editor.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/bedigambar/CodeZen-Editor)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

**[✨ View Live Demo](https://code-zen-editor.vercel.app)** • **[📝 Documentation](#-features)** • **[🐛 Report Bug](https://github.com/bedigambar/CodeZen-Editor/issues)** • **[💡 Request Feature](https://github.com/bedigambar/CodeZen-Editor/issues)**

</div>

---

## 📖 About The Project

CodeZen is a powerful, browser-based code editor designed for developers, students, and coding enthusiasts. Write HTML, CSS, and JavaScript code with syntax highlighting, see live previews instantly, and test your responsive designs across different device sizes—all in one place!

Perfect for:
- 🎓 **Learning** - Students practicing web development
- 🚀 **Prototyping** - Quick UI/UX experiments
- 🎨 **Design Testing** - Testing responsive layouts
- 💻 **Code Sharing** - Demonstrating code snippets
- 🔧 **Debugging** - Testing JavaScript with built-in console

---

## ✨ Features

### 🎯 **Core Functionality**
- **✍️ Live Code Editing** - Write HTML, CSS, and JavaScript with intelligent syntax highlighting
- **⚡ Real-Time Preview** - See your changes instantly as you type (250ms debounce)
- **🖥️ Built-in Console** - Debug JavaScript with console.log, console.error, console.warn, and console.info
- **📱 Responsive Testing** - Preview on Mobile (375px), Tablet (768px), Desktop (1440px), or Full Width
- **💾 Auto-Save** - Your work is automatically saved to localStorage—never lose your progress
- **⚡ Fast Performance** - Optimized rendering with React 18 and TypeScript

### 🎨 **Themes & Customization**
Choose from **5 beautiful editor themes**:
- 🌙 **One Dark** (Default)
- 🌑 **VSCode Dark**
- 🧛 **Dracula**
- 🎭 **Monokai**
- ☀️ **GitHub Light**

Themes persist across sessions for a personalized experience!

### 📚 **Ready-to-Use Templates**
Jumpstart your coding with professional templates:
- 🏠 **Landing Page** - Modern hero section with features
- 👤 **Profile Card** - Animated user card component
- 🧭 **Navigation Bar** - Responsive navbar with mobile menu
- ✅ **Todo List** - Interactive task manager app
- 🎨 **Animated Buttons** - Collection of stunning button styles

### 🛠️ **Developer Tools**
- **✨ Auto-Format** - Clean up your code with intelligent formatting
- **📋 Copy to Clipboard** - Quick copy for HTML, CSS, or JavaScript
- **📥 Download Files** - Export individual files (HTML/CSS/JS) or complete project
- **⌨️ Keyboard Shortcuts** - Boost productivity with shortcuts (F11 for fullscreen, ? for help)
- **🖼️ Fullscreen Mode** - Distraction-free coding experience
- **🔔 Toast Notifications** - User-friendly feedback for all actions

### 📱 **Responsive Design**
- ✅ Fully optimized for mobile (375px), tablet (1024px), and desktop
- ✅ Mobile-first approach with touch-friendly interface
- ✅ Adaptive UI elements that adjust to screen size
- ✅ Icon-only buttons on small screens for better space utilization

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v14.0 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bedigambar/CodeZen-Editor
   cd CodeZen-Editor/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open in your browser**
   ```
   http://localhost:3000
   ```

   The app will automatically reload when you make changes!

### Build for Production

```bash
npm run build
```

Creates an optimized production build in the `build/` folder, ready for deployment.

---

## 🎯 How to Use

### **Basic Workflow**

1. **✍️ Write Your Code**
   - Type HTML in the left editor
   - Add CSS styling in the middle editor
   - Add JavaScript functionality in the right editor

2. **👀 Live Preview**
   - Your code renders in real-time in the preview pane below
   - Changes appear instantly as you type

3. **🐛 Debug with Console**
   - Open the console panel to see JavaScript logs
   - View errors, warnings, and info messages
   - Console automatically opens when you use console methods

4. **📱 Test Responsiveness**
   - Click device buttons to switch between Mobile, Tablet, Desktop, or Full Width views
   - Perfect for testing responsive designs!

5. **💾 Save & Download**
   - Code auto-saves to your browser's localStorage
   - Download individual files or a complete HTML file with embedded CSS/JS
   - Copy code to clipboard with one click

### **Keyboard Shortcuts**

| Shortcut | Action |
|----------|--------|
| `F11` | Toggle fullscreen mode |
| `Esc` | Exit fullscreen mode |
| `?` or `Ctrl + /` | Show keyboard shortcuts help |

### **Using Templates**

1. Click the **"TEMPLATES"** button in the navbar
2. Browse available templates
3. Click on any template to load it instantly
4. Customize the code to your needs!

---

## 🏗️ Tech Stack

### **Frontend**
- **[React 18.2](https://reactjs.org/)** - UI library with latest features
- **[TypeScript 4.9](https://www.typescriptlang.org/)** - Type-safe development
- **[CodeMirror 6](https://codemirror.net/)** - Professional code editor component
- **[Tailwind CSS 3.4](https://tailwindcss.com/)** - Utility-first styling
- **[React Router 6.16](https://reactrouter.com/)** - Client-side routing

### **Development Tools**
- **ESLint** - Code quality and consistency
- **PostCSS** - CSS processing
- **Autoprefixer** - Automatic vendor prefixes

---

## 📁 Project Structure

```
frontend/
├── public/
│   ├── assets/
│   │   ├── logo.png              # Main logo
│   │   └── uplogo.png            # Favicon
│   ├── index.html                # HTML template
│   └── manifest.json             # PWA manifest
├── src/
│   ├── components/
│   │   ├── CodeEditor.tsx        # Main editor component
│   │   ├── Home.tsx              # Landing page
│   │   ├── ConsoleOutput.tsx     # JavaScript console
│   │   ├── ResponsivePreview.tsx # Device preview modes
│   │   ├── TemplatesModal.tsx    # Template selector
│   │   ├── ConfirmModal.tsx      # Confirmation dialogs
│   │   ├── KeyboardShortcutsModal.tsx  # Shortcuts help
│   │   └── Toast.tsx             # Notification system
│   ├── data/
│   │   ├── templates.ts          # Code templates data
│   │   └── themes.ts             # Editor theme configs
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   ├── App.tsx                   # Root component
│   ├── index.tsx                 # App entry point
│   └── index.css                 # Global styles + Tailwind
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.js            # Tailwind config
└── README.md                     # Documentation
```

---

## 🤝 Contributing

Contributions make the open-source community amazing! Any contributions you make are **greatly appreciated**.

### **How to Contribute**

1. **Fork the Project**
2. **Create your Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your Changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### **Code of Conduct**

Please be respectful and constructive. We're all here to learn and build together! 💙

---

## 🗺️ Roadmap

### **Coming Soon**
- [ ] 🔐 User authentication (login/signup)
- [ ] ☁️ Cloud storage for projects
- [ ] 🔗 Share projects with unique URLs
- [ ] 👥 Real-time collaboration
- [ ] 📚 Personal code snippets library
- [ ] 🎨 More framework support (React, Vue, Svelte)
- [ ] 🌙 App-wide dark/light mode toggle
- [ ] 📦 Import from GitHub Gist
- [ ] 🔄 Export to CodePen/JSFiddle
- [ ] ⚙️ Custom keyboard shortcut configuration

Have a feature request? [Open an issue](https://github.com/bedigambar/CodeZen-Editor/issues)!

---

## 📊 Browser Support

CodeZen works on all modern browsers:

| Browser | Version |
|---------|---------|
| Chrome | ✅ Last 2 versions |
| Firefox | ✅ Last 2 versions |
| Safari | ✅ Last 2 versions |
| Edge | ✅ Last 2 versions |

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

This means you can:
- ✅ Use commercially
- ✅ Modify
- ✅ Distribute
- ✅ Use privately

---


## 🙏 Acknowledgments

Special thanks to these amazing projects and resources:

- [CodeMirror](https://codemirror.net/) - Powerful code editor component
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Font Awesome](https://fontawesome.com/) - Beautiful icon library
- [Vercel](https://vercel.com/) - Seamless deployment platform
- [React](https://reactjs.org/) - The UI library that powers CodeZen
- [TypeScript](https://www.typescriptlang.org/) - Type safety and better DX
- [Animated Fluent Emojis](https://github.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis) - Fun emoji icons

---

<div align="center">

### **Made with ❤️ by [Digambar](https://github.com/bedigambar)**

⭐ **Star this repo if you found it helpful!**

**[↑ Back to Top](#-codezen---modern-online-code-editor)**

</div>
