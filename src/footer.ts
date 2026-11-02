import type { Locale } from './content.ts';

const icons = {
  telegram: '<path d="m21 3-7.4 18-4.2-7.2L2 10.5 21 3Z"/><path d="m9.4 13.8 4.3-4.1"/>',
  github: '<path d="M9 19c-4.3 1.4-4.3-2.2-6-2.2m12 4v-3.1a2.7 2.7 0 0 0-.8-2.1c2.7-.3 5.5-1.3 5.5-6a4.7 4.7 0 0 0-1.3-3.3 4.3 4.3 0 0 0-.1-3.3s-1-.3-3.3 1.3a11.4 11.4 0 0 0-6 0C6.7 2.7 5.7 3 5.7 3a4.3 4.3 0 0 0-.1 3.3 4.7 4.7 0 0 0-1.3 3.3c0 4.7 2.8 5.7 5.5 6a2.7 2.7 0 0 0-.8 2.1v3.1"/>',
  linkedin: '<path d="M5 9v10M5 5v.01M10 19v-6a4 4 0 0 1 8 0v6M10 9v10"/>',
  email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  phone: '<path d="M7 3H5a2 2 0 0 0-2 2 16 16 0 0 0 16 16 2 2 0 0 0 2-2v-2l-5-2-2 3a13 13 0 0 1-6-6l3-2-2-5Z"/>',
} satisfies Record<string, string>;

function icon(name: keyof typeof icons): string {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${icons[name]}</svg>`;
}

export function footerMarkup(locale: Locale): string {
  const copy = locale === 'es'
    ? {
      label: 'Contacto y redes',
      location: 'Uruguay',
      copyright: 'Todos los derechos reservados.',
      email: 'Correo electrónico',
      phone: 'Teléfono',
      github: 'Perfil de GitHub',
      linkedin: 'Perfil de LinkedIn',
    }
    : {
      label: 'Contact and social links',
      location: 'Uruguay',
      copyright: 'All rights reserved.',
      email: 'Email',
      phone: 'Phone',
      github: 'GitHub profile',
      linkedin: 'LinkedIn profile',
    };

  return `
    <div class="footer-identity">
      <a class="brand" href="./index.html#top" aria-label="José — portfolio">
        <span>José</span>
      </a>
      <div class="footer-owner">
        <strong>José Ernesto Lenzano Ramírez</strong>
        <span>${copy.location}</span>
      </div>
    </div>
    <div class="footer-contact">
      <h2>${copy.label}</h2>
      <nav class="footer-social-links" aria-label="${copy.label}">
        <a class="footer-social-link" href="https://t.me/jwanted94" target="_blank" rel="noreferrer" aria-label="Telegram: @jwanted94" title="Telegram: @jwanted94">${icon('telegram')}<span>@jwanted94</span></a>
        <a class="footer-social-link" href="https://github.com/jelenzanojr" target="_blank" rel="noreferrer" aria-label="${copy.github}" title="${copy.github}">${icon('github')}<span>GitHub</span></a>
        <a class="footer-social-link" href="https://www.linkedin.com/in/jelenzano94/" target="_blank" rel="noreferrer" aria-label="${copy.linkedin}" title="${copy.linkedin}">${icon('linkedin')}<span>LinkedIn</span></a>
        <a class="footer-social-link" href="mailto:jelenzanjr@gmail.com" aria-label="${copy.email}: jelenzanjr@gmail.com" title="${copy.email}: jelenzanjr@gmail.com">${icon('email')}<span>jelenzanjr@gmail.com</span></a>
        <a class="footer-social-link" href="tel:+59892813409" aria-label="${copy.phone}: +598 9 281 3409" title="${copy.phone}: +598 9 281 3409">${icon('phone')}<span>+598 9 281 3409</span></a>
      </nav>
    </div>
    <p class="footer-copyright">© ${new Date().getFullYear()} José Ernesto Lenzano Ramírez · ${copy.copyright}</p>`;
}
