import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { useToast } from './Toast';
import ConfirmModal from './ConfirmModal';
import TemplatesModal from './TemplatesModal';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';
import ConsoleOutput from './ConsoleOutput';
import ResponsivePreview, { DeviceMode } from './ResponsivePreview';
import { Template } from '../data/templates';
import { themes, getThemeById } from '../data/themes';
import { FileType } from '../types';

const STORAGE_KEYS = {
  HTML: 'codezen_html',
  CSS: 'codezen_css',
  JS: 'codezen_js',
  THEME: 'codezen_theme',
};

interface ConsoleLog {
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
  timestamp: string;
}

const CodeEditor: React.FC = () => {
  const [htmlCode, setHtmlCode] = useState<string>('');
  const [cssCode, setCssCode] = useState<string>('');
  const [jsCode, setJsCode] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showTemplates, setShowTemplates] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<string>('');
  const [showShortcuts, setShowShortcuts] = useState<boolean>(false);
  const [currentTheme, setCurrentTheme] = useState<string>('onedark');
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([]);
  const [showConsole, setShowConsole] = useState<boolean>(false);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('fullwidth');
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const hasShownWelcomeRef = useRef<boolean>(false);
  const { showToast } = useToast();

  useEffect(() => {
    const savedHtml = localStorage.getItem(STORAGE_KEYS.HTML);
    const savedCss = localStorage.getItem(STORAGE_KEYS.CSS);
    const savedJs = localStorage.getItem(STORAGE_KEYS.JS);
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'onedark';

    if (savedHtml) setHtmlCode(savedHtml);
    if (savedCss) setCssCode(savedCss);
    if (savedJs) setJsCode(savedJs);
    setCurrentTheme(savedTheme);

    if ((savedHtml || savedCss || savedJs) && !hasShownWelcomeRef.current) {
      hasShownWelcomeRef.current = true;
      setLastSaved('Restored from previous session');
      showToast('Previous session restored successfully!', 'success', 'Welcome Back! 👋');
    }
  }, [showToast]);

  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      localStorage.setItem(STORAGE_KEYS.HTML, htmlCode);
      localStorage.setItem(STORAGE_KEYS.CSS, cssCode);
      localStorage.setItem(STORAGE_KEYS.JS, jsCode);

      if (htmlCode || cssCode || jsCode) {
        const now = new Date().toLocaleTimeString();
        setLastSaved(`Auto-saved at ${now}`);
      }
    }, 1000);

    return () => clearTimeout(saveTimeout);
  }, [htmlCode, cssCode, jsCode]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const hasConsoleUsage = jsCode.includes('console.log') ||
        jsCode.includes('console.error') ||
        jsCode.includes('console.warn') ||
        jsCode.includes('console.info');
      if (hasConsoleUsage && !showConsole) {
        setShowConsole(true);
      }

      const combinedCode = `
        <html>
          <head>
            <style>${cssCode}</style>
          </head>
          <body>
            ${htmlCode}
            <script>
              (function() {
                const originalLog = console.log;
                const originalError = console.error;
                const originalWarn = console.warn;
                const originalInfo = console.info;

                console.log = function(...args) {
                  originalLog.apply(console, args);
                  window.parent.postMessage({
                    type: 'console',
                    method: 'log',
                    message: args.map(arg => {
                      try {
                        return typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg);
                      } catch (e) {
                        return String(arg);
                      }
                    }).join(' ')
                  }, '*');
                };

                console.error = function(...args) {
                  originalError.apply(console, args);
                  window.parent.postMessage({
                    type: 'console',
                    method: 'error',
                    message: args.map(arg => String(arg)).join(' ')
                  }, '*');
                };

                console.warn = function(...args) {
                  originalWarn.apply(console, args);
                  window.parent.postMessage({
                    type: 'console',
                    method: 'warn',
                    message: args.map(arg => String(arg)).join(' ')
                  }, '*');
                };

                console.info = function(...args) {
                  originalInfo.apply(console, args);
                  window.parent.postMessage({
                    type: 'console',
                    method: 'info',
                    message: args.map(arg => String(arg)).join(' ')
                  }, '*');
                };

                window.onerror = function(message, source, lineno, colno, error) {
                  window.parent.postMessage({
                    type: 'console',
                    method: 'error',
                    message: \`Error: \${message} (Line \${lineno})\`
                  }, '*');
                  return false;
                };
              })();

              ${jsCode}
            </script>
          </body>
        </html>
      `;
      setOutput(combinedCode);
    }, 250);

    return () => clearTimeout(timeout);
  }, [htmlCode, cssCode, jsCode, showConsole]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'console') {
        const newLog: ConsoleLog = {
          type: event.data.method,
          message: event.data.message,
          timestamp: new Date().toLocaleTimeString()
        };
        setConsoleLogs(prev => [...prev, newLog]);

        if (!showConsole) {
          setShowConsole(true);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [showConsole]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        e.preventDefault();
        setIsFullscreen(!isFullscreen);
      }
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
      if (e.key === '?' || (e.ctrlKey && e.key === '/')) {
        e.preventDefault();
        setShowShortcuts(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFullscreen]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        showToast(`${type} code copied successfully!`, 'success', 'Copied!');
      },
      () => {
        showToast('Failed to copy code to clipboard', 'error', 'Copy Failed');
      }
    );
  };

  const clearAll = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmClear = () => {
    setHtmlCode('');
    setCssCode('');
    setJsCode('');
    setConsoleLogs([]);
    localStorage.removeItem(STORAGE_KEYS.HTML);
    localStorage.removeItem(STORAGE_KEYS.CSS);
    localStorage.removeItem(STORAGE_KEYS.JS);
    setLastSaved('');
    showToast('All code has been cleared successfully! Ready for a fresh start.', 'success', 'Cleared! ✨');
  };

  const loadTemplate = (template: { html: string; css: string; js: string; name: string }) => {
    setHtmlCode(template.html);
    setCssCode(template.css);
    setJsCode(template.js);
    setShowTemplates(false);
    showToast(`${template.name} template loaded successfully!`, 'success', 'Template Loaded! 🎨');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId);
    localStorage.setItem(STORAGE_KEYS.THEME, themeId);
    showToast(`Theme changed to ${getThemeById(themeId).name}!`, 'success', 'Theme Updated! 🎨');
  };

  const formatCode = () => {
    try {
      const formatHTML = (code: string) => {
        if (!code.trim()) return code;

        let formatted = code.replace(/>\s+</g, '><').trim();

        const selfClosingTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
        const inlineTags = ['a', 'abbr', 'b', 'bdi', 'bdo', 'cite', 'code', 'data', 'dfn', 'em', 'i', 'kbd', 'mark', 'q', 's', 'samp', 'small', 'span', 'strong', 'sub', 'sup', 'time', 'u', 'var'];

        let result = '';
        let indent = 0;
        let i = 0;

        while (i < formatted.length) {
          if (formatted[i] === '<') {
            let tagEnd = formatted.indexOf('>', i);
            if (tagEnd === -1) {
              result += formatted.substring(i);
              break;
            }

            let tag = formatted.substring(i, tagEnd + 1);
            let tagName = tag.match(/<\/?([a-zA-Z0-9]+)/);
            let tagNameStr = tagName ? tagName[1].toLowerCase() : '';

            if (tag.startsWith('</')) {
              indent = Math.max(0, indent - 1);
              result += '\n' + '  '.repeat(indent) + tag;
            }
            else if (tag.endsWith('/>') || selfClosingTags.includes(tagNameStr)) {
              result += '\n' + '  '.repeat(indent) + tag;
            }
            else if (inlineTags.includes(tagNameStr)) {
              result += tag;
            }
            else {
              result += '\n' + '  '.repeat(indent) + tag;
              indent++;
            }

            i = tagEnd + 1;
          } else {

            let nextTag = formatted.indexOf('<', i);
            if (nextTag === -1) {
              let text = formatted.substring(i).trim();
              if (text) result += text;
              break;
            }

            let text = formatted.substring(i, nextTag).trim();
            if (text) {
              if (!result.endsWith('>')) {
                result += text;
              } else {
                result += text;
              }
            }
            i = nextTag;
          }
        }

        return result.trim();
      };

      const formatCSS = (code: string) => {
        if (!code.trim()) return code;

        let formatted = code
          .replace(/\s*{\s*/g, ' {\n  ')
          .replace(/\s*}\s*/g, '\n}\n\n')
          .replace(/;\s*/g, ';\n  ')
          .replace(/,\s*/g, ', ')
          .trim();

        return formatted;
      };

      const formatJS = (code: string) => {
        if (!code.trim()) return code;

        let formatted = code
          .replace(/{\s*/g, ' {\n  ')
          .replace(/\s*}\s*/g, '\n}\n')
          .replace(/;\s*/g, ';\n  ')
          .trim();

        return formatted;
      };

      let formatted = false;
      if (htmlCode.trim()) {
        setHtmlCode(formatHTML(htmlCode));
        formatted = true;
      }
      if (cssCode.trim()) {
        setCssCode(formatCSS(cssCode));
        formatted = true;
      }
      if (jsCode.trim()) {
        setJsCode(formatJS(jsCode));
        formatted = true;
      }

      if (formatted) {
        showToast('Code formatted successfully!', 'success', 'Formatted! ✨');
      } else {
        showToast('No code to format', 'info', 'Empty');
      }
    } catch (error) {
      console.error('Format error:', error);
      showToast('Error formatting code', 'error', 'Format Failed');
    }
  };

  const clearConsole = () => {
    setConsoleLogs([]);
  };

  const toggleConsole = () => {
    setShowConsole(!showConsole);
  };

  const downloadFile = (type: FileType) => {
    try {
      let content = '';
      let filename = '';
      let mimeType = '';

      switch (type) {
        case 'html':
          content = htmlCode;
          filename = 'index.html';
          mimeType = 'text/html';
          break;
        case 'css':
          content = cssCode;
          filename = 'style.css';
          mimeType = 'text/css';
          break;
        case 'js':
          content = jsCode;
          filename = 'script.js';
          mimeType = 'text/javascript';
          break;
        case 'all':
          content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodeZen Project</title>
    <style>
${cssCode || '/* No CSS code provided */'}
    </style>
</head>
<body>
${htmlCode || '<!-- No HTML code provided -->'}
    <script>
${jsCode || '// No JavaScript code provided'}
    </script>
</body>
</html>`;
          filename = 'codezen-project.html';
          mimeType = 'text/html';
          break;
        default:
          return;
      }

      const blob = new Blob([content], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      const fileType = type === 'all' ? 'complete project' : `${type.toUpperCase()} file`;
      showToast(`Your ${fileType} has been downloaded successfully!`, 'success', 'Downloaded!');
    } catch (error) {
      console.error('Error downloading file:', error);
      showToast('Error downloading file. Please try again.', 'error', 'Download Failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-custom">
      <nav className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between animate-slide-in border-b border-white/10 relative">
        <div className="flex items-center gap-3">
          <Link to="/">
            <img
              src="/assets/logo.png"
              alt="CodeZen Logo"
              className="h-8 sm:h-10 md:h-12 w-auto hover:scale-105 transition-transform duration-200"
            />
          </Link>
          {lastSaved && (
            <span className="hidden md:flex items-center gap-2 text-xs text-green-300 bg-green-500/20 px-3 py-1.5 rounded-full">
              <i className="fa-solid fa-check-circle"></i>
              {lastSaved}
            </span>
          )}
        </div>

        <div className="hidden xl:flex items-center gap-3">
          <div className="relative group">
            <select
              value={currentTheme}
              onChange={(e) => handleThemeChange(e.target.value)}
              className="appearance-none px-3 py-2 pr-8 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 backdrop-blur-sm text-white text-sm font-semibold rounded-lg transition-all duration-200 border border-indigo-400/30 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 cursor-pointer shadow-lg hover:shadow-purple-500/25 hover:scale-105"
              title="Change Editor Theme"
              style={{ backgroundImage: 'none', colorScheme: 'dark' }}
            >
              {themes.map((theme) => (
                <option
                  key={theme.id}
                  value={theme.id}
                  className="bg-gray-900 text-white py-2"
                  style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}
                >
                  {theme.isDark ? '🌙' : '☀️'} {theme.name}
                </option>
              ))}
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              <i className="fa-solid fa-palette text-white/70 text-sm"></i>
            </div>
          </div>

          <button onClick={formatCode} className="px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 backdrop-blur-sm text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:scale-105 flex items-center gap-2" title="Format Code">
            <i className="fa-solid fa-wand-magic-sparkles"></i>
            <span>FORMAT</span>
          </button>

          <button onClick={() => setShowShortcuts(true)} className="px-3 py-2 bg-pink-500/20 hover:bg-pink-500/30 backdrop-blur-sm text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:scale-105 flex items-center gap-2" title="Keyboard Shortcuts">
            <i className="fa-solid fa-keyboard"></i>
            <span>SHORTCUTS</span>
          </button>

          <button onClick={() => setShowTemplates(true)} className="px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 backdrop-blur-sm text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:scale-105 flex items-center gap-2" title="Load Template">
            <i className="fa-solid fa-layer-group"></i>
            <span>TEMPLATES</span>
          </button>

          <button onClick={toggleFullscreen} className="px-3 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 backdrop-blur-sm text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:scale-105 flex items-center gap-2" title="Toggle Fullscreen (F11)">
            <i className={`fa-solid ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
            <span>{isFullscreen ? 'EXIT' : 'FULLSCREEN'}</span>
          </button>

          <button onClick={clearAll} className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:scale-105 flex items-center gap-2">
            <i className="fa-solid fa-trash-can"></i>
            <span>CLEAR</span>
          </button>

          <Link to="/" className="px-6 py-2 bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 hover:from-purple-700 hover:via-violet-700 hover:to-fuchsia-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:scale-105 shadow-lg shadow-purple-500/50">
            Go Home
          </Link>
        </div>

        <div className="flex xl:hidden items-center gap-2">
          <div className="relative group">
            <select
              value={currentTheme}
              onChange={(e) => handleThemeChange(e.target.value)}
              className="appearance-none px-2 py-2 pr-7 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 backdrop-blur-sm text-white text-xs font-semibold rounded-lg transition-all duration-200 border border-indigo-400/30 focus:outline-none focus:border-purple-400 cursor-pointer"
              title="Change Editor Theme"
              style={{ backgroundImage: 'none', colorScheme: 'dark' }}
            >
              {themes.map((theme) => (
                <option
                  key={theme.id}
                  value={theme.id}
                  className="bg-gray-900 text-white"
                  style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}
                >
                  {theme.isDark ? '🌙' : '☀️'} {theme.name}
                </option>
              ))}
            </select>
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <i className="fa-solid fa-palette text-white/70 text-xs"></i>
            </div>
          </div>

          <button onClick={clearAll} className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm text-white text-xs font-semibold rounded-lg transition-all duration-200 hover:scale-105" title="Clear All">
            <i className="fa-solid fa-trash-can"></i>
          </button>

          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 backdrop-blur-sm text-white text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105"
            title="Menu"
          >
            <i className={`fa-solid ${showMobileMenu ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>

        {showMobileMenu && (
          <div className="absolute top-full right-0 mt-2 mr-3 sm:mr-4 w-64 bg-gray-900/95 backdrop-blur-lg rounded-lg shadow-2xl border border-white/10 py-2 z-50 animate-scale-in xl:hidden">
            <button onClick={() => { formatCode(); setShowMobileMenu(false); }} className="w-full px-4 py-3 text-left text-white hover:bg-purple-500/20 transition-colors flex items-center gap-3">
              <i className="fa-solid fa-wand-magic-sparkles text-purple-400"></i>
              <span>Format Code</span>
            </button>

            <button onClick={() => { setShowShortcuts(true); setShowMobileMenu(false); }} className="w-full px-4 py-3 text-left text-white hover:bg-pink-500/20 transition-colors flex items-center gap-3">
              <i className="fa-solid fa-keyboard text-pink-400"></i>
              <span>Keyboard Shortcuts</span>
            </button>

            <button onClick={() => { setShowTemplates(true); setShowMobileMenu(false); }} className="w-full px-4 py-3 text-left text-white hover:bg-purple-500/20 transition-colors flex items-center gap-3">
              <i className="fa-solid fa-layer-group text-purple-400"></i>
              <span>Templates</span>
            </button>

            <button onClick={() => { toggleFullscreen(); setShowMobileMenu(false); }} className="w-full px-4 py-3 text-left text-white hover:bg-indigo-500/20 transition-colors flex items-center gap-3">
              <i className={`fa-solid ${isFullscreen ? 'fa-compress' : 'fa-expand'} text-indigo-400`}></i>
              <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Mode'}</span>
            </button>

            <div className="border-t border-white/10 my-2"></div>

            <Link to="/" onClick={() => setShowMobileMenu(false)} className="w-full px-4 py-3 text-left text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-fuchsia-600/20 transition-colors flex items-center gap-3">
              <i className="fa-solid fa-home text-fuchsia-400"></i>
              <span>Go Home</span>
            </Link>
          </div>
        )}
      </nav>

      <main className={`flex-1 flex flex-col items-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-fade-in ${isFullscreen ? 'fixed inset-0 z-40 bg-gradient-custom pt-20 overflow-y-auto' : ''}`}>
        <h1 className="text-5xl xs:text-6xl sm:text-7xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-5 text-center w-full max-w-full px-2">
          <span className="inline-block relative animate-float">
            <span className="relative z-10 bg-gradient-to-r from-white via-purple-300 to-pink-300 text-transparent bg-clip-text animate-gradient-shift">
              Build Something Amazing!
            </span>
          </span>
        </h1>
        <p className="text-base sm:text-lg md:text-lg text-gray-200 mb-2 text-center max-w-3xl animate-text-line-2 px-2">
          Write code, see results instantly. It's that simple. Choose a template or start from scratch.
        </p>
        <p className="text-sm sm:text-base md:text-base text-gray-300 mb-6 text-center max-w-2xl animate-text-line-2 px-2">
          Export files individually or download your complete project with one click.
        </p>
        
        <div className="mb-6">
          <button
            onClick={() => downloadFile('all')}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 hover:from-purple-700 hover:via-violet-700 hover:to-fuchsia-700 text-white font-bold rounded-lg transition-all duration-200 hover:scale-105 shadow-lg shadow-purple-500/50 flex items-center gap-2"
          >
            <i className="fa-solid fa-download"></i> Download Complete Project
          </button>
        </div>

        <div className="w-full max-w-[95%] xl:max-w-[1600px]">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg overflow-hidden shadow-xl">
              <div className="flex items-center justify-between px-3 sm:px-4 py-3 bg-gray-800/50 border-b border-gray-700">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <img
                    src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Desktop%20Computer.png"
                    alt="Desktop"
                    width="20"
                    height="20"
                  />
                  <span>HTML</span>
                </div>
                <div className="flex gap-1 sm:gap-2">
                  <button
                    onClick={() => copyToClipboard(htmlCode, 'HTML')}
                    className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors flex items-center gap-1"
                    title="Copy HTML"
                  >
                    <i className="fa-regular fa-copy"></i>
                    <span className="hidden lg:inline">Copy</span>
                  </button>
                  <button
                    onClick={() => downloadFile('html')}
                    className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm bg-green-500 hover:bg-green-600 text-white rounded transition-colors flex items-center gap-1"
                    title="Download HTML"
                  >
                    <i className="fa-solid fa-download"></i>
                    <span className="hidden lg:inline">Download</span>
                  </button>
                </div>
              </div>
              <CodeMirror
                value={htmlCode}
                height="18rem"
                theme={getThemeById(currentTheme).theme}
                extensions={[html()]}
                onChange={(value) => setHtmlCode(value)}
                className="text-xs sm:text-sm"
              />
            </div>

            <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg overflow-hidden shadow-xl">
              <div className="flex items-center justify-between px-3 sm:px-4 py-3 bg-gray-800/50 border-b border-gray-700">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <img
                    src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People%20with%20professions/Artist%20Light%20Skin%20Tone.png"
                    alt="Artist"
                    width="20"
                    height="20"
                  />
                  <span>CSS</span>
                </div>
                <div className="flex gap-1 sm:gap-2">
                  <button
                    onClick={() => copyToClipboard(cssCode, 'CSS')}
                    className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors flex items-center gap-1"
                    title="Copy CSS"
                  >
                    <i className="fa-regular fa-copy"></i>
                    <span className="hidden lg:inline">Copy</span>
                  </button>
                  <button
                    onClick={() => downloadFile('css')}
                    className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm bg-green-500 hover:bg-green-600 text-white rounded transition-colors flex items-center gap-1"
                    title="Download CSS"
                  >
                    <i className="fa-solid fa-download"></i>
                    <span className="hidden lg:inline">Download</span>
                  </button>
                </div>
              </div>
              <CodeMirror
                value={cssCode}
                height="18rem"
                theme={getThemeById(currentTheme).theme}
                extensions={[css()]}
                onChange={(value) => setCssCode(value)}
                className="text-xs sm:text-sm"
              />
            </div>

            <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg overflow-hidden shadow-xl">
              <div className="flex items-center justify-between px-3 sm:px-4 py-3 bg-gray-800/50 border-b border-gray-700">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <img
                    src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Camera%20with%20Flash.png"
                    alt="Camera"
                    width="20"
                    height="20"
                  />
                  <span>JavaScript</span>
                </div>
                <div className="flex gap-1 sm:gap-2">
                  <button
                    onClick={() => copyToClipboard(jsCode, 'JavaScript')}
                    className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors flex items-center gap-1"
                    title="Copy JavaScript"
                  >
                    <i className="fa-regular fa-copy"></i>
                    <span className="hidden lg:inline">Copy</span>
                  </button>
                  <button
                    onClick={() => downloadFile('js')}
                    className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm bg-green-500 hover:bg-green-600 text-white rounded transition-colors flex items-center gap-1"
                    title="Download JavaScript"
                  >
                    <i className="fa-solid fa-download"></i>
                    <span className="hidden lg:inline">Download</span>
                  </button>
                </div>
              </div>
              <CodeMirror
                value={jsCode}
                height="18rem"
                theme={getThemeById(currentTheme).theme}
                extensions={[javascript()]}
                onChange={(value) => setJsCode(value)}
                className="text-xs sm:text-sm"
              />
            </div>
          </div>

          <ResponsivePreview
            deviceMode={deviceMode}
            onDeviceModeChange={setDeviceMode}
            output={output}
          />

          <ConsoleOutput
            logs={consoleLogs}
            isVisible={showConsole}
            onToggle={toggleConsole}
            onClear={clearConsole}
          />
        </div>
      </main>

      <footer className="w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/10 mt-8">
        <div className="logo order-1 md:order-1">
          <Link to="/">
            <img
              src="/assets/logo.png"
              alt="CodeZen Logo"
              className="h-7 sm:h-10 w-auto opacity-80 hover:opacity-100 transition-opacity"
            />
          </Link>
        </div>

        <div className="flex items-center gap-5 sm:gap-6 md:gap-8 order-2 md:order-3">
          <a
            href="https://github.com/bedigambar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-primary-400 transition-all duration-200 text-xl sm:text-2xl md:text-2xl lg:text-3xl hover:scale-110"
          >
            <i className="fa-brands fa-github"></i>
          </a>
          <a
            href="https://www.linkedin.com/in/digambar-behera"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-primary-400 transition-all duration-200 text-xl sm:text-2xl md:text-2xl lg:text-3xl hover:scale-110"
          >
            <i className="fa-brands fa-linkedin"></i>
          </a>
          <a
            href="https://x.com/digambarcodes"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-primary-400 transition-all duration-200 text-xl sm:text-2xl md:text-2xl lg:text-3xl hover:scale-110"
          >
            <i className="fa-brands fa-x-twitter"></i>
          </a>
        </div>

        <div className="text-gray-300 text-center text-xs sm:text-base order-3 md:order-2">
          <p>Made with ❤️, by Digambar</p>
        </div>
      </footer>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmClear}
        title="Clear All Code?"
        message="Are you sure you want to clear all code? This will remove all HTML, CSS, and JavaScript code. This action cannot be undone."
        confirmText="Clear All"
        cancelText="Cancel"
        icon="🗑️"
      />

      <TemplatesModal
        isOpen={showTemplates}
        onClose={() => setShowTemplates(false)}
        onSelectTemplate={(template: Template) => loadTemplate(template)}
      />

      <KeyboardShortcutsModal
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </div>
  );
};

export default CodeEditor;