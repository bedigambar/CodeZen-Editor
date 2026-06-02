import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { useToast } from './Toast';
import ConfirmModal from './ConfirmModal';
import TemplatesModal from './TemplatesModal';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';
import ConsoleOutput, { ConsoleLog } from './ConsoleOutput';
import { EditorView, Decoration } from '@codemirror/view';
import ResponsivePreview, { DeviceMode } from './ResponsivePreview';
import CommandPalette, { PaletteCommand } from './CommandPalette';
import SnapshotManager, { Snapshot } from './SnapshotManager';
import { Template } from '../data/templates';
import { themes, getThemeById } from '../data/themes';
import { FileType } from '../types';

const STORAGE_KEYS = {
  HTML:      'codezen_html',
  CSS:       'codezen_css',
  JS:        'codezen_js',
  THEME:     'codezen_theme',
  SNAPSHOTS: 'codezen_snapshots',
};

const SWATCH_COLORS: Record<string, string> = {
  'onedark':      '#282c34',
  'vscode-dark':  '#1e1e1e',
  'dracula':      '#282a36',
  'monokai':      '#272822',
  'github-light': '#ffffff',
};

const LANG_DOT: Record<string, string> = {
  html: '#e34c26',
  css:  '#264de4',
  js:   '#f7df1e',
};

type ZenPanel = 'html' | 'css' | 'js';

const CodeEditor: React.FC = () => {
  const [htmlCode, setHtmlCode]         = useState<string>('');
  const [cssCode, setCssCode]           = useState<string>('');
  const [jsCode, setJsCode]             = useState<string>('');
  const [output, setOutput]             = useState<string>('');
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showTemplates, setShowTemplates]       = useState<boolean>(false);
  const [lastSaved, setLastSaved]               = useState<string>('');
  const [showShortcuts, setShowShortcuts]       = useState<boolean>(false);
  const [currentTheme, setCurrentTheme]         = useState<string>('onedark');
  const [consoleLogs, setConsoleLogs]           = useState<ConsoleLog[]>([]);
  const [errorLine, setErrorLine]               = useState<number | null>(null);
  const [showConsole, setShowConsole]           = useState<boolean>(false);
  const [userClosedConsole, setUserClosedConsole] = useState<boolean>(false);
  const [showMobileMenu, setShowMobileMenu]     = useState<boolean>(false);
  const [deviceMode, setDeviceMode]             = useState<DeviceMode>('fullwidth');

  const [isZenMode, setIsZenMode]       = useState<boolean>(false);
  const [zenPanel, setZenPanel]         = useState<ZenPanel>('html');

  const [focusLocked, setFocusLocked]     = useState<boolean>(false);
  const [activePanel, setActivePanel]     = useState<ZenPanel>('html');
  const idleTimerRef                      = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [showPalette, setShowPalette]     = useState<boolean>(false);
  const [showSnapshots, setShowSnapshots] = useState<boolean>(false);
  const [snapshots, setSnapshots]         = useState<Snapshot[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SNAPSHOTS);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const hasShownWelcomeRef = useRef<boolean>(false);
  const { showToast } = useToast();

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (focusLocked) setFocusLocked(false);
    idleTimerRef.current = setTimeout(() => setFocusLocked(true), 3000);
  }, [focusLocked]);

  const onMouseMove = useCallback(() => {
    if (focusLocked) {
      setFocusLocked(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => setFocusLocked(true), 3000);
    }
  }, [focusLocked]);

  const errorLineExtension = useMemo(() => {
    if (!errorLine) return [];
    return [
      EditorView.decorations.of((view) => {
        try {
          const line = view.state.doc.line(errorLine);
          return Decoration.set([
            Decoration.line({ class: 'cm-error-line' }).range(line.from)
          ]);
        } catch (e) {
          return Decoration.none;
        }
      })
    ];
  }, [errorLine]);

  useEffect(() => {
    resetIdleTimer();
    return () => { if (idleTimerRef.current) clearTimeout(idleTimerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [htmlCode, cssCode, jsCode]);

  useEffect(() => {
    document.title = 'CodeZen Editor — Write, Preview, and Ship Web Code';
  }, []);

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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SNAPSHOTS, JSON.stringify(snapshots));
  }, [snapshots]);

  useEffect(() => {
    const t = setTimeout(() => {
      setErrorLine(null);
      const hasConsole = jsCode.includes('console.log') || jsCode.includes('console.error')
        || jsCode.includes('console.warn') || jsCode.includes('console.info');
      if (hasConsole && !showConsole && !userClosedConsole) setShowConsole(true);

      const combinedCode = `
        <html>
          <head><style>${cssCode}</style></head>
          <body>
            ${htmlCode}
            <script>
              (function() {
                const startTime = performance.now();
                const originalLog   = console.log;
                const originalError = console.error;
                const originalWarn  = console.warn;
                const originalInfo  = console.info;

                function tokenise(v, depth = 0) {
                  if (depth > 5) return { t: 'trunc' };
                  if (v === null) return { t: 'null' };
                  if (v === undefined) return { t: 'undefined' };
                  if (typeof v === 'function') return { t: 'fn', name: v.name || 'ƒ' };
                  if (typeof v !== 'object') return { t: typeof v, v: String(v) };
                  if (Array.isArray(v)) {
                    return { t: 'array', len: v.length, items: v.map(function(i) { return tokenise(i, depth + 1); }) };
                  }
                  try {
                    const keys = Object.keys(v);
                    const props = {};
                    for (var i = 0; i < keys.length; i++) {
                      var k = keys[i];
                      props[k] = tokenise(v[k], depth + 1);
                    }
                    return { t: 'object', keys, props };
                  } catch(e) {
                    return { t: 'object', keys: [], props: {} };
                  }
                }

                function post(method, args) {
                  const elapsed = performance.now() - startTime;
                  const tokenised = args.map(function(a) { return tokenise(a); });
                  window.parent.postMessage({
                    type: 'console',
                    method,
                    args: tokenised,
                    elapsed
                  }, '*');
                }

                console.log   = function(...a) { originalLog.apply(console, a);   post('log',   a); };
                console.error = function(...a) { originalError.apply(console, a); post('error', a); };
                console.warn  = function(...a) { originalWarn.apply(console, a);  post('warn',  a); };
                console.info  = function(...a) { originalInfo.apply(console, a);  post('info',  a); };

                window.onerror = function(msg, src, line) {
                  const elapsed = performance.now() - startTime;
                  window.parent.postMessage({
                    type: 'console',
                    method: 'error',
                    args: [{ t: 'string', v: 'Error: ' + msg + ' (Line ' + line + ')' }],
                    errorLine: line,
                    elapsed
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
    return () => clearTimeout(t);
  }, [htmlCode, cssCode, jsCode, showConsole, userClosedConsole]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data.type === 'console') {
        setConsoleLogs(prev => [...prev, {
          type: event.data.method,
          args: event.data.args || [],
          elapsed: event.data.elapsed || 0,
          errorLine: event.data.errorLine,
          timestamp: new Date().toLocaleTimeString(),
        }]);
        if (event.data.errorLine != null) {
          setErrorLine(event.data.errorLine);
        }
        if (!showConsole && !userClosedConsole) setShowConsole(true);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [showConsole, userClosedConsole]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Z') {
        e.preventDefault();
        setIsZenMode(z => !z);
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowPalette(p => !p);
        return;
      }

      if (e.key === 'Escape') {
        if (isZenMode) { setIsZenMode(false); return; }
      }

      if (!isZenMode && !showPalette && (e.key === '?' || ((e.ctrlKey || e.metaKey) && e.key === '/'))) {
        e.preventDefault();
        setShowShortcuts(true);
        return;
      }

      if (isZenMode && e.key === 'Tab') {
        const tag = (e.target as HTMLElement).tagName;
        if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
          e.preventDefault();
          setZenPanel(p => p === 'html' ? 'css' : p === 'css' ? 'js' : 'html');
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isZenMode, showPalette]);

  const handleToggleConsole = () => {
    setUserClosedConsole(showConsole);
    setShowConsole(prev => !prev);
  };

  const copyToClipboard = (text: string, type: string) => {
    if (!text?.trim()) { showToast(`No ${type} code to copy.`, 'error', 'Nothing to copy'); return; }
    navigator.clipboard.writeText(text).then(
      () => showToast(`${type} copied.`, 'success', 'Copied'),
      () => showToast('Copy failed.', 'error', 'Error'),
    );
  };

  const clearAll = () => {
    if (!htmlCode && !cssCode && !jsCode) { showToast('Nothing to clear.', 'error', 'Empty'); return; }
    setShowConfirmModal(true);
  };

  const handleConfirmClear = () => {
    setHtmlCode(''); setCssCode(''); setJsCode(''); setConsoleLogs([]); setErrorLine(null);
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
          content = `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>CodeZen Project</title>\n  <style>\n${cssCode || '/* No CSS */'}}\n  </style>\n</head>\n<body>\n${htmlCode || '<!-- No HTML -->'}\n  <script>\n${jsCode || '// No JS'}\n  <\/script>\n</body>\n</html>`;
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

  const takeSnapshot = (name: string) => {
    const snap: Snapshot = {
      id: `snap_${Date.now()}`,
      name,
      timestamp: new Date().toLocaleString(),
      html: htmlCode,
      css: cssCode,
      js: jsCode,
      output,
    };
    setSnapshots(prev => [snap, ...prev]);
    showToast(`Snapshot "${name}" saved.`, 'success', 'Snapshot');
  };

  const saveSnapshots = (updated: Snapshot[]) => {
    setSnapshots(updated);
  };

  const paletteCommands: PaletteCommand[] = [
    { id: 'panel-html', label: 'Switch to HTML', description: 'Focus HTML editor', icon: 'fa-code', category: 'Panels', action: () => setActivePanel('html') },
    { id: 'panel-css',  label: 'Switch to CSS',  description: 'Focus CSS editor',  icon: 'fa-paint-brush', category: 'Panels', action: () => setActivePanel('css') },
    { id: 'panel-js',   label: 'Switch to JS',   description: 'Focus JS editor',   icon: 'fa-bolt', category: 'Panels', action: () => setActivePanel('js') },
    { id: 'toggle-preview',  label: 'Toggle Preview',  icon: 'fa-eye', category: 'View', action: () => setDeviceMode(d => d === 'fullwidth' ? 'mobile' : 'fullwidth') },
    { id: 'toggle-console',  label: 'Toggle Console',  icon: 'fa-terminal', category: 'View', action: handleToggleConsole },
    { id: 'zen-mode',        label: 'Toggle Zen Mode', icon: 'fa-leaf', shortcut: 'Ctrl+Shift+Z', category: 'View', action: () => setIsZenMode(z => !z) },
    { id: 'device-mobile',   label: 'Preview: Mobile',   icon: 'fa-mobile-screen',        category: 'View', action: () => setDeviceMode('mobile') },
    { id: 'device-tablet',   label: 'Preview: Tablet',   icon: 'fa-tablet-screen-button', category: 'View', action: () => setDeviceMode('tablet') },
    { id: 'device-desktop',  label: 'Preview: Desktop',  icon: 'fa-desktop',              category: 'View', action: () => setDeviceMode('desktop') },
    { id: 'device-compare',  label: 'Preview: Compare',  icon: 'fa-table-columns',        category: 'View', action: () => setDeviceMode('compare') },
    { id: 'format',      label: 'Format Code',          icon: 'fa-wand-magic-sparkles', category: 'Actions', action: formatCode },
    { id: 'download',    label: 'Download Project',     icon: 'fa-download', category: 'Actions', action: () => downloadFile('all') },
    { id: 'clear',       label: 'Clear All Code',       icon: 'fa-trash-can', category: 'Actions', action: clearAll },
    { id: 'templates',   label: 'Load Template',        icon: 'fa-layer-group', category: 'Actions', action: () => setShowTemplates(true) },
    { id: 'snapshot',    label: 'Open Snapshots',       icon: 'fa-camera', category: 'Actions', action: () => setShowSnapshots(true) },
    { id: 'shortcuts',   label: 'Keyboard Shortcuts',   icon: 'fa-keyboard', shortcut: '? / Ctrl+/', category: 'Actions', action: () => setShowShortcuts(true) },
    ...themes.map(t => ({
      id:          `theme-${t.id}`,
      label:       `Theme: ${t.name}`,
      description: t.isDark ? 'Dark theme' : 'Light theme',
      icon:        'fa-palette',
      category:    'Themes',
      action:      () => handleThemeChange(t.id),
    })),
  ];

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

  const panelFocusClass = (panel: ZenPanel) => {
    if (!focusLocked || isZenMode) return '';
    return panel === activePanel ? 'panel-focus-active' : 'panel-focus-dim';
  };

  if (isZenMode) {
    const zenExtension = zenPanel === 'html' ? html() : zenPanel === 'css' ? css() : javascript();
    const zenValue     = zenPanel === 'html' ? htmlCode : zenPanel === 'css' ? cssCode : jsCode;
    const zenOnChange  = zenPanel === 'html' ? setHtmlCode : zenPanel === 'css' ? setCssCode : setJsCode;
    const zenDotColor  = zenPanel === 'html' ? LANG_DOT.html : zenPanel === 'css' ? LANG_DOT.css : LANG_DOT.js;

    return (
      <div className="zen-overlay" tabIndex={-1}>
        <div style={{
          height: '36px', borderBottom: '1px solid #141414',
          display: 'flex', alignItems: 'center', padding: '0 20px',
          justifyContent: 'space-between', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: zenDotColor, display: 'inline-block' }} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#8a8a8a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {zenPanel} — Zen Mode
            </span>
          </div>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#6a6a6a' }}>
            Tab to switch panel · Esc to exit
          </span>
        </div>

        <div className="zen-editor-wrap">
          <CodeMirror
            value={zenValue}
            height="100%"
            theme={getThemeById(currentTheme).theme}
            extensions={[zenExtension]}
            onChange={zenOnChange}
            style={{ height: '100%', fontSize: '14px' }}
          />
        </div>

        <div style={{
          height: '30vh', borderTop: '1px solid #141414', overflow: 'hidden', flexShrink: 0,
        }}>
          <iframe
            srcDoc={output}
            title="zen preview"
            sandbox="allow-scripts"
            style={{ width: '100%', height: '100%', border: 'none', display: 'block', background: '#18181b' }}
          />
        </div>

        <div className="zen-bar">
          {(['html', 'css', 'js'] as ZenPanel[]).map(p => (
            <div key={p} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
              <button
                className={`zen-dot${zenPanel === p ? ' active' : ''}`}
                onClick={() => setZenPanel(p)}
                style={{ background: zenPanel === p ? LANG_DOT[p] : undefined, borderColor: zenPanel === p ? LANG_DOT[p] : undefined }}
                title={p.toUpperCase()}
              />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: zenPanel === p ? '#fff' : '#6a6a6a', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {p}
              </span>
            </div>
          ))}
          <div style={{ width: '1px', height: '24px', background: '#2a2a2a', flexShrink: 0 }} />
          <button
            onClick={() => setIsZenMode(false)}
            style={{
              background: '#e8ff47', border: '1px solid #e8ff47', color: '#000',
              fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', textTransform: 'uppercase',
              letterSpacing: '0.06em', padding: '5px 12px', borderRadius: '20px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '5px',
              transition: 'background 0.15s ease',
              fontWeight: 600,
            }}
            title="Exit Zen Mode (Esc)"
          >
            <i className="fa-solid fa-compress" style={{ fontSize: '10px' }} />
            Exit
          </button>
        </div>

        <CommandPalette isOpen={showPalette} onClose={() => setShowPalette(false)} commands={paletteCommands} />
        <SnapshotManager
          isOpen={showSnapshots} onClose={() => setShowSnapshots(false)}
          snapshots={snapshots} onSave={saveSnapshots}
          currentOutput={output} currentHtml={htmlCode} currentCss={cssCode} currentJs={jsCode}
          onTakeSnapshot={takeSnapshot}
        />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#0d0d0d', color: '#f2f2f2' }}
      onMouseMove={onMouseMove}
    >
      <nav style={navStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/assets/logo.png" alt="CodeZen" style={{ height: '30px', width: 'auto' }} />
          </Link>

          {lastSaved && (
            <span
              className="hidden md:block"
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#8a8a8a', whiteSpace: 'nowrap' }}
            >
              {lastSaved}
            </span>
          )}
        </div>

        <div className="hidden xl:flex items-center gap-2" style={{ padding: '0 8px' }}>
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

        <div className="hidden xl:flex items-center gap-1.5">

          <button onClick={formatCode} id="btn-format" style={tbBtn()}
            onMouseEnter={e => { e.currentTarget.style.color = '#f2f2f2'; e.currentTarget.style.borderColor = '#3a3a3a'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#8a8a8a'; e.currentTarget.style.borderColor = '#1f1f1f'; }}>
            <i className="fa-solid fa-wand-magic-sparkles" style={{ fontSize: '10px' }} />Format
          </button>

          <button onClick={() => setShowTemplates(true)} id="btn-templates" style={tbBtn()}
            onMouseEnter={e => { e.currentTarget.style.color = '#f2f2f2'; e.currentTarget.style.borderColor = '#3a3a3a'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#8a8a8a'; e.currentTarget.style.borderColor = '#1f1f1f'; }}>
            <i className="fa-solid fa-layer-group" style={{ fontSize: '10px' }} />Templates
          </button>

          <button onClick={() => setShowSnapshots(true)} id="btn-snapshots" style={tbBtn(false, showSnapshots)}
            onMouseEnter={e => { if (!showSnapshots) { e.currentTarget.style.color = '#f2f2f2'; e.currentTarget.style.borderColor = '#3a3a3a'; } }}
            onMouseLeave={e => { if (!showSnapshots) { e.currentTarget.style.color = '#8a8a8a'; e.currentTarget.style.borderColor = '#1f1f1f'; } }}>
            <i className="fa-solid fa-camera" style={{ fontSize: '10px' }} />Snapshots
          </button>

          <button onClick={() => setShowPalette(true)} id="btn-palette" style={tbBtn()}
            onMouseEnter={e => { e.currentTarget.style.color = '#f2f2f2'; e.currentTarget.style.borderColor = '#3a3a3a'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#8a8a8a'; e.currentTarget.style.borderColor = '#1f1f1f'; }}
            title="Command Palette (Ctrl+K)">
            <i className="fa-solid fa-magnifying-glass" style={{ fontSize: '10px' }} />
          </button>

          <button onClick={() => setShowShortcuts(true)} id="btn-shortcuts" style={tbBtn()}
            onMouseEnter={e => { e.currentTarget.style.color = '#f2f2f2'; e.currentTarget.style.borderColor = '#3a3a3a'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#8a8a8a'; e.currentTarget.style.borderColor = '#1f1f1f'; }}>
            <i className="fa-solid fa-keyboard" style={{ fontSize: '10px' }} />Shortcuts
          </button>

          <button onClick={() => downloadFile('all')} id="btn-download" style={tbBtn()}
            onMouseEnter={e => { e.currentTarget.style.color = '#f2f2f2'; e.currentTarget.style.borderColor = '#3a3a3a'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#8a8a8a'; e.currentTarget.style.borderColor = '#1f1f1f'; }}>
            <i className="fa-solid fa-download" style={{ fontSize: '10px' }} />Download
          </button>

          <button onClick={handleToggleConsole} id="btn-console" style={tbBtn(false, showConsole)}
            onMouseEnter={e => { if (!showConsole) { e.currentTarget.style.color = '#f2f2f2'; e.currentTarget.style.borderColor = '#3a3a3a'; } }}
            onMouseLeave={e => { if (!showConsole) { e.currentTarget.style.color = '#8a8a8a'; e.currentTarget.style.borderColor = '#1f1f1f'; } }}>
            <i className="fa-solid fa-terminal" style={{ fontSize: '10px' }} />Console
          </button>

          <button onClick={() => setIsZenMode(true)} id="btn-zen" style={tbBtn(false, isZenMode)}
            onMouseEnter={e => { if (!isZenMode) { e.currentTarget.style.color = '#f2f2f2'; e.currentTarget.style.borderColor = '#3a3a3a'; } }}
            onMouseLeave={e => { if (!isZenMode) { e.currentTarget.style.color = '#8a8a8a'; e.currentTarget.style.borderColor = '#1f1f1f'; } }}
            title="Zen Mode (Ctrl+Shift+Z)">
            <i className="fa-solid fa-leaf" style={{ fontSize: '10px' }} />Zen
          </button>

          <div style={{ width: '1px', height: '18px', background: '#2a2a2a', margin: '0 2px', flexShrink: 0 }} />

          <button onClick={clearAll} id="btn-clear" style={tbBtn(true)}
            onMouseEnter={e => { e.currentTarget.style.color = '#ff7777'; e.currentTarget.style.borderColor = '#4a1515'; e.currentTarget.style.background = '#1a0505'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#ff5555'; e.currentTarget.style.borderColor = '#1f1f1f'; e.currentTarget.style.background = 'transparent'; }}>
            <i className="fa-solid fa-trash-can" style={{ fontSize: '10px' }} />Clear
          </button>

          <div style={{ width: '1px', height: '18px', background: '#2a2a2a', margin: '0 2px', flexShrink: 0 }} />
          <Link to="/"
            style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#8a8a8a', textDecoration: 'none', padding: '5px 10px', border: '1px solid transparent', borderRadius: '3px', transition: 'color 0.15s ease', flexShrink: 0 }}
            onMouseEnter={e => ((e.target as HTMLElement).style.color = '#f2f2f2')}
            onMouseLeave={e => ((e.target as HTMLElement).style.color = '#8a8a8a')}>
            Home
          </Link>
        </div>

        <div className="flex xl:hidden items-center gap-1">
          <div className="hidden sm:flex items-center gap-1.5 mr-2">
            {themes.map((theme) => (
              <button key={theme.id} onClick={() => handleThemeChange(theme.id)}
                className={`theme-swatch ${currentTheme === theme.id ? 'active' : ''}`}
                style={{ background: SWATCH_COLORS[theme.id] ?? '#333', width: 14, height: 14 }}
                title={theme.name} />
            ))}
          </div>

          <button onClick={() => setShowPalette(true)} className="toolbar-btn" title="Command Palette (Ctrl+K)">
            <i className="fa-solid fa-magnifying-glass" />
          </button>

          <button onClick={() => downloadFile('all')} className="toolbar-btn" title="Download">
            <i className="fa-solid fa-download" />
          </button>

          <button onClick={clearAll} className="toolbar-btn danger" title="Clear">
            <i className="fa-solid fa-trash-can" />
          </button>

          <button onClick={() => setShowMobileMenu(v => !v)} className="toolbar-btn" title="Menu">
            <i className={`fa-solid ${showMobileMenu ? 'fa-times' : 'fa-bars'}`} />
          </button>
        </div>

        {showMobileMenu && (
          <div className="animate-scale-in xl:hidden" style={{
            position: 'absolute', top: '50px', right: '8px', width: '220px',
            background: '#111', border: '1px solid #2a2a2a', borderRadius: '6px',
            overflow: 'hidden', zIndex: 60,
          }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #1f1f1f' }}>
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#8a8a8a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Theme</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {themes.map((theme) => (
                  <button key={theme.id} onClick={() => { handleThemeChange(theme.id); setShowMobileMenu(false); }}
                    className={`theme-swatch ${currentTheme === theme.id ? 'active' : ''}`}
                    style={{ background: SWATCH_COLORS[theme.id] ?? '#333' }} title={theme.name} />
                ))}
              </div>
            </div>

            {[
              { icon: 'fa-wand-magic-sparkles', label: 'Format Code',       action: () => { formatCode(); setShowMobileMenu(false); } },
              { icon: 'fa-layer-group',         label: 'Templates',          action: () => { setShowTemplates(true); setShowMobileMenu(false); } },
              { icon: 'fa-camera',              label: 'Snapshots',          action: () => { setShowSnapshots(true); setShowMobileMenu(false); } },
              { icon: 'fa-leaf',                label: 'Zen Mode',           action: () => { setIsZenMode(true); setShowMobileMenu(false); } },
              { icon: 'fa-terminal',            label: `${showConsole ? 'Hide' : 'Show'} Console`, action: () => { handleToggleConsole(); setShowMobileMenu(false); } },
            ].map(({ icon, label, action }) => (
              <button key={label} onClick={action} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 16px', background: 'transparent', border: 'none',
                color: '#8a8a8a', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px',
                cursor: 'pointer', textAlign: 'left',
                transition: 'color 0.15s ease, background 0.15s ease',
                borderBottom: '1px solid #1a1a1a',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#f2f2f2'; (e.currentTarget as HTMLButtonElement).style.background = '#1a1a1a'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#8a8a8a'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
              >
                <i className={`fa-solid ${icon}`} style={{ width: 14, textAlign: 'center' }} />
                {label}
              </button>
            ))}
          </div>
        )}
      </nav>

      <main
        className="flex-1 flex flex-col"
        style={{ background: '#0d0d0d', padding: '16px' }}
      >
        <div style={{ marginBottom: '16px' }}>
          <h1 style={{ fontFamily: 'Syne, system-ui, sans-serif', fontSize: '20px', fontWeight: 700, color: '#f2f2f2', letterSpacing: '-0.02em' }}>
            Editor
          </h1>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#8a8a8a', marginTop: '2px' }}>
            Write code, see results instantly. · <kbd style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '2px', padding: '1px 5px', color: '#5a5a5a', fontSize: '10px' }}>Ctrl+K</kbd> for command palette · <kbd style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '2px', padding: '1px 5px', color: '#5a5a5a', fontSize: '10px' }}>Ctrl+Shift+Z</kbd> for Zen Mode
          </p>
        </div>

        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={() => downloadFile('all')} style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 16px',
            border: '1px solid #2a2a2a', background: 'transparent', color: '#5a5a5a',
            fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: 500,
            cursor: 'pointer', borderRadius: '3px', textTransform: 'uppercase',
            letterSpacing: '0.06em', transition: 'color 0.15s ease, border-color 0.15s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = '#f2f2f2'; e.currentTarget.style.borderColor = '#5a5a5a'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#5a5a5a'; e.currentTarget.style.borderColor = '#2a2a2a'; }}>
            <i className="fa-solid fa-download" style={{ fontSize: '10px' }} />Download project
          </button>

          {/* Focus Lock indicator — desktop only (no mouse = no lock on mobile) */}
          {focusLocked && (
            <span className="hidden md:flex" style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#3a3a3a',
              alignItems: 'center', gap: '5px',
            }}>
              <i className="fa-solid fa-moon" style={{ fontSize: '9px' }} />Focus Lock active — move mouse to unlock
            </span>
          )}
        </div>

        <div className="w-full max-w-[95%] xl:max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">

            <div style={panelStyle} className={panelFocusClass('html')} onClick={() => setActivePanel('html')}>
              <div style={panelHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: LANG_DOT.html, display: 'inline-block', flexShrink: 0 }} />
                  <span className="editor-tab active">HTML</span>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div className="tooltip-wrapper">
                    <button onClick={() => copyToClipboard(htmlCode, 'HTML')} className="toolbar-btn" style={{ width: 26, height: 26 }}>
                      <i className="fa-regular fa-copy" style={{ fontSize: '11px' }} />
                    </button>
                    <span className="tooltip">Copy HTML</span>
                  </div>
                  <div className="tooltip-wrapper">
                    <button onClick={() => downloadFile('html')} className="toolbar-btn" style={{ width: 26, height: 26 }}>
                      <i className="fa-solid fa-download" style={{ fontSize: '11px' }} />
                    </button>
                    <span className="tooltip">Download HTML</span>
                  </div>
                </div>
              </div>
              <CodeMirror value={htmlCode} height="18rem" theme={getThemeById(currentTheme).theme}
                extensions={[html()]} onChange={(value) => { setHtmlCode(value); setActivePanel('html'); }} className="text-xs sm:text-sm" />
            </div>

            <div style={panelStyle} className={panelFocusClass('css')} onClick={() => setActivePanel('css')}>
              <div style={panelHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: LANG_DOT.css, display: 'inline-block', flexShrink: 0 }} />
                  <span className="editor-tab active">CSS</span>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div className="tooltip-wrapper">
                    <button onClick={() => copyToClipboard(cssCode, 'CSS')} className="toolbar-btn" style={{ width: 26, height: 26 }}>
                      <i className="fa-regular fa-copy" style={{ fontSize: '11px' }} />
                    </button>
                    <span className="tooltip">Copy CSS</span>
                  </div>
                  <div className="tooltip-wrapper">
                    <button onClick={() => downloadFile('css')} className="toolbar-btn" style={{ width: 26, height: 26 }}>
                      <i className="fa-solid fa-download" style={{ fontSize: '11px' }} />
                    </button>
                    <span className="tooltip">Download CSS</span>
                  </div>
                </div>
              </div>
              <CodeMirror value={cssCode} height="18rem" theme={getThemeById(currentTheme).theme}
                extensions={[css()]} onChange={(value) => { setCssCode(value); setActivePanel('css'); }} className="text-xs sm:text-sm" />
            </div>

            <div style={panelStyle} className={panelFocusClass('js')} onClick={() => setActivePanel('js')}>
              <div style={panelHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: LANG_DOT.js, display: 'inline-block', flexShrink: 0 }} />
                  <span className="editor-tab active">JS</span>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div className="tooltip-wrapper">
                    <button onClick={() => copyToClipboard(jsCode, 'JavaScript')} className="toolbar-btn" style={{ width: 26, height: 26 }}>
                      <i className="fa-regular fa-copy" style={{ fontSize: '11px' }} />
                    </button>
                    <span className="tooltip">Copy JS</span>
                  </div>
                  <div className="tooltip-wrapper">
                    <button onClick={() => downloadFile('js')} className="toolbar-btn" style={{ width: 26, height: 26 }}>
                      <i className="fa-solid fa-download" style={{ fontSize: '11px' }} />
                    </button>
                    <span className="tooltip">Download JS</span>
                  </div>
                </div>
              </div>
              <CodeMirror value={jsCode} height="18rem" theme={getThemeById(currentTheme).theme}
                extensions={[javascript(), ...errorLineExtension]} onChange={(value) => { setJsCode(value); setActivePanel('js'); }} className="text-xs sm:text-sm" />
            </div>
          </div>

          <ResponsivePreview deviceMode={deviceMode} onDeviceModeChange={setDeviceMode} output={output} />

          <ConsoleOutput logs={consoleLogs} isVisible={showConsole} onToggle={handleToggleConsole} onClear={() => { setConsoleLogs([]); setErrorLine(null); }} />
        </div>
      </main>

      <footer style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', height: '44px', borderTop: '1px solid #1a1a1a',
        fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#8a8a8a',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/assets/logo.png" alt="CodeZen"
            style={{ height: '22px', width: 'auto', opacity: 0.5, transition: 'opacity 0.15s ease' }}
            onMouseEnter={e => ((e.target as HTMLImageElement).style.opacity = '1')}
            onMouseLeave={e => ((e.target as HTMLImageElement).style.opacity = '0.5')} />
        </Link>

        <div style={{ display: 'flex', gap: '16px' }}>
          {[
            { href: 'https://github.com/bedigambar', icon: 'fa-github', title: 'GitHub' },
            { href: 'https://www.linkedin.com/in/digambar-behera', icon: 'fa-linkedin', title: 'LinkedIn' },
            { href: 'https://x.com/digambarcodes', icon: 'fa-x-twitter', title: 'X' },
          ].map(({ href, icon, title }) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer" title={title}
              style={{ color: '#8a8a8a', fontSize: '14px', transition: 'color 0.15s ease' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = '#f2f2f2')}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = '#8a8a8a')}>
              <i className={`fa-brands ${icon}`} />
            </a>
          ))}
        </div>

        <span>© {new Date().getFullYear()}</span>
      </footer>

      <ConfirmModal
        isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmClear} title="Clear All Code?"
        message="Are you sure you want to clear all HTML, CSS, and JavaScript? This cannot be undone."
        confirmText="Clear All" cancelText="Cancel" />

      <TemplatesModal
        isOpen={showTemplates} onClose={() => setShowTemplates(false)}
        onSelectTemplate={(template: Template) => loadTemplate(template)} />

      <KeyboardShortcutsModal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />

      <CommandPalette isOpen={showPalette} onClose={() => setShowPalette(false)} commands={paletteCommands} />

      <SnapshotManager
        isOpen={showSnapshots} onClose={() => setShowSnapshots(false)}
        snapshots={snapshots} onSave={saveSnapshots}
        currentOutput={output} currentHtml={htmlCode} currentCss={cssCode} currentJs={jsCode}
        onTakeSnapshot={takeSnapshot} />
    </div>
  );
};

export default CodeEditor;