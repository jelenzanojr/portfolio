# Personal Portfolio

A bilingual (Spanish/English), responsive portfolio with light and dark themes. It uses Vite and TypeScript for development and production builds, while the published site remains static.

## Run locally

Requirements: Node.js 22.12 or later and npm.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. The development server binds to this computer only.

Create and preview a production build:

```sh
npm run build
npm run preview
```

## Update content

- Edit the English and Spanish interface copy in `src/content.ts`.
- Add or update project cards in the `projects` array in the same file. Each project needs localized titles and summaries; featured project icons live in `public/images/projects/`.
- Maintain the separate bilingual project archive in `src/archive.ts`; its cards can belong to multiple category filters without expanding the homepage grid. Vite builds both `index.html` and `projects.html` as static pages.
- The LinkedIn profile URL is included in the homepage contact links and project archive footer.
- The contact form validates the visitor's details and prepares a message in their email app; it does not send data to a server.
- The profile image and featured app icons are copied from owner-provided local assets into `public/images/` so production builds remain self-contained.
- Theme preference and selected language are stored in the browser's local storage.
- Do not add private client information, unapproved screenshots, or unverified impact claims to public-facing content.

## Checks

```sh
npm test
npm run check
npm run build
```
