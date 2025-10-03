import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView } from '@codemirror/view';

// GitHub Light Theme
const githubLight = EditorView.theme({
  '&': {
    backgroundColor: '#ffffff',
    color: '#24292e',
  },
  '.cm-content': {
    caretColor: '#24292e',
  },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: '#24292e',
  },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: '#BBDFFF',
  },
  '.cm-activeLine': {
    backgroundColor: '#f6f8fa',
  },
  '.cm-gutters': {
    backgroundColor: '#ffffff',
    color: '#6e7781',
    border: 'none',
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#f6f8fa',
  },
}, { dark: false });

// VSCode Dark Theme
const vscodeDark = EditorView.theme({
  '&': {
    backgroundColor: '#1e1e1e',
    color: '#d4d4d4',
  },
  '.cm-content': {
    caretColor: '#d4d4d4',
  },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: '#d4d4d4',
  },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: '#264f78',
  },
  '.cm-activeLine': {
    backgroundColor: '#282828',
  },
  '.cm-gutters': {
    backgroundColor: '#1e1e1e',
    color: '#858585',
    border: 'none',
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#282828',
  },
}, { dark: true });

// Monokai Theme
const monokai = EditorView.theme({
  '&': {
    backgroundColor: '#272822',
    color: '#f8f8f2',
  },
  '.cm-content': {
    caretColor: '#f8f8f0',
  },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: '#f8f8f0',
  },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: '#49483e',
  },
  '.cm-activeLine': {
    backgroundColor: '#3e3d32',
  },
  '.cm-gutters': {
    backgroundColor: '#272822',
    color: '#90908a',
    border: 'none',
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#3e3d32',
  },
}, { dark: true });

// Dracula Theme
const dracula = EditorView.theme({
  '&': {
    backgroundColor: '#282a36',
    color: '#f8f8f2',
  },
  '.cm-content': {
    caretColor: '#f8f8f0',
  },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: '#f8f8f0',
  },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: '#44475a',
  },
  '.cm-activeLine': {
    backgroundColor: '#44475a',
  },
  '.cm-gutters': {
    backgroundColor: '#282a36',
    color: '#6272a4',
    border: 'none',
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#44475a',
  },
}, { dark: true });

export interface Theme {
  id: string;
  name: string;
  theme: any;
  isDark: boolean;
}

export const themes: Theme[] = [
  { id: 'onedark', name: 'One Dark', theme: oneDark, isDark: true },
  { id: 'vscode-dark', name: 'VSCode Dark', theme: vscodeDark, isDark: true },
  { id: 'dracula', name: 'Dracula', theme: dracula, isDark: true },
  { id: 'monokai', name: 'Monokai', theme: monokai, isDark: true },
  { id: 'github-light', name: 'GitHub Light', theme: githubLight, isDark: false },
];

export const getThemeById = (id: string): Theme => {
  return themes.find(t => t.id === id) || themes[0];
};
