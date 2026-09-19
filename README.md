# Urban Reserve

A full-screen, non-scrolling presentation app for Urban Reserve, built from the brochure (`260916_URBAN RESERVE BROCHURE MANUAL V1.pdf`).
It runs as Landing → Menu → one page per section, with a terrain-edged curtain transition between screens.

```
npm install
npm run dev
```

## Stack

React 19 + Vite, Tailwind v4 (theme tokens in `src/index.css`), GSAP with `@gsap/react` (DrawSVG, Observer, CustomEase), and Marzipano for 360° views.

## Where things live

| Path | What |
| --- | --- |
| `src/data/content.js` | All copy, images, plans, amenities, specs, contact details and panoramas |
| `src/app/` | Hash routing, the transition director (`Navigator.jsx`), the curtain and the chrome |
| `src/screens/` | One file per screen |
| `src/art/` | Brand art: vector logo, `Terrain` (the cover's real torn edge), `Botanical`s traced from the brochure, `SunBirds` |
| `src/app/FullscreenGate.jsx` | The full-screen gate. The app only runs in full screen, and the gate returns when you leave it |
| `src/hooks/useIntro.js` | Shared entrance animation: `data-in`, `data-mask` and `data-draw` attributes |
| `src/brand/*.svg` | Logo mark and lockup, extracted as vectors from page 1 of the brochure |

## Responsive scaling

Desktop layouts are designed at **1920×1080 (3xl)**. Landscape screens 1024px and wider scale that one canvas: `1rem` = 16px at 1080p, 21.3px at 2560×1440 (4xl) and 32px at 3840×2160 (5xl). Smaller laptops shrink proportionally, down to an 11px floor. Portrait tablets and phones get stacked layouts, where the content pane scrolls under fixed chrome.

## Adding 360° views

Put equirectangular (2:1) images in `public/assets/panoramas/` and list them in `PANORAMAS` in `src/data/content.js`:

```js
export const PANORAMAS = [{ id: 'deck', label: 'E-Deck', src: '/assets/panoramas/deck.jpg' }]
```

Until then, the Views page shows an "arriving soon" state.

## Regenerating images from the brochure

The PDF only embeds mockup spreads, so the artwork is cropped from high-resolution page renders, with the book spine removed:

```
mutool draw -o "/tmp/brochure/p%d.png" -r 220 "260916_URBAN RESERVE BROCHURE MANUAL V1.pdf"
node scripts/crop-brochure.mjs /tmp/brochure
```

The botanicals and torn edges are vectorised from the brochure pages:

```
mutool draw -o "/tmp/brochure-hi/p%d.png" -r 400 "260916_URBAN RESERVE BROCHURE MANUAL V1.pdf" 2,4,9,11,27
node scripts/trace-botanicals.mjs /tmp/brochure-hi
node scripts/extract-ridges.mjs /tmp/brochure-hi
```

## Before launch

- Replace the placeholder phone, WhatsApp number and email in `BRAND` (`src/data/content.js`).
- Swap in the original renders and plans when available. The brochure crops are good, but not print-master quality.
