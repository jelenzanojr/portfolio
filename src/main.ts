/// <reference types="vite/client" />

import { journey, projects, siteCopy } from './content.ts';
import type { JourneyStep, Locale, PortfolioProject } from './content.ts';
import { buildContactMailto } from './contact.ts';
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

function setTheme(next: Theme): void {
  theme = next;
  root.dataset.theme = theme;
  localStorage.setItem(themeKey, theme);
  const button = document.querySelector<HTMLButtonElement>('.theme-toggle')!;
  const isDark = theme === 'dark';
  const themeCopy = siteCopy[locale];
  button.setAttribute('aria-label', isDark ? themeCopy.themeLight : themeCopy.themeDark);
  button.title = isDark ? themeCopy.themeLight : themeCopy.themeDark;
  button.querySelector<HTMLElement>('.theme-icon')!.textContent = isDark ? '☼' : '☾';
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')!.content = isDark ? '#101511' : '#f1f2ec';
}

function projectCard(project: PortfolioProject): string {
  const title = project.title[locale];
  const kind = project.kind[locale];
  const summary = project.summary[locale];
  const cover = project.image
    ? `<img class="project-icon" src="${import.meta.env.BASE_URL}${project.image}" alt="${title} ${siteCopy[locale].appIconLabel}" loading="lazy" />`
    : `<span class="project-mark" aria-hidden="true">${project.mark}</span>`;
  return `
    <article class="project-card ${project.featured ? 'featured-project' : 'other-project'} project-${project.id}">
      <div class="project-cover">
        <span class="cover-number">${project.number}</span>
        <span class="cover-orbit" aria-hidden="true"></span>
        ${cover}
        <span class="cover-caption">${project.tags.slice(0, 2).join(' · ')}</span>
      </div>
      <div class="project-info">
        <div class="project-meta"><span>${kind}</span><span class="project-status"><i></i>${project.featured ? siteCopy[locale].projectStatus : siteCopy[locale].complementaryLabel}</span></div>
        <h3>${title}</h3>
        <p>${summary}</p>
        <div class="tag-list">${project.tags.map((tag) => `<span>${tag}</span>`).join('')}</div>
      </div>
    </article>`;
}

function journeyCard(step: JourneyStep, index: number): string {
  return `
    <article class="journey-item">
      <span class="journey-marker" aria-hidden="true">0${index + 1}</span>
      <div class="journey-content">
        <h3>${step.title[locale]}</h3>
        <p>${step.description[locale]}</p>
      </div>
      <div class="tag-list journey-tags">${step.technologies.map((technology) => `<span>${technology}</span>`).join('')}</div>
    </article>`;
}

function setLocale(nextLocale: Locale): void {
  locale = nextLocale;
  localStorage.setItem(localeKey, locale);
  root.lang = locale;
  document.title = siteCopy[locale].pageTitle;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')!.content = siteCopy[locale].metaDescription;

  for (const element of document.querySelectorAll<HTMLElement>('[data-i18n]')) {
    const key = element.dataset.i18n as keyof typeof siteCopy.en | undefined;
    const value = key ? siteCopy[locale][key] : undefined;
    if (value) element.innerHTML = value;
  }
  for (const element of document.querySelectorAll<HTMLElement>('[data-i18n-aria]')) {
    const key = element.dataset.i18nAria as keyof typeof siteCopy.en | undefined;
    const value = key ? siteCopy[locale][key] : undefined;
    if (value) element.setAttribute('aria-label', value);
  }
  for (const element of document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-i18n-placeholder]')) {
    const key = element.dataset.i18nPlaceholder as keyof typeof siteCopy.en | undefined;
    const value = key ? siteCopy[locale][key] : undefined;
    if (value) element.placeholder = value;
  }
  for (const element of document.querySelectorAll<HTMLImageElement>('[data-i18n-alt]')) {
    const key = element.dataset.i18nAlt as keyof typeof siteCopy.en | undefined;
    const value = key ? siteCopy[locale][key] : undefined;
    if (value) element.alt = value;
  }

  document.querySelectorAll<HTMLButtonElement>('[data-locale]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.locale === locale));
  });

  const nav = document.querySelector<HTMLElement>('.main-nav')!;
  nav.setAttribute('aria-label', locale === 'es' ? 'Navegación principal' : 'Main navigation');
  document.querySelector<HTMLElement>('.language-switch')!.setAttribute('aria-label', locale === 'es' ? 'Idioma' : 'Language');
  setTheme(theme);
  document.querySelector<HTMLElement>('#featured-projects')!.innerHTML = projects
    .filter((project) => project.featured)
    .map(projectCard)
    .join('');
  document.querySelector<HTMLElement>('#other-projects')!.innerHTML = projects
    .filter((project) => !project.featured)
    .map(projectCard)
    .join('');
  document.querySelector<HTMLElement>('#journey-list')!.innerHTML = journey
    .map(journeyCard)
    .join('');
  document.querySelector<HTMLElement>('#site-footer')!.innerHTML = footerMarkup(locale);
}

document.querySelectorAll<HTMLButtonElement>('[data-locale]').forEach((button) => {
  button.addEventListener('click', () => {
    const nextLocale = button.dataset.locale;
    if (nextLocale === 'en' || nextLocale === 'es') setLocale(nextLocale);
  });
});

document.querySelector<HTMLButtonElement>('.theme-toggle')!.addEventListener('click', () => {
  setTheme(nextTheme(theme));
});

document.querySelector<HTMLFormElement>('#contact-form')!.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  if (!form.reportValidity()) return;

  const formData = new FormData(form);
  const name = String(formData.get('name')).trim();
  const email = String(formData.get('email')).trim();
  const message = String(formData.get('message')).trim();
  document.querySelector<HTMLElement>('#contact-status')!.textContent = siteCopy[locale].contactFormStatus;
  window.location.href = buildContactMailto({ name, email, message });
});

setTheme(theme);
setLocale(locale);
