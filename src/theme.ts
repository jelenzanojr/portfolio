export type Theme = 'light' | 'dark';

// Pure theme-state helpers shared by the UI and tests.
export function resolveTheme(savedTheme: string | null, prefersDark: boolean): Theme {
  if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
  return prefersDark ? 'dark' : 'light';
}

export function nextTheme(currentTheme: Theme): Theme {
  return currentTheme === 'dark' ? 'light' : 'dark';
}
