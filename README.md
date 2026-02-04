# Reflex

**Reaction time tester with personality**

## What It Does
Classic reaction time test: wait for green, tap/click as fast as you can. Compares your time to animals and gives fun ratings.

## Demo
Open `index.html` in a browser.

## Deploy

### Vercel
```bash
cd projects/reflex
vercel deploy --prod
```

### Netlify
Drag and drop the folder to netlify.com/drop

### Manual
Upload all files (`index.html`, `styles.css`, `app.js`) to any static host.

## Tech
- Pure HTML/CSS/JS
- Uses `performance.now()` for accurate timing
- LocalStorage for best score persistence
- ~15KB total

## Features
- Accurate millisecond timing
- Fun comparisons (cheetah, sloth, etc.)
- Best score tracking
- Attempt history
- Share results
- Keyboard support (Space/Enter)
- Mobile touch optimized
- Particle celebration on new records

## Viral Hook
"⚡ Reflex Test: 234ms — I'm faster than a cheetah! Test yours:"

---
Built by Sam overnight 3AM 2026-02-01
