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

/* ─── Storage keys ─────────────────────────────────────────────────────────── */
const STORAGE_KEYS = {
  HTML:  'codezen_html',
  CSS:   'codezen_css',
  JS:    'codezen_js',
  THEME: 'codezen_theme',
};

/* ─── Types ────────────────────────────────────────────────────────────────── */
interface ConsoleLog {
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
  timestamp: string;
}

/* ─── Theme swatch colors (one per theme id, in order) ─────────────────────── */
const SWATCH_COLORS: Record<string, string> = {
  'onedark':      '#282c34',
  'vscode-dark':  '#1e1e1e',
  'dracula':      '#282a36',
  'monokai':      '#272822',
  'github-light': '#ffffff',
};

/* ─── Panel header dot color per language ───────────────────────────────────── */
const LANG_DOT: Record<string, string> = {
  html: '#e34c26',
  css:  '#264de4',
  js:   '#f7df1e',
};

/* ─── Component ────────────────────────────────────────────────────────────── */
const CodeEditor: React.FC = () => {
  const [htmlCode, setHtmlCode]         = useState<string>('');
  const [cssCode, setCssCode]           = useState<string>('');
  const [jsCode, setJsCode]             = useState<string>('');
  const [output, setOutput]             = useState<string>('');
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showTemplates, setShowTemplates]       = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen]         = useState<boolean>(false);
  const [lastSaved, setLastSaved]               = useState<string>('');
  const [showShortcuts, setShowShortcuts]       = useState<boolean>(false);
  const [currentTheme, setCurrentTheme]         = useState<string>('onedark');
  const [consoleLogs, setConsoleLogs]           = useState<ConsoleLog[]>([]);
  const [showConsole, setShowConsole]           = useState<boolean>(false);
  const [deviceMode, setDeviceMode]             = useState<DeviceMode>('fullwidth');
  const [showMobileMenu, setShowMobileMenu]     = useState<boolean>(false);
  const hasShownWelcomeRef = useRef<boolean>(false);
  const { showToast } = useToast();

  /* ── Page title SEO ────────────────────────────────────────────────────── */
  useEffect(() => {
    document.title = "CodeZen Editor — Write, Preview, and Ship Web Code";
  }, []);

  /* ── Restore from localStorage ─────────────────────────────────────────── */
  useEffect(() => {
    const savedHtml  = localStorage.getItem(STORAGE_KEYS.HTML);
    const savedCss   = localStorage.getItem(STORAGE_KEYS.CSS);
    const savedJs    = localStorage.getItem(STORAGE_KEYS.JS);
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'onedark';

    if (savedHtml) setHtmlCode(savedHtml);
    if (savedCss)  setCssCode(savedCss);
    if (savedJs)   setJsCode(savedJs);
    setCurrentTheme(savedTheme);

    if ((savedHtml || savedCss || savedJs) && !hasShownWelcomeRef.current) {
      hasShownWelcomeRef.current = true;
      setLastSaved('Restored from previous session');
      showToast('Previous session restored.', 'success', 'Welcome back');
    }
  }, [showToast]);

  /* ── Auto-save ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    const t = setTimeout(() => {
      localStorage.setItem(STORAGE_KEYS.HTML, htmlCode);
      localStorage.setItem(STORAGE_KEYS.CSS,  cssCode);
      localStorage.setItem(STORAGE_KEYS.JS,   jsCode);
      if (htmlCode || cssCode || jsCode) {
        setLastSaved(`Saved ${new Date().toLocaleTimeString()}`);
      }
    }, 1000);
    return () => clearTimeout(t);
  }, [htmlCode, cssCode, jsCode]);

  /* ── Live preview ──────────────────────────────────────────────────────── */
  useEffect(() => {
    const t = setTimeout(() => {
      const hasConsole = jsCode.includes('console.log') || jsCode.includes('console.error')
        || jsCode.includes('console.warn') || jsCode.includes('console.info');
      if (hasConsole && !showConsole) setShowConsole(true);

      const combinedCode = `
        <html>
          <head><style>${cssCode}</style></head>
          <body>
            ${htmlCode}
            <script>
              (function() {
                const originalLog   = console.log;
                const originalError = console.error;
                const originalWarn  = console.warn;
                const originalInfo  = console.info;

                function post(method, args) {
                  window.parent.postMessage({ type: 'console', method, message: args.map(a => {
                    try { return typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a); }
                    catch(e) { return String(a); }
                  }).join(' ') }, '*');
                }

                console.log   = function(...a) { originalLog.apply(console, a);   post('log',   a); };
                console.error = function(...a) { originalError.apply(console, a); post('error', a); };
                console.warn  = function(...a) { originalWarn.apply(console, a);  post('warn',  a); };
                console.info  = function(...a) { originalInfo.apply(console, a);  post('info',  a); };

                window.onerror = function(msg, src, line) {
                  window.parent.postMessage({ type: 'console', method: 'error',
                    message: \`Error: \${msg} (Line \${line})\` }, '*');
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
    return () => clearTimeout(t);
  }, [htmlCode, cssCode, jsCode, showConsole]);

  /* ── Console messages from iframe ──────────────────────────────────────── */
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data.type === 'console') {
        setConsoleLogs(prev => [...prev, {
          type: event.data.method,
          message: event.data.message,
          timestamp: new Date().toLocaleTimeString(),
        }]);
        if (!showConsole) setShowConsole(true);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [showConsole]);

  /* ── Keyboard shortcuts ─────────────────────────────────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'F11') { e.preventDefault(); setIsFullscreen(f => !f); }
      if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false);
      if (e.key === '?' || (e.ctrlKey && e.key === '/')) { e.preventDefault(); setShowShortcuts(true); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isFullscreen]);

  /* ── Handlers ───────────────────────────────────────────────────────────── */
  const copyToClipboard = (text: string, type: string) => {
    if (!text?.trim()) {
      showToast(`No ${type} code to copy.`, 'error', 'Nothing to copy');
      return;
    }
    navigator.clipboard.writeText(text).then(
      () => showToast(`${type} copied.`, 'success', 'Copied'),
      () => showToast('Copy failed.', 'error', 'Error'),
    );
  };

  const clearAll = () => {
    if (!htmlCode && !cssCode && !jsCode) {
      showToast('Nothing to clear.', 'error', 'Empty');
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmClear = () => {
    setHtmlCode(''); setCssCode(''); setJsCode(''); setConsoleLogs([]);
    localStorage.removeItem(STORAGE_KEYS.HTML);
    localStorage.removeItem(STORAGE_KEYS.CSS);
    localStorage.removeItem(STORAGE_KEYS.JS);
    setLastSaved('');
    showToast('All code cleared.', 'success', 'Cleared');
  };

  const loadTemplate = (template: { html: string; css: string; js: string; name: string }) => {
    setHtmlCode(template.html);
    setCssCode(template.css);
    setJsCode(template.js);
    setShowTemplates(false);
    showToast(`${template.name} loaded.`, 'success', 'Template loaded');
  };

  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId);
    localStorage.setItem(STORAGE_KEYS.THEME, themeId);
    showToast(`Theme: ${getThemeById(themeId).name}`, 'success', 'Theme updated');
  };

  const formatCode = () => {
    try {
      const formatHTML = (code: string) => {
        if (!code.trim()) return code;
        const selfClosing = ['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'];
        const inline      = ['a','abbr','b','bdi','bdo','cite','code','data','dfn','em','i','kbd','mark','q','s','samp','small','span','strong','sub','sup','time','u','var'];

        let formatted = code.replace(/>\s+</g, '><').trim();
        let result = ''; let indent = 0; let i = 0;

        while (i < formatted.length) {
          if (formatted[i] === '<') {
            const tagEnd = formatted.indexOf('>', i);
            if (tagEnd === -1) { result += formatted.substring(i); break; }
            const tag     = formatted.substring(i, tagEnd + 1);
            const match   = tag.match(/<\/?([a-zA-Z0-9]+)/);
            const tagName = match ? match[1].toLowerCase() : '';

            if (tag.startsWith('</'))                              { indent = Math.max(0, indent - 1); result += '\n' + '  '.repeat(indent) + tag; }
            else if (tag.endsWith('/>') || selfClosing.includes(tagName)) { result += '\n' + '  '.repeat(indent) + tag; }
            else if (inline.includes(tagName))                    { result += tag; }
            else                                                   { result += '\n' + '  '.repeat(indent) + tag; indent++; }
            i = tagEnd + 1;
          } else {
            const next = formatted.indexOf('<', i);
            if (next === -1) { const t = formatted.substring(i).trim(); if (t) result += t; break; }
            const t = formatted.substring(i, next).trim();
            if (t) result += t;
            i = next;
          }
        }
        return result.trim();
      };

      const formatCSS = (code: string) =>
        !code.trim() ? code : code
          .replace(/\s*{\s*/g, ' {\n  ').replace(/\s*}\s*/g, '\n}\n\n')
          .replace(/;\s*/g, ';\n  ').replace(/,\s*/g, ', ').trim();

      const formatJS = (code: string) =>
        !code.trim() ? code : code
          .replace(/{\s*/g, ' {\n  ').replace(/\s*}\s*/g, '\n}\n')
          .replace(/;\s*/g, ';\n  ').trim();

      let did = false;
      if (htmlCode.trim()) { setHtmlCode(formatHTML(htmlCode)); did = true; }
      if (cssCode.trim())  { setCssCode(formatCSS(cssCode));   did = true; }
      if (jsCode.trim())   { setJsCode(formatJS(jsCode));      did = true; }

      showToast(did ? 'Code formatted.' : 'Nothing to format.', did ? 'success' : 'info', did ? 'Formatted' : 'Empty');
    } catch (err) {
      console.error('Format error:', err);
      showToast('Format failed.', 'error', 'Error');
    }
  };

  const downloadFile = (type: FileType) => {
    try {
      let content = '', filename = '', mimeType = '';
      switch (type) {
        case 'html':
          if (!htmlCode?.trim()) { showToast('No HTML to download.', 'error', 'Nothing to download'); return; }
          content = htmlCode; filename = 'index.html'; mimeType = 'text/html'; break;
        case 'css':
          if (!cssCode?.trim()) { showToast('No CSS to download.', 'error', 'Nothing to download'); return; }
          content = cssCode; filename = 'style.css'; mimeType = 'text/css'; break;
        case 'js':
          if (!jsCode?.trim()) { showToast('No JS to download.', 'error', 'Nothing to download'); return; }
          content = jsCode; filename = 'script.js'; mimeType = 'text/javascript'; break;
        case 'all':
          if (!htmlCode && !cssCode && !jsCode) { showToast('Nothing to download.', 'error', 'Empty'); return; }
          content = `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>CodeZen Project</title>\n  <style>\n${cssCode || '/* No CSS */'}\n  </style>\n</head>\n<body>\n${htmlCode || '<!-- No HTML -->'}\n  <script>\n${jsCode || '// No JS'}\n  </script>\n</body>\n</html>`;
          filename = 'codezen-project.html'; mimeType = 'text/html'; break;
        default: return;
      }
      const blob = new Blob([content], { type: mimeType });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url; a.download = filename;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
      showToast(`Downloaded ${filename}.`, 'success', 'Downloaded');
    } catch (err) {
      console.error('Download error:', err);
      showToast('Download failed.', 'error', 'Error');
    }
  };

  /* ── Inline styles constants ────────────────────────────────────────────── */
  const navStyle: React.CSSProperties = {
    height: '52px',
    background: '#0f0f0f',
    borderBottom: '1px solid #1f1f1f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    position: 'sticky',
    top: 0,
    zIndex: 50,
    gap: '8px',
  };

  /* Shared style for labeled toolbar buttons */
  const tbBtn = (danger = false, active = false): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '5px 10px',
    background: active ? 'rgba(232,255,71,0.08)' : 'transparent',
    border: `1px solid ${active ? 'rgba(232,255,71,0.3)' : '#1f1f1f'}`,
    borderRadius: '3px',
    color: danger ? '#ff5555' : active ? '#e8ff47' : '#8a8a8a',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '10px',
    fontWeight: 500,
    letterSpacing: '0.04em',
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
    transition: 'color 0.15s ease, border-color 0.15s ease, background 0.15s ease',
    flexShrink: 0,
  });

  const panelStyle: React.CSSProperties = {
    background: '#111',
    border: '1px solid #2a2a2a',
    borderRadius: '4px',
    overflow: 'hidden',
  };

  const panelHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 12px',
    height: '38px',
    background: '#0f0f0f',
    borderBottom: '1px solid #1f1f1f',
  };

  /* ── Render ─────────────────────────────────────────────────────────────── */
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#0d0d0d', color: '#f2f2f2' }}
    >
      {/* ─── Toolbar / Navbar ─────────────────────────────────────────────── */}
      <nav style={navStyle}>
        {/* Left: wordmark + last-saved */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="/assets/logo.png"
              alt="CodeZen"
              style={{ height: '30px', width: 'auto' }}
            />
          </Link>

          {lastSaved && (
            <span
              className="hidden md:block"
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '10px',
                color: '#8a8a8a',
                whiteSpace: 'nowrap',
              }}
            >
              {lastSaved}
            </span>
          )}
        </div>

        {/* Center: theme swatches — desktop */}
        <div
          className="hidden xl:flex items-center gap-2"
          style={{ padding: '0 8px' }}
        >
          {themes.map((theme) => (
            <div key={theme.id} className="tooltip-wrapper">
              <button
                onClick={() => handleThemeChange(theme.id)}
                className={`theme-swatch ${currentTheme === theme.id ? 'active' : ''}`}
                style={{ background: SWATCH_COLORS[theme.id] ?? '#333' }}
              />
              <span className="tooltip">{theme.name}</span>
            </div>
          ))}
        </div>

        {/* Right: labeled action buttons — desktop */}
        <div className="hidden xl:flex items-center gap-1.5">

          <button
            onClick={formatCode}
            id="btn-format"
            style={tbBtn()}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#f2f2f2'; e.currentTarget.style.borderColor = '#3a3a3a'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#8a8a8a'; e.currentTarget.style.borderColor = '#1f1f1f'; }}
          >
            <i className="fa-solid fa-wand-magic-sparkles" style={{ fontSize: '10px' }} />
            Format
          </button>

          <button
            onClick={() => setShowTemplates(true)}
            id="btn-templates"
            style={tbBtn()}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#f2f2f2'; e.currentTarget.style.borderColor = '#3a3a3a'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#8a8a8a'; e.currentTarget.style.borderColor = '#1f1f1f'; }}
          >
            <i className="fa-solid fa-layer-group" style={{ fontSize: '10px' }} />
            Templates
          </button>

          <button
            onClick={() => setShowShortcuts(true)}
            id="btn-shortcuts"
            style={tbBtn()}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#f2f2f2'; e.currentTarget.style.borderColor = '#3a3a3a'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#8a8a8a'; e.currentTarget.style.borderColor = '#1f1f1f'; }}
          >
            <i className="fa-solid fa-keyboard" style={{ fontSize: '10px' }} />
            Shortcuts
          </button>

          <button
            onClick={() => downloadFile('all')}
            id="btn-download"
            style={tbBtn()}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#f2f2f2'; e.currentTarget.style.borderColor = '#3a3a3a'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#8a8a8a'; e.currentTarget.style.borderColor = '#1f1f1f'; }}
          >
            <i className="fa-solid fa-download" style={{ fontSize: '10px' }} />
            Download
          </button>

          <button
            onClick={() => setShowConsole(v => !v)}
            id="btn-console"
            style={tbBtn(false, showConsole)}
            onMouseEnter={(e) => { if (!showConsole) { e.currentTarget.style.color = '#f2f2f2'; e.currentTarget.style.borderColor = '#3a3a3a'; } }}
            onMouseLeave={(e) => { if (!showConsole) { e.currentTarget.style.color = '#8a8a8a'; e.currentTarget.style.borderColor = '#1f1f1f'; } }}
          >
            <i className="fa-solid fa-terminal" style={{ fontSize: '10px' }} />
            Console
          </button>

          <button
            onClick={() => setIsFullscreen(f => !f)}
            id="btn-fullscreen"
            style={tbBtn(false, isFullscreen)}
            onMouseEnter={(e) => { if (!isFullscreen) { e.currentTarget.style.color = '#f2f2f2'; e.currentTarget.style.borderColor = '#3a3a3a'; } }}
            onMouseLeave={(e) => { if (!isFullscreen) { e.currentTarget.style.color = '#8a8a8a'; e.currentTarget.style.borderColor = '#1f1f1f'; } }}
          >
            <i className={`fa-solid ${isFullscreen ? 'fa-compress' : 'fa-expand'}`} style={{ fontSize: '10px' }} />
            {isFullscreen ? 'Exit Full' : 'Fullscreen'}
          </button>

          {/* Divider before destructive action */}
          <div style={{ width: '1px', height: '18px', background: '#2a2a2a', margin: '0 2px', flexShrink: 0 }} />

          <button
            onClick={clearAll}
            id="btn-clear"
            style={tbBtn(true)}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#ff7777'; e.currentTarget.style.borderColor = '#4a1515'; e.currentTarget.style.background = '#1a0505'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#ff5555'; e.currentTarget.style.borderColor = '#1f1f1f'; e.currentTarget.style.background = 'transparent'; }}
          >
            <i className="fa-solid fa-trash-can" style={{ fontSize: '10px' }} />
            Clear
          </button>

          {/* Separator + home link */}
          <div style={{ width: '1px', height: '18px', background: '#2a2a2a', margin: '0 2px', flexShrink: 0 }} />
          <Link
            to="/"
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: '#8a8a8a',
              textDecoration: 'none',
              padding: '5px 10px',
              border: '1px solid transparent',
              borderRadius: '3px',
              transition: 'color 0.15s ease',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#f2f2f2')}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#8a8a8a')}
          >
            Home
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex xl:hidden items-center gap-1">
          {/* Theme swatches (compact) */}
          <div className="hidden sm:flex items-center gap-1.5 mr-2">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme.id)}
                className={`theme-swatch ${currentTheme === theme.id ? 'active' : ''}`}
                style={{ background: SWATCH_COLORS[theme.id] ?? '#333', width: 14, height: 14 }}
                title={theme.name}
              />
            ))}
          </div>

          {/* Download */}
          <button onClick={() => downloadFile('all')} className="toolbar-btn" title="Download">
            <i className="fa-solid fa-download" />
          </button>

          {/* Clear */}
          <button onClick={clearAll} className="toolbar-btn danger" title="Clear">
            <i className="fa-solid fa-trash-can" />
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setShowMobileMenu(v => !v)}
            className="toolbar-btn"
            title="Menu"
          >
            <i className={`fa-solid ${showMobileMenu ? 'fa-times' : 'fa-bars'}`} />
          </button>
        </div>

        {/* Mobile dropdown */}
        {showMobileMenu && (
          <div
            className="animate-scale-in xl:hidden"
            style={{
              position: 'absolute',
              top: '50px',
              right: '8px',
              width: '220px',
              background: '#111',
              border: '1px solid #2a2a2a',
              borderRadius: '6px',
              overflow: 'hidden',
              zIndex: 60,
            }}
          >
            {/* Theme swatches in mobile menu */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #1f1f1f' }}>
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#8a8a8a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Theme</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => { handleThemeChange(theme.id); setShowMobileMenu(false); }}
                    className={`theme-swatch ${currentTheme === theme.id ? 'active' : ''}`}
                    style={{ background: SWATCH_COLORS[theme.id] ?? '#333' }}
                    title={theme.name}
                  />
                ))}
              </div>
            </div>

            {[
              { icon: 'fa-wand-magic-sparkles', label: 'Format Code',       action: () => { formatCode(); setShowMobileMenu(false); } },
              { icon: 'fa-layer-group',         label: 'Templates',          action: () => { setShowTemplates(true); setShowMobileMenu(false); } },
              { icon: 'fa-terminal',            label: `${showConsole ? 'Hide' : 'Show'} Console`, action: () => { setShowConsole(v => !v); setShowMobileMenu(false); } },
              { icon: isFullscreen ? 'fa-compress' : 'fa-expand', label: isFullscreen ? 'Exit Fullscreen' : 'Fullscreen', action: () => { setIsFullscreen(f => !f); setShowMobileMenu(false); } },
            ].map(({ icon, label, action }) => (
              <button
                key={label}
                onClick={action}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 16px',
                  background: 'transparent',
                  border: 'none',
                  color: '#8a8a8a',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'color 0.15s ease, background 0.15s ease',
                  borderBottom: '1px solid #1a1a1a',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#f2f2f2'; (e.currentTarget as HTMLButtonElement).style.background = '#1a1a1a'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#8a8a8a'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
              >
                <i className={`fa-solid ${icon}`} style={{ width: 14, textAlign: 'center' }} />
                {label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* ─── Main content ─────────────────────────────────────────────────── */}
      <main
        className={`flex-1 flex flex-col ${isFullscreen ? 'fixed inset-0 z-40 overflow-y-auto' : ''}`}
        style={{ background: '#0d0d0d', padding: '16px' }}
      >
        {/* Page heading */}
        <div style={{ marginBottom: '16px' }}>
          <h1
            style={{
              fontFamily: 'Syne, system-ui, sans-serif',
              fontSize: '20px',
              fontWeight: 700,
              color: '#f2f2f2',
              letterSpacing: '-0.02em',
            }}
          >
            Editor
          </h1>
          <p
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              color: '#8a8a8a',
              marginTop: '2px',
            }}
          >
            Write code, see results instantly.
          </p>
        </div>

        {/* Download all — compact strip */}
        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => downloadFile('all')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 16px',
              border: '1px solid #2a2a2a',
              background: 'transparent',
              color: '#5a5a5a',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              fontWeight: 500,
              cursor: 'pointer',
              borderRadius: '3px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              transition: 'color 0.15s ease, border-color 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#f2f2f2'; e.currentTarget.style.borderColor = '#5a5a5a'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#5a5a5a'; e.currentTarget.style.borderColor = '#2a2a2a'; }}
          >
            <i className="fa-solid fa-download" style={{ fontSize: '10px' }} />
            Download project
          </button>
        </div>

        {/* ── Code panels ─────────────────────────────────────────────────── */}
        <div className="w-full max-w-[95%] xl:max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">

            {/* HTML */}
            <div style={panelStyle}>
              <div style={panelHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: LANG_DOT.html, display: 'inline-block', flexShrink: 0 }} />
                  <span className="editor-tab active">HTML</span>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div className="tooltip-wrapper">
                    <button
                      onClick={() => copyToClipboard(htmlCode, 'HTML')}
                      className="toolbar-btn"
                      style={{ width: 26, height: 26 }}
                    >
                      <i className="fa-regular fa-copy" style={{ fontSize: '11px' }} />
                    </button>
                    <span className="tooltip">Copy HTML</span>
                  </div>
                  <div className="tooltip-wrapper">
                    <button
                      onClick={() => downloadFile('html')}
                      className="toolbar-btn"
                      style={{ width: 26, height: 26 }}
                    >
                      <i className="fa-solid fa-download" style={{ fontSize: '11px' }} />
                    </button>
                    <span className="tooltip">Download HTML</span>
                  </div>
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

            {/* CSS */}
            <div style={panelStyle}>
              <div style={panelHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: LANG_DOT.css, display: 'inline-block', flexShrink: 0 }} />
                  <span className="editor-tab active">CSS</span>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div className="tooltip-wrapper">
                    <button
                      onClick={() => copyToClipboard(cssCode, 'CSS')}
                      className="toolbar-btn"
                      style={{ width: 26, height: 26 }}
                    >
                      <i className="fa-regular fa-copy" style={{ fontSize: '11px' }} />
                    </button>
                    <span className="tooltip">Copy CSS</span>
                  </div>
                  <div className="tooltip-wrapper">
                    <button
                      onClick={() => downloadFile('css')}
                      className="toolbar-btn"
                      style={{ width: 26, height: 26 }}
                    >
                      <i className="fa-solid fa-download" style={{ fontSize: '11px' }} />
                    </button>
                    <span className="tooltip">Download CSS</span>
                  </div>
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

            {/* JavaScript */}
            <div style={panelStyle}>
              <div style={panelHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: LANG_DOT.js, display: 'inline-block', flexShrink: 0 }} />
                  <span className="editor-tab active">JS</span>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div className="tooltip-wrapper">
                    <button
                      onClick={() => copyToClipboard(jsCode, 'JavaScript')}
                      className="toolbar-btn"
                      style={{ width: 26, height: 26 }}
                    >
                      <i className="fa-regular fa-copy" style={{ fontSize: '11px' }} />
                    </button>
                    <span className="tooltip">Copy JS</span>
                  </div>
                  <div className="tooltip-wrapper">
                    <button
                      onClick={() => downloadFile('js')}
                      className="toolbar-btn"
                      style={{ width: 26, height: 26 }}
                    >
                      <i className="fa-solid fa-download" style={{ fontSize: '11px' }} />
                    </button>
                    <span className="tooltip">Download JS</span>
                  </div>
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
            onToggle={() => setShowConsole(v => !v)}
            onClear={() => setConsoleLogs([])}
          />
        </div>
      </main>

      {/* ─── Footer ─────────────────────────────────────────────────────── */}
      <footer
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          height: '44px',
          borderTop: '1px solid #1a1a1a',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '11px',
          color: '#8a8a8a',
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="/assets/logo.png"
            alt="CodeZen"
            style={{ height: '22px', width: 'auto', opacity: 0.5, transition: 'opacity 0.15s ease' }}
            onMouseEnter={(e) => ((e.target as HTMLImageElement).style.opacity = '1')}
            onMouseLeave={(e) => ((e.target as HTMLImageElement).style.opacity = '0.5')}
          />
        </Link>

        <div style={{ display: 'flex', gap: '16px' }}>
          {[
            { href: 'https://github.com/bedigambar', icon: 'fa-github', title: 'GitHub' },
            { href: 'https://www.linkedin.com/in/digambar-behera', icon: 'fa-linkedin', title: 'LinkedIn' },
            { href: 'https://x.com/digambarcodes', icon: 'fa-x-twitter', title: 'X' },
          ].map(({ href, icon, title }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              title={title}
              style={{ color: '#8a8a8a', fontSize: '14px', transition: 'color 0.15s ease' }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#f2f2f2')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#8a8a8a')}
            >
              <i className={`fa-brands ${icon}`} />
            </a>
          ))}
        </div>

        <span>© {new Date().getFullYear()}</span>
      </footer>

      {/* ─── Modals ──────────────────────────────────────────────────────── */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmClear}
        title="Clear All Code?"
        message="Are you sure you want to clear all HTML, CSS, and JavaScript? This cannot be undone."
        confirmText="Clear All"
        cancelText="Cancel"
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