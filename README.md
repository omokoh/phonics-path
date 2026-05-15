# PhonicsPath

A free, multisensory phonics app for children ages 4–8, designed with dyslexia in mind.

PhonicsPath teaches the 44 phonemes of English through audio + visual + tap interaction — no login, no account, no paywall. Zero barriers to access. Works on Amazon Fire tablets, Android tablets (Chrome, Samsung Internet, Firefox for Android), and any modern browser.

## Features

- **Phonics Card view** — large letter display (120 px+) in OpenDyslexic font, audio plays automatically on load and on tap
- **Match the Sound game** — hear a phoneme, tap the correct letter from 3 large options (100 × 100 px minimum)
- **5-phoneme sessions** — ADHD-friendly, ≤5 minutes, no pressure
- **Progress dots** — 5 amber dots fill as the child advances
- **Celebration screen** — star burst animation and "Play Again" button on completion
- **Web Speech API fallback** — app works on day one without any MP3 files
- **Session memory** — localStorage tracks which phonemes have been covered so each play-again advances to the next set

## Font

This app uses **OpenDyslexic** — a free typeface designed to increase readability for readers with dyslexia.

Download from [opendyslexic.org](https://opendyslexic.org) and place the `.otf` files here:

```
public/fonts/OpenDyslexic/
  OpenDyslexic-Regular.otf
  OpenDyslexic-Bold.otf
  OpenDyslexic-Italic.otf
```

Until the font files are present the browser will fall back to its default sans-serif. Add the files for full dyslexia-optimised rendering.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:5173` in any browser.

## Add real phoneme audio

The app uses the Web Speech API as a fallback so it works immediately without any MP3 files. To add real recorded audio:

1. Record each phoneme sound clearly (keep under 2 seconds, consistent volume).
2. Export as **MP3**, 44 kHz, stereo, ~128 kbps.
3. Name each file exactly as listed in `src/data/phonemes.ts` (e.g. `sh.mp3`, `ch.mp3`).
4. Drop files into `/public/audio/phonemes/`
5. Replace `/public/audio/success.mp3` with your celebration chime.

Real MP3 files take priority; the Web Speech fallback only fires when an MP3 is missing or fails to load.

## Deploy to Cloudflare Pages

```bash
npm run build        # outputs to /dist
```

Then in the Cloudflare Pages dashboard:

1. Connect your GitHub repo **or** upload the `dist/` folder directly.
2. Build command: `npm run build`
3. Build output directory: `dist`
4. No environment variables required — fully static, no backend.

## Project structure

```
phonics-path/
├── src/
│   ├── components/
│   │   ├── PhonicsCard.tsx       — phoneme card with letter + audio
│   │   ├── MatchGame.tsx         — 3-option tap-to-match game
│   │   ├── ProgressDots.tsx      — 5-dot session progress bar
│   │   └── CompletionScreen.tsx  — celebration + play again
│   ├── data/
│   │   └── phonemes.ts           — all 44 phoneme definitions
│   ├── hooks/
│   │   └── useAudio.ts           — MP3 playback + Web Speech fallback
│   └── App.tsx                   — session state management
├── public/
│   ├── audio/
│   │   ├── phonemes/             — drop MP3 files here
│   │   └── success.mp3
│   └── fonts/
│       └── OpenDyslexic/         — drop OTF font files here
└── index.html
```

## Design principles

- OpenDyslexic font everywhere — no fallback to system fonts
- Dark navy background (`#0f172a`) with warm white cards (`#fefce8`)
- All tap targets ≥ 80 × 80 px (match game buttons are 100 × 100 px minimum)
- No text the child needs to read to navigate — icons and audio guide everything
- Wrong answers: gentle shake animation only, no negative sound or failure colour
- No hover-only interactions — all interactions are touch/click events, compatible with Android tablet browsers

## License

MIT — free to use, fork, and redistribute.
