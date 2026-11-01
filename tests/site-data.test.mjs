import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { journey, projects, siteCopy } from '../src/content.ts';
import { archiveCopy, archiveProjects } from '../src/archive.ts';
import { buildContactMailto } from '../src/contact.ts';
import { footerMarkup } from '../src/footer.ts';
import { nextTheme, resolveTheme } from '../src/theme.ts';

test('the portfolio positions the owner as a Flutter and Full-Stack Engineer in both locales', () => {
  assert.equal(siteCopy.en.heroRole, 'Flutter & Full-Stack Engineer');
  assert.equal(siteCopy.es.heroRole, 'Flutter & Full-Stack Engineer');
  assert.match(siteCopy.en.pageTitle, /Full-Stack/);
  assert.match(siteCopy.es.pageTitle, /Full-Stack/);
});

test('the header and shared footer use José as the complete wordmark', () => {
  const home = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(home, /<span>José<\/span>/);
  assert.doesNotMatch(home, /josé\.dev/i);
  for (const locale of ['en', 'es']) {
    const footer = footerMarkup(locale);
    assert.match(footer, /<span>José<\/span>/);
    assert.doesNotMatch(footer, /josé\.dev/i);
  }
});

test('Docker deployment builds the site and serves its static output', () => {
  const dockerfile = readFileSync(new URL('../Dockerfile', import.meta.url), 'utf8');
  const compose = readFileSync(new URL('../compose.yaml', import.meta.url), 'utf8');
  const ignore = readFileSync(new URL('../.dockerignore', import.meta.url), 'utf8');
  const envExample = readFileSync(new URL('../.env.example', import.meta.url), 'utf8');
  assert.match(dockerfile, /FROM node:.* AS builder/);
  assert.match(dockerfile, /RUN npm ci/);
  assert.match(dockerfile, /RUN npm run build/);
  assert.match(dockerfile, /FROM nginxinc\/nginx-unprivileged:/);
  assert.match(dockerfile, /COPY --from=builder \/app\/dist \/usr\/share\/nginx\/html/);
  assert.match(compose, /ports:\s*\n\s*- "127\.0\.0\.1:\$\{PORT:-8080\}:8080"/);
  assert.match(envExample, /^PORT=8080$/m);
  assert.match(ignore, /^\.env$/m);
  assert.match(ignore, /^!\.env\.example$/m);
  assert.match(ignore, /node_modules/);
  assert.match(ignore, /dist/);
});

test('the homepage distinguishes native Android work from Java SE and Java EE', () => {
  assert.match(siteCopy.en.aboutStack, /Java SE.*Java EE.*Android/);
  assert.match(siteCopy.es.aboutStack, /Java SE.*Java EE.*Android nativo/);
  const home = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.doesNotMatch(home, /Java \/ Android/);
});

test('the portfolio presents current backend and MAUI knowledge in both locales', () => {
  assert.match(siteCopy.en.aboutStack, /TypeScript.*Supabase.*Firebase.*REST APIs.*GraphQL.*Python.*\.NET MAUI/);
  assert.match(siteCopy.es.aboutStack, /TypeScript.*Supabase.*Firebase.*API REST.*GraphQL.*Python.*\.NET MAUI/);
  assert.doesNotMatch(siteCopy.en.aboutCopy, /currently supporting a project built with \.NET MAUI/i);
  assert.doesNotMatch(siteCopy.es.aboutCopy, /doy soporte a un proyecto desarrollado con \.NET MAUI/i);
});

test('the project archive includes localized Java, Odoo, IRACuba, DevOps, and GapStation experience', () => {
  assert.deepEqual(
    archiveProjects.filter((project) => project.additional).map((project) => project.id),
    ['java-enterprise', 'odoo', 'iracuba', 'lpemarket-devops', 'ventas', 'delfin-verde', 'our-city', 'vesta', 'viajapp', 'melollevo', 'dale-gol', 'hidrolectura', 'cuban-stores', 'pactum', 'dtaxi', 'geysel-invoicing', 'geysel-commerce', 'carnico-bayamo', 'recargas-metrobus'],
  );
  assert.equal(archiveProjects.length, 26);
  assert.ok(archiveProjects.some((project) => project.id === 'gapstation' && project.tags.includes('Team Lead')));
  const lpeMarket = archiveProjects.find((project) => project.id === 'lpemarket-devops');
  assert.ok(lpeMarket?.categories.includes('erp') && lpeMarket.categories.includes('devops'));
  assert.ok(lpeMarket?.tags.includes('Codemagic') && lpeMarket.tags.includes('GitHub'));
  const iracuba = archiveProjects.find((project) => project.id === 'iracuba');
  assert.ok(iracuba?.categories.includes('erp'));
  assert.match(iracuba?.kind.es ?? '', /Odoo 17/i);
  assert.equal(iracuba?.image, 'images/projects/iracuba.png');
  assert.match(iracuba?.summary.es ?? '', /Odoo/);
  assert.match(lpeMarket?.kind.es ?? '', /Odoo 19/i);
  assert.match(lpeMarket?.summary.es ?? '', /Odoo/);
  assert.equal(lpeMarket?.image, 'images/projects/lpemarket.webp');
  assert.ok(archiveProjects.find((project) => project.id === 'delfin-verde')?.categories.includes('mobile'));
  assert.ok(archiveProjects.find((project) => project.id === 'our-city')?.categories.includes('mobile'));
  assert.ok(archiveProjects.find((project) => project.id === 'vesta')?.categories.includes('mobile'));
  const ventas = archiveProjects.find((project) => project.id === 'ventas');
  assert.ok(ventas?.categories.includes('android'));
  assert.match(ventas?.summary.es ?? '', /online y offline/);
  assert.equal(ventas?.image, 'images/projects/ventas.png');
  assert.equal(archiveProjects.find((project) => project.id === 'poscaja')?.categories.includes('java'), false);
  assert.ok(archiveProjects.find((project) => project.id === 'java-enterprise')?.categories.includes('java'));
  assert.ok(archiveCopy.es.filterAndroid);
  const viajapp = archiveProjects.find((project) => project.id === 'viajapp');
  assert.ok(viajapp?.categories.includes('mobile') && viajapp.categories.includes('fullstack') && viajapp.categories.includes('devops'));
  assert.match(viajapp?.summary.es ?? '', /backend.*despliegue continuo/i);
  const cubanStores = archiveProjects.find((project) => project.id === 'cuban-stores');
  assert.match(cubanStores?.summary.es ?? '', /más de 10 apps.*más de 20\.000 usuarios/i);
  assert.doesNotMatch(cubanStores?.summary.es ?? '', /reportad[oa]s? por el propietario/i);
  for (const id of ['pactum', 'dtaxi']) {
    assert.ok(archiveProjects.find((project) => project.id === id)?.categories.includes('android'));
    assert.ok(archiveProjects.find((project) => project.id === id)?.image);
  }
  for (const id of ['geysel-invoicing', 'geysel-commerce', 'carnico-bayamo']) {
    assert.ok(archiveProjects.find((project) => project.id === id)?.categories.includes('java'));
  }
  const recargas = archiveProjects.find((project) => project.id === 'recargas-metrobus');
  assert.ok(recargas?.categories.includes('mobile'));
  assert.match(recargas?.title.es ?? '', /A2-20/);
  assert.match(recargas?.summary.es ?? '', /soporte/);
  assert.equal(recargas?.image, 'images/projects/recargas-metrobus.png');
  assert.equal(projects.find((project) => project.id === 'poscaja')?.image, 'images/projects/poscaja.png');
  assert.equal(projects.find((project) => project.id === 'ca-mygestor')?.image, 'images/projects/ca-mygestor.png');
  for (const id of ['iracuba', 'lpemarket-devops', 'ventas', 'delfin-verde', 'our-city', 'vesta', 'viajapp', 'melollevo', 'dale-gol', 'hidrolectura', 'cuban-stores', 'pactum', 'dtaxi', 'recargas-metrobus']) {
    const project = archiveProjects.find((item) => item.id === id);
    assert.ok(project?.image, `${id} should use its original project icon`);
    const imagePath = fileURLToPath(new URL(`../public/${project.image}`, import.meta.url));
    const imageHeader = readFileSync(imagePath).subarray(0, 12);
    const isPng = imageHeader.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    const isWebp = imageHeader.toString('ascii', 0, 4) === 'RIFF' && imageHeader.toString('ascii', 8, 12) === 'WEBP';
    assert.ok(isPng || isWebp, `${id} icon should be a valid PNG or WebP image`);
  }
  for (const project of archiveProjects) {
    for (const locale of ['en', 'es']) {
      assert.ok(project.title[locale], `${project.id} title missing ${locale}`);
      assert.ok(project.summary[locale], `${project.id} summary missing ${locale}`);
    }
  }
  assert.deepEqual(Object.keys(archiveCopy.en).sort(), Object.keys(archiveCopy.es).sort());
});

test('the portfolio links to the bilingual project archive and the owner LinkedIn profile', () => {
  const home = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const archive = readFileSync(new URL('../projects.html', import.meta.url), 'utf8');
  const favicon = readFileSync(new URL('../public/favicon.svg', import.meta.url), 'utf8');
  assert.match(home, /href="\.\/projects\.html"/);
  assert.match(home, /href="https:\/\/www\.linkedin\.com\/in\/jelenzano94\/"/);
  assert.match(archive, /src="\.\/src\/projects\.ts"/);
  assert.match(home, /rel="icon"[^>]+href="\.\/favicon\.svg"/);
  assert.match(archive, /rel="icon"[^>]+href="\.\/favicon\.svg"/);
  assert.match(favicon, /<svg[^>]+viewBox="0 0 64 64"/);
  assert.match(favicon, /<rect[^>]+fill="#c8f16a"/i);
  assert.match(favicon, /<path[^>]+fill="#172016"/i);
});

test('the homepage and project archive share the same bilingual navigation', () => {
  const home = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const archive = readFileSync(new URL('../projects.html', import.meta.url), 'utf8');
  const navLinks = (html) => {
    const nav = html.match(/<nav class="main-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1] ?? '';
    return [...nav.matchAll(/<a href="([^"]+)"[^>]*data-i18n="([^"]+)">/g)].map(([, href, key]) => [href, key]);
  };
  const expected = [
    ['#about', 'navAbout'],
    ['#work', 'navWork'],
    ['./projects.html', 'navArchive'],
    ['#experience', 'navJourney'],
    ['#contact', 'navContact'],
  ];
  assert.deepEqual(navLinks(home), expected);
  assert.deepEqual(navLinks(archive), [
    ['./index.html#about', 'navAbout'],
    ['./index.html#work', 'navWork'],
    ['#projects', 'navArchive'],
    ['./index.html#experience', 'navJourney'],
    ['./index.html#contact', 'navContact'],
  ]);
  assert.deepEqual(navLinks(home).map(([, key]) => key), navLinks(archive).map(([, key]) => key));
  for (const locale of ['en', 'es']) {
    for (const key of ['navAbout', 'navWork', 'navArchive', 'navJourney', 'navContact']) {
      assert.equal(archiveCopy[locale][key], siteCopy[locale][key], `${key} should match in ${locale}`);
    }
  }
});

test('the shared footer exposes the owner profile and contact links in both locales', () => {
  for (const locale of ['en', 'es']) {
    const footer = footerMarkup(locale);
    assert.match(footer, /José Ernesto Lenzano Ramírez/);
    assert.match(footer, /Uruguay/);
    assert.match(footer, /mailto:jelenzanjr@gmail\.com/);
    assert.match(footer, /https:\/\/t\.me\/jwanted94/);
    assert.match(footer, /https:\/\/github\.com\/jelenzanojr/);
    assert.match(footer, /https:\/\/www\.linkedin\.com\/in\/jelenzano94\//);
    assert.match(footer, /tel:\+59892813409/);
    assert.equal((footer.match(/class="footer-social-link"/g) ?? []).length, 5);
  }
  const home = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const archive = readFileSync(new URL('../projects.html', import.meta.url), 'utf8');
  assert.equal((home.match(/id="site-footer"/g) ?? []).length, 1);
  assert.equal((archive.match(/id="site-footer"/g) ?? []).length, 1);
});

test('SmartGPS keeps a light icon background in the dark theme for logo contrast', () => {
  const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
  assert.match(css, /:root\[data-theme='dark'\] \.project-smartgps \.project-cover\s*\{\s*background:\s*#e8effc/i);
});

test('English and Spanish interface copy have the same keys', () => {
  assert.deepEqual(
    Object.keys(siteCopy.en).sort(),
    Object.keys(siteCopy.es).sort(),
  );
});

test('the current Flutter projects lead the featured work in the agreed order', () => {
  assert.deepEqual(
    projects.filter((project) => project.featured).map((project) => project.id),
    ['fitpoints', 'smartgps', 'surro-social', 'fleetr'],
  );
});

test('each featured project has localized title and summary', () => {
  for (const project of projects.filter((item) => item.featured)) {
    for (const locale of ['en', 'es']) {
      assert.ok(project.title[locale], `${project.id} title missing ${locale}`);
      assert.ok(project.summary[locale], `${project.id} summary missing ${locale}`);
    }
  }
});

test('featured projects use the original app icons copied into the static site', () => {
  const expectedAssets = {
    fitpoints: 'images/projects/fitpoints.png',
    smartgps: 'images/projects/smartgps.png',
    'surro-social': 'images/projects/surro-social.png',
    fleetr: 'images/projects/fleetr.png',
  };

  for (const [id, asset] of Object.entries(expectedAssets)) {
    const project = projects.find((item) => item.id === id);
    assert.equal(project?.image, asset, `${id} must point to its original app icon`);
    const file = fileURLToPath(new URL(`../public/${asset}`, import.meta.url));
    assert.ok(existsSync(file), `${id} icon must be present in the static public assets`);
    assert.deepEqual(readFileSync(file).subarray(0, 8), Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  }
});

test('the portfolio includes complementary projects and a bilingual career timeline', () => {
  assert.deepEqual(
    projects.filter((project) => !project.featured).map((project) => project.id),
    ['gapstation', 'ca-mygestor', 'poscaja'],
  );
  assert.equal(journey.length, 3);
  for (const step of journey) {
    for (const locale of ['en', 'es']) {
      assert.ok(step.title[locale], `timeline title missing ${locale}`);
      assert.ok(step.description[locale], `timeline description missing ${locale}`);
    }
  }
});

test('the page provides about, experience, and a labeled contact form', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /id="about"/);
  assert.match(html, /id="experience"/);
  assert.match(html, /<form[^>]+id="contact-form"/);
  assert.match(html, /for="contact-name"/);
  assert.match(html, /for="contact-email"/);
  assert.match(html, /for="contact-message"/);
});

test('the contact form prepares a mailto draft with encoded visitor details', () => {
  const mailto = new URL(buildContactMailto({
    name: 'Ana & José',
    email: 'ana@example.com',
    message: 'Hola,\n¿podemos conversar?',
  }));

  assert.equal(mailto.protocol, 'mailto:');
  assert.equal(mailto.pathname, 'jelenzanjr@gmail.com');
  assert.equal(mailto.searchParams.get('subject'), 'Portfolio contact: Ana & José');
  assert.equal(mailto.searchParams.get('body'), 'Name: Ana & José\nEmail: ana@example.com\n\nHola,\n¿podemos conversar?');
});

test('saved theme overrides the system preference and invalid values fall back safely', () => {
  assert.equal(resolveTheme('dark', false), 'dark');
  assert.equal(resolveTheme('light', true), 'light');
  assert.equal(resolveTheme('unexpected', true), 'dark');
  assert.equal(resolveTheme(null, false), 'light');
});

test('theme control alternates between light and dark', () => {
  assert.equal(nextTheme('light'), 'dark');
  assert.equal(nextTheme('dark'), 'light');
});
