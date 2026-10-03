/**
 * Global Dark Mode manager for Book Education Sénégal
 */

export function getInitialTheme(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const saved = localStorage.getItem('book_edu_theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      return true;
    } else if (saved === 'light') {
      document.documentElement.classList.remove('dark');
      return false;
    }
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.documentElement.classList.add('dark');
      return true;
    }
  } catch (e) {
    console.warn('Could not read theme preference:', e);
  }
  document.documentElement.classList.remove('dark');
  return false;
}

export function applyTheme(isDark: boolean): void {
  try {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('book_edu_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('book_edu_theme', 'light');
    }
  } catch (e) {
    console.warn('Could not save theme preference:', e);
  }
}
