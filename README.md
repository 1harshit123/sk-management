# SK Management

A responsive, presentation-only React website for SK Management / Le Grande Aura Hotel Group. Built with React and Vite, with lightweight one-time scroll reveals and premium CSS button interactions. Continuous animation, parallax and scroll-driven effects were removed to keep the page responsive. Reduced-motion preferences are respected.

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

The supplied hero portrait and six enhanced photographs are displayed as WebP files in `public/images/`, preserving their full resolution. The `_enhanced.jpg` source files and previous banquet photograph are retained. The hero portrait loads eagerly with its crop positioned to keep the face visible; the six below-fold images use native lazy loading, asynchronous decoding and explicit intrinsic dimensions. WebP conversion uses quality 90.

## Design references

Original design, inspired by the editorial typography and restrained colors of [SOFT STAY](https://www.framer.com/marketplace/templates/soft-stay/) and [LuxHotel](https://www.framer.com/marketplace/templates/luxhotel/). No template code or assets were copied.

Google Fonts are used for DM Sans and Manrope, with system font fallbacks. Headings use a clean, non-italic Manrope treatment and body text uses DM Sans.

The SK Management wordmark and Le Grande Aura Hotel Group line use the user-supplied Mileast font, self-hosted at `public/fonts/Mileast.otf`. Both lines have responsive sizes for the navbar and footer.

The supplied `Chocho Aura Demo` font was intentionally not copied into the project. Its bundled license restricts it to personal use and specifically prohibits company websites. Once a licensed commercial webfont is supplied, update `--display` in `src/styles.css` and add its `@font-face` declaration.
