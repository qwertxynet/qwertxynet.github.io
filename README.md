# QWERTXY · Mohammed Alkarkhy

**Live:** https://qwertxynet.github.io

The portfolio of Mohammed Alkarkhy (Qwertxy): computer engineer, web developer and designer.
It's built as a Y2K / Frutiger Aero desktop: ice-silver glass, liquid-chrome type, rising bubbles and a sparkle cursor.

## What's on it

| Section | What it shows |
| --- | --- |
| **Work** | Client work (website developer for [San Diego Direct](https://sandiego.direct)) plus personal projects, pulled live from my GitHub repos |
| **Engineering** | Matador Mechanics (FTC team 14968, lead programmer), robot arm programming, CNC toolpaths in G-code, and CAD with full technical drawings |
| **About** | Bio, Cal Poly Computer Engineering coursework, skills and what I'm working on now |
| **Contact** | GitHub and [Buy Me a Coffee](https://buymeacoffee.com/qwertxy) |

### Extras

- **Boot screen:** "enter with sound" or "enter quietly".
- **UI sounds:** synthesized live with the Web Audio API (no audio files), off by default.
- **Q-Amp:** a mini music player that generates its tracks in the browser.
- **Sparkle cursor:** a trail on mouse devices, turned off for reduced motion.
- **Project windows:** each engineering project opens in an Aero-style window with an image and video viewer.

## Built with

React 19 · Vite · plain CSS (no UI framework) · Web Audio API · GitHub Actions → GitHub Pages

## Editing

Most text lives in two files:

- [`src/content.js`](src/content.js): name, tagline, client work, which repos to show or hide, about, skills, contact links.
- [`src/engineering.js`](src/engineering.js): engineering projects, captions and media. Images and videos are in `public/eng/`.

## Run locally

```bash
npm install
npm run dev
```

## Deploy

Every push to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds the site and publishes it to GitHub Pages.

---

Robotics photos are from the Matador Mechanics team Instagram, most of them taken by me.
