# SK Management

A responsive, presentation-only React website for SK Management / Le Grande Aura Hotel Group. Built with React and Vite, with CSS transitions, scroll reveals, photo wipes, parallax, a moving typography ribbon and a scroll progress indicator. Reduced-motion preferences are respected.

## Run

```sh
npm install
npm run dev
```

Build with `npm run build`. Vite creates the standalone static website in `dist/`. On Windows PowerShell, use `npm.cmd` if the execution policy blocks `npm.ps1`.

## Edit

- **Phone, email, office address, services, process and FAQ:** `src/content.js`.
- **Page copy and structure:** `src/main.jsx`.
- **Colors, typography, layout and animation:** `src/styles.css`.
- **Photographs:** `public/images/`.
- **Original supplied content:** `source-content.txt` (used as reference material; its suggested multi-page structure was condensed into the requested single page).

Phone and email deliberately use visible placeholders. Replace them with verified details before using the website for enquiries. There are no forms, submissions, booking systems, accounts or backend services.

## Photography

All seven supplied photographs are included. The original JPEGs are preserved. The site uses conservative CSS color grading, intentional framing and layouts adapted to their native dimensions. AI restoration was attempted with the built-in image tool but could not run because the account's image usage limit was reached. No AI-restored files were produced, and no substitute faces or synthetic team photographs were used.

## Design references

Original design, inspired by the editorial typography and restrained colors of [SOFT STAY](https://www.framer.com/marketplace/templates/soft-stay/) and [LuxHotel](https://www.framer.com/marketplace/templates/luxhotel/). No template code or assets were copied.

Google Fonts are used for DM Sans and Manrope, with system font fallbacks. Headings use a clean, non-italic Manrope treatment and body text uses DM Sans.

The supplied `Chocho Aura Demo` font was intentionally not copied into the project. Its bundled license restricts it to personal use and specifically prohibits company websites. Once a licensed commercial webfont is supplied, update `--display` in `src/styles.css` and add its `@font-face` declaration.
