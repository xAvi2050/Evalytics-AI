// src/utils/editorThemes.js
export const themes = {
  'github': {
    base: 'vs',
    inherit: true,
    rules: [
      { token: '', foreground: '24292e', background: 'ffffff' },
      { token: 'comment', foreground: '6a737d' },
      { token: 'keyword', foreground: 'd73a49' },
      { token: 'string', foreground: '032f62' },
    ],
    colors: {
      'editor.background': '#ffffff',
    }
  },
  'monokai': {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: '', foreground: 'f8f8f2', background: '272822' },
      { token: 'comment', foreground: '75715e' },
      { token: 'string', foreground: 'e6db74' },
      { token: 'keyword', foreground: 'f92672' },
    ],
    colors: {
      'editor.background': '#272822',
    }
  },
  'solarized-dark': {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: '', foreground: '839496', background: '002b36' },
      { token: 'comment', foreground: '586e75' },
      { token: 'string', foreground: '2aa198' },
    ],
    colors: {
      'editor.background': '#002b36',
    }
  },
  'dracula': {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: '', foreground: 'f8f8f2', background: '282a36' },
      { token: 'comment', foreground: '6272a4' },
      { token: 'string', foreground: 'f1fa8c' },
    ],
    colors: {
      'editor.background': '#282a36',
    }
  }
};