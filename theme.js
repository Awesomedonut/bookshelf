const THEMES = ['cozy', 'retro'];
const STORAGE_KEY = 'bookshelf-theme';

export function getCurrentTheme() {
  return localStorage.getItem(STORAGE_KEY) || 'cozy';
}

export function applyTheme(theme) {
  localStorage.setItem(STORAGE_KEY, theme);

  if (theme === 'cozy') {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = theme;
  }
}

export function cycleToNextTheme() {
  const current = getCurrentTheme();
  const nextIndex = (THEMES.indexOf(current) + 1) % THEMES.length;
  return THEMES[nextIndex];
}
