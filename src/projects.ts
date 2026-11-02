/// <reference types="vite/client" />

import { archiveCopy, archiveProjects } from './archive.ts';
import type { ArchiveCategory, ArchiveProject } from './archive.ts';
import type { Locale } from './content.ts';
import { footerMarkup } from './footer.ts';
import { nextTheme, resolveTheme } from './theme.ts';
import type { Theme } from './theme.ts';

const root = document.documentElement;
const localeKey = 'portfolio-locale';
const themeKey = 'portfolio-theme';
let locale: Locale = localStorage.getItem(localeKey) === 'en' ? 'en' : 'es';
let theme: Theme = resolveTheme(
  localStorage.getItem(themeKey),
  window.matchMedia('(prefers-color-scheme: dark)').matches,
);
let activeCategory: ArchiveCategory | 'all' = 'all';

function setTheme(nextThemeValue: Theme): void {
  theme = nextThemeValue;
  root.dataset.theme = theme;
  localStorage.setItem(themeKey, theme);

  const button = document.querySelector<HTMLButtonElement>('.theme-toggle')!;
  const isDark = theme === 'dark';
  const label = isDark ? 'themeLight' : 'themeDark';
  button.setAttribute('aria-label', archiveCopy[locale][label]);
  button.title = archiveCopy[locale][label];
  button.querySelector<HTMLElement>('.theme-icon')!.textContent = isDark ? '☼' : '☾';
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')!.content = isDark ? '#101411' : '#f7f7f2';
}

function categoryLabel(project: ArchiveProject): string {
  const keyByCategory: Record<ArchiveCategory, keyof typeof archiveCopy.en> = {
    mobile: 'categoryMobile',
    fullstack: 'categoryFullstack',
    android: 'categoryAndroid',
    java: 'categoryJava',
    erp: 'categoryErp',
    devops: 'categoryDevops',
  };
  return archiveCopy[locale][keyByCategory[project.categories[0]]];
}

function renderProjects(): void {
  const visible = archiveProjects.filter((project) => (
    activeCategory === 'all' || project.categories.includes(activeCategory)
  ));
  document.querySelector<HTMLElement>('#archive-projects')!.innerHTML = visible.map((project) => `
    <article class="project-card archive-card project-${project.id}">
      <div class="project-cover">
        <span class="cover-orbit" aria-hidden="true"></span>
        ${project.image
    ? `<img class="project-icon" src="${import.meta.env.BASE_URL}${project.image}" alt="${project.title[locale]} ${locale === 'es' ? 'ícono de la aplicación' : 'app icon'}" loading="lazy" />`
    : `<span class="project-mark" aria-hidden="true">${project.mark}</span>`}
        <span class="cover-caption">${project.tags.slice(0, 2).join(' · ')}</span>
      </div>
      <div class="project-info">
        <div class="project-meta"><span>${categoryLabel(project)}</span></div>
        <h2>${project.title[locale]}</h2>
        <p>${project.summary[locale]}</p>
        <div class="tag-list">${project.tags.map((tag) => `<span>${tag}</span>`).join('')}</div>
      </div>
    </article>`).join('');
  document.querySelector<HTMLElement>('#archive-empty')!.hidden = visible.length > 0;
}

function setLocale(nextLocale: Locale): void {
  locale = nextLocale;
  localStorage.setItem(localeKey, locale);
  root.lang = locale;
  document.title = archiveCopy[locale].pageTitle;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')!.content = archiveCopy[locale].metaDescription;

  for (const element of document.querySelectorAll<HTMLElement>('[data-i18n]')) {
    const key = element.dataset.i18n as keyof typeof archiveCopy.en | undefined;
    const value = key ? archiveCopy[locale][key] : undefined;
    if (value) element.innerHTML = value;
  }
  for (const element of document.querySelectorAll<HTMLElement>('[data-i18n-aria]')) {
    const key = element.dataset.i18nAria as keyof typeof archiveCopy.en | undefined;
    const value = key ? archiveCopy[locale][key] : undefined;
    if (value) element.setAttribute('aria-label', value);
  }
  document.querySelectorAll<HTMLButtonElement>('[data-locale]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.locale === locale));
  });
  document.querySelector<HTMLElement>('.main-nav')!.setAttribute('aria-label', locale === 'es' ? 'Navegación principal' : 'Main navigation');
  document.querySelector<HTMLElement>('.language-switch')!.setAttribute('aria-label', locale === 'es' ? 'Idioma' : 'Language');
  setTheme(theme);
  renderProjects();
  document.querySelector<HTMLElement>('#site-footer')!.innerHTML = footerMarkup(locale);
}

document.querySelectorAll<HTMLButtonElement>('[data-locale]').forEach((button) => {
  button.addEventListener('click', () => {
    const nextLocale = button.dataset.locale;
    if (nextLocale === 'en' || nextLocale === 'es') setLocale(nextLocale);
  });
});

document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    if (filter !== 'all' && filter !== 'mobile' && filter !== 'fullstack' && filter !== 'android' && filter !== 'java' && filter !== 'erp' && filter !== 'devops') return;
    activeCategory = filter;
    document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((filterButton) => {
      filterButton.setAttribute('aria-pressed', String(filterButton === button));
    });
    renderProjects();
  });
});

document.querySelector<HTMLButtonElement>('.theme-toggle')!.addEventListener('click', () => {
  setTheme(nextTheme(theme));
});

setLocale(locale);
