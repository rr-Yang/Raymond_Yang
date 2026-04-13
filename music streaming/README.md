# 🎵 Music Streaming Web App

A front-end music streaming web application built with vanilla HTML, CSS, and JavaScript. Powered by the iTunes Search API — no back-end or API key required.

🌐 **Live Site:** [https://rr-yang.github.io/Raymond_Yang/music%20streaming/Pages/index.html)

---

## Pages

### 🏠 Home (`index.html`)
Select a music genre (Rock, Pop, Jazz, Country) and generate a 6-card playlist on the spot. Each card shows album art, track name, and artist, with a Play / Pause toggle that streams a 30-second iTunes preview.

### 📋 Playlist (`playlist.html`)
Browse and filter music by genre (10 options) and city. Switch between three modes:
- **Top 200** — pulls from the iTunes RSS top songs feed
- **Discovery** — searches iTunes by genre + city for fresh finds
- **Mix** — blends Top 200 and Discovery results, shuffled

### 🔍 Search (`search.html`)
Real-time song and artist search via the iTunes API. Returns up to 10 results with cover art and a 30-second audio preview per track.

### ⬆️ Upload (`upload.html`)
Artist-facing track management page. Displays a table of tracks (seeded automatically from iTunes on first visit). Supports uploading local audio files, playing previews, and removing tracks. Track data is persisted in `localStorage`.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Structure | HTML5 |
| Styling | CSS3 (CSS variables, Grid, Flexbox) |
| Logic | Vanilla JavaScript (ES2020+, async/await) |
| Data | [iTunes Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/index.html) (no key required) |
| Storage | Browser `localStorage` |
| Hosting | GitHub Pages |

---

## Project Structure

```
music streaming/
├── index.html        # Home — genre playlist generator
├── playlist.html     # Playlist — Top 200 / Discovery / Mix
├── search.html       # Search — artist & song lookup
├── upload.html       # Upload — track management dashboard
├── style.css         # Global stylesheet
├── script.js         # All page logic (route-guarded by pathname)
├── img/              # Logo, icons, placeholder images
├── covers/           # Local album cover images
└── audio/            # Local audio preview files
```

---

## Features

- 🎧 30-second song previews (Play / Pause toggle)
- 🔀 Shuffle and genre-based discovery
- 🌆 City-filtered music search
- 📁 Local file upload with metadata prompt
- 💾 Upload page state persists via `localStorage`
- 📱 Responsive layout for mobile and desktop

---

## Running Locally

No build step needed. Just open any `.html` file in a browser — or serve the folder with a simple local server to avoid CORS issues with the iTunes API:

```bash
# Python 3
cd "music streaming"
python -m http.server 8000
# then open http://localhost:8000
```
