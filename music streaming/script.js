/* ————————— SEARCH PAGE ONLY ————————— */
if (location.pathname.includes('search.html')) {
  const form   = document.getElementById('searchForm');
  const query  = document.getElementById('query');
  const list   = document.getElementById('results');

  // tiny helper to build a result row
  const row = (cover, title, artist, preview) => `
    <li class="result">
      <img src="${cover}" alt="${title}">
      <div class="meta">
        <span class="title">${title}</span>
        <span class="artist">${artist}</span>
      </div>
      <button class="play" data-preview="${preview}"></button>
    </li>`;

  // click‑to‑play preview
  list.addEventListener('click', e => {
    if (!e.target.matches('.play')) return;
    const url = e.target.dataset.preview;
    if (!url) return;
    // simple toggle: play if paused, pause if playing
    if (window._audio && !window._audio.paused && window._audio.src === url) {
      window._audio.pause();
    } else {
      if (window._audio) window._audio.pause();
      window._audio = new Audio(url);
      window._audio.play();
    }
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    list.innerHTML = '<p style="color:#fff">Searching…</p>';

    const term = encodeURIComponent(query.value.trim());
    if (!term) return;

    try {
      const res = await fetch(
        `https://itunes.apple.com/search?term=${term}&entity=song&limit=10`
      );
      const data = await res.json();

      if (!data.results.length) {
        list.innerHTML = '<p style="color:#fff">No results 😕</p>';
        return;
      }

      list.innerHTML = data.results
        .map(t => row(
          t.artworkUrl60.replace('60x60bb', '100x100bb'), // bigger cover
          t.trackName,
          t.artistName,
          t.previewUrl     // 30‑sec mp4 preview from iTunes
        ))
        .join('');
    } catch (err) {
      console.error(err);
      list.innerHTML = '<p style="color:#fff">Error 🙈 Try again later.</p>';
    }
  });
}

/*****************************************************************
 *  UPLOAD MODULE  (runs only on upload.html)
 *****************************************************************/
if (location.pathname.includes('upload.html')) {
  const btnBrowse  = document.getElementById('btnBrowse');   // blue button
  const filePicker = document.getElementById('filePicker');  // hidden <input>
  const tbody      = document.getElementById('trackBody');   // <tbody>
  const STORE_KEY  = 'myTracks';

  /* ── starter tracks that will show the first time the page is opened ── */
  const SEED = [
  {
    id: 1,
    cover: '../covers/cutthroat.jpg',
    streams: 100678778,
    artist: 'iann dior',
    title:  'cutthroat',
    publish: '2022‑06‑10',
    src: '../audio/cutthroat.mp3'       // optional preview file
  },
  {
    id: 2,
    cover: '../covers/gone-girl.jpg',
    streams: 90998667,
    artist: 'iann dior',
    title:  'gone girl',
    publish: '2022‑05‑20',
    src: '../audio/gone-girl.mp3'
  },
  {
    id: 3,
    cover: '../covers/believe.jpg',
    streams: 90556668,
    artist: 'iann dior',
    title:  "don't wanna believe",
    publish: '2021‑07‑01',
    src: '../audio/believe.mp3'
  },
  {
    id: 4,
    cover: '../covers/is-it-you.jpg',
    streams: 70777555,
    artist: 'iann dior',
    title:  'is it you',
    publish: '2023‑01‑17',
    src: '../audio/is-it-you.mp3'
  },
  {
    id: 5,
    cover: '../covers/holding-on.jpg',
    streams: 70123324,
    artist: 'iann dior',
    title:  'Holding On',
    publish: '2021‑03‑22',
    src: '../audio/holding-on.mp3'
  }
  ];


  let tracks = [];
  

  renderTable();

  /* ── UI actions ─────────────────────────────────────────── */
  btnBrowse.addEventListener('click', () => filePicker.click());

  filePicker.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;

    /* quick meta prompts (replace with a nicer modal later) */
    const title  = prompt('Track title?', file.name.replace(/\.[^.]+$/, '')) || 'Untitled';
    const artist = prompt('Artist?', 'Unknown') || 'Unknown';

    const blobURL = URL.createObjectURL(file);
    const today   = new Date().toISOString().slice(0, 10); // yyyy‑mm‑dd

    const newTrack = {
      id: Date.now(),                 // simple unique key
      cover: '../img/placeholder.jpg',// default art
      streams: 0,
      artist, title, publish: today,
      src: blobURL
    };
    tracks.push(newTrack);
    persist();
    appendRow(newTrack);

    filePicker.value = '';            // reset input
  });

  /* table delegation: play / remove */
  tbody.addEventListener('click', e => {
    const id = +e.target.closest('tr')?.dataset.id || null;

    /* play button */
    if (e.target.matches('.play')) {
      const src = e.target.dataset.src;
      if (window._aud && window._aud.src === src && !window._aud.paused) {
        window._aud.pause();
      } else {
        if (window._aud) window._aud.pause();
        window._aud = new Audio(src);
        window._aud.play();
      }
    }

    /* remove link */
    if (e.target.matches('.remove')) {
      e.preventDefault();
      tracks = tracks.filter(t => t.id !== id);
      persist();
      e.target.closest('tr').remove();
    }
  });

  /* ── helper functions ───────────────────────────────────── */
  function persist() {
    localStorage.setItem(STORE_KEY, JSON.stringify(tracks));
  }

  function renderTable() {
    tbody.innerHTML = '';
    tracks.forEach(appendRow);
  }

  function appendRow(t) {
    tbody.insertAdjacentHTML('beforeend', `
      <tr data-id="${t.id}">
        <td><img src="${t.cover}" alt="${t.title}"></td>
        <td>${t.streams.toLocaleString()}</td>
        <td>${t.artist}</td>
        <td>${t.title}</td>
        <td>${t.publish}</td>
        <td class="actions">
          <button class="play" data-src="${t.src}" title="Play / Pause"></button>
          <a href="#" class="remove">Remove</a>
        </td>
      </tr>
    `);
  }
}

/* ==============================================================
 *  index.html
 * ==============================================================*/
if (location.pathname.toLowerCase().endsWith('/index.html')) {

  const form = document.getElementById('generatorForm');
  const grid = document.getElementById('playlistGrid');
  const genreMap = {            // map our display names to API queries
    'Rock':      'classic rock',
     'Pop'        : 'pop hits', 
    'Jazz':      'smooth jazz',
    'Country':   'country music'
  };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const g = document.getElementById('genreSelect').value;
    const term  = genreMap[g] || g;
    const url   = `https://itunes.apple.com/search?term=${term}&media=music&entity=song&limit=6`;

    grid.innerHTML = '<p class="loading">Loading…</p>';

    try {
      const res = await fetch(url);
      const { results } = await res.json();
      if (!results.length) throw new Error('No songs found');

      grid.innerHTML = '';          // clear loading
      results.forEach(track => addCard(track));

    } catch (err) {
      grid.innerHTML = `<p class="error">${err.message}</p>`;
    }
  });

  /* ---- helpers ---- */

  function addCard(t){
    const art = t.artworkUrl100.replace('100x100bb','300x300bb'); // bigger img
    grid.insertAdjacentHTML('beforeend', `
      <div class="card">
        <img class="cover" src="${art}" alt="${t.trackName}">
        <div class="meta">
           <span class="title">${t.trackName}</span>
           <span class="artist">${t.artistName}</span>
        </div>
        <button class="play" data-src="${t.previewUrl}">Play</button>
      </div>
    `);
  }

  /* simple play / pause toggle (delegated) */
  grid.addEventListener('click', e=>{
    if (!e.target.matches('.play')) return;
    const src = e.target.dataset.src;

    if (window._aud && !window._aud.paused && window._aud.src === src){
      window._aud.pause();
      e.target.textContent = 'Play';
    } else {
      if (window._aud) {
        window._aud.pause();
        document.querySelectorAll('.play').forEach(b=>b.textContent='Play');
      }
      window._aud = new Audio(src);
      window._aud.play();
      e.target.textContent = 'Pause';
    }
  });
}

/* playlist.html */


const genreMap = {
  'Rock'     : { term: 'classic rock',  rssId: 21 },
  'Pop'      : { term: 'pop',           rssId: 14 },
  'Jazz'     : { term: 'jazz',          rssId: 11 },
  'Country'  : { term: 'country music', rssId: 6  },
  'Hip hop'  : { term: 'hip hop',       rssId: 18 },
  'EDM'      : { term: 'electronic',    rssId: 7  },
  'Classical': { term: 'classical',     rssId: 5  },
  'R&B'      : { term: 'r&b soul',      rssId: 15 },
  'Metal'    : { term: 'metal',         rssId: 17 },
  'Indie'    : { term: 'indie',         rssId: 20 }
};

const rankList   = document.getElementById('rankList');
const genreSel   = document.getElementById('genreSelect');
const citySel    = document.getElementById('citySelect');
const modeBtns   = document.querySelectorAll('.mode-btn');

let currentMode  = 'top';

// ========= EVENT WIRES ==========
modeBtns.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    modeBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    currentMode = btn.dataset.mode;
    loadSongs();
  });
});

[genreSel, citySel].forEach(el=> el.addEventListener('change', loadSongs));

// Initial load
document.addEventListener('DOMContentLoaded', ()=>{
  modeBtns[0].classList.add('active');  // highlight "Top 200"
  loadSongs();
});

// ========= MAIN LOAD FUNCTION ==========
async function loadSongs(){
  const genre = genreSel.value;
  const city  = citySel.value.trim();
  rankList.innerHTML = '<li class="track-row">Loading…</li>';

  try{
    let tracks = [];
    if(currentMode === 'top'){
      tracks = await getTop200(genre);
    }else if(currentMode === 'discovery'){
      tracks = await getDiscovery(genre, city);
    }else{ // mix
      const top = await getTop200(genre);
      const dis = await getDiscovery(genre, city);
      tracks = shuffle([...top.slice(0,15), ...dis.slice(0,15)]).slice(0,30);
    }

    rankList.innerHTML = '';
    tracks.forEach(t => rankList.appendChild(renderRow(t)));

  }catch(err){
    console.error(err);
    rankList.innerHTML = `<li class="track-row">No songs found. (${err.message})</li>`;
  }
}

// ========= DATA SOURCES ==========

// Top 200 by genre using iTunes RSS feed (no key, CORS ok)
async function getTop200(genreName){
  const g = genreMap[genreName];
  const url = `https://itunes.apple.com/us/rss/topsongs/limit=200${g?.rssId ? `/genre=${g.rssId}`:''}/json`;
  const feed = await fetch(url).then(r=>r.json());
  return (feed.feed?.entry || []).map(e => ({
    title : e['im:name']?.label,
    artist: e['im:artist']?.label,
    cover : pickImg(e['im:image']),
    audio : e.link?.find(l => l.attributes?.type?.startsWith('audio'))?.attributes?.href || '',
  }));
}

// Discovery: do a search by "<city> <genre>" or just genre, then shuffle
async function getDiscovery(genreName, city){
  const term = [city, genreMap[genreName].term].filter(Boolean).join(' ');
  const url  = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&entity=song&limit=50`;
  const { results } = await fetch(url).then(r=>r.json());
  const arr = results.map(r=>({
    title : r.trackName,
    artist: r.artistName,
    cover : r.artworkUrl100?.replace('100x100bb','200x200bb'),
    audio : r.previewUrl || ''
  }));
  return shuffle(arr);
}

// ========= RENDER HELPERS ==========
function renderRow(t){
  const li = document.createElement('li');
  li.className = 'track-row';
  li.innerHTML = `
    <img src="${t.cover}" alt="${t.title}">
    <div class="meta">
      <span class="title">${t.title}</span>
      <span class="artist">${t.artist}</span>
    </div>
    <button class="play-btn" aria-label="play"></button>
  `;
  const btn = li.querySelector('.play-btn');
  if(t.audio){
    const audio = new Audio(t.audio);
    btn.addEventListener('click', ()=>{
      if(audio.paused){ audio.play(); btn.classList.add('playing'); }
      else{ audio.pause(); btn.classList.remove('playing'); }
    });
  }else{
    btn.disabled = true;
    btn.style.opacity = .4;
    btn.style.cursor = 'default';
  }
  return li;
}

function pickImg(arr){
  // choose the largest image from RSS
  if(!arr || !arr.length) return '';
  return arr[arr.length - 1].label;
}
function shuffle(a){
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()* (i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

/* upload.html */

// Only run this on the upload page
document.addEventListener('DOMContentLoaded', () => {
  const tbody     = document.getElementById('trackBody');
  if (!tbody) return;              // not on upload.html, skip

  const seedBtn   = document.getElementById('seedRandom');
  const STORAGE_KEY = 'tracks';

  // Your existing load/save/appendRow functions may already exist.
  // If they do, delete these duplicates OR merge them cleanly.
  let tracks = loadTracks();

  if (!tracks.length) {
    // Page is empty the first time: auto–seed 6 random songs
    seedRandomTracks(6).catch(console.error);
  }

  // Optional manual seed button
  seedBtn?.addEventListener('click', () => seedRandomTracks(6));

  /* ---------- utilities you might already have ---------- */
  function loadTracks(){
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }
  function saveTracks(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tracks));
  }

  function appendRow(t){
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><img src="${t.cover}" alt="${t.title}" class="thumb"></td>
      <td>${t.streams}</td>
      <td>${t.artist}</td>
      <td>${t.title}</td>
      <td>${t.date}</td>
      <td class="actions">
          <button class="play-circle" data-audio="${t.audio}"></button>
          <a href="#" class="remove">Remove</a>
      </td>
    `;
    // remove handler
    tr.querySelector('.remove').addEventListener('click', (e) => {
      e.preventDefault();
      tracks = tracks.filter(x => x.id !== t.id);
      saveTracks();
      tr.remove();
    });

    // play handler
    tr.querySelector('.play-circle').addEventListener('click', () => {
      playPreview(t.audio);
    });

    tbody.appendChild(tr);
  }

  // Simple audio player (uses one <audio> tag)
  let audioEl = document.getElementById('preview-player');
  if (!audioEl) {
    audioEl = document.createElement('audio');
    audioEl.id = 'preview-player';
    document.body.appendChild(audioEl);
  }
  function playPreview(url){
    if (!url) return;
    audioEl.src = url;
    audioEl.play();
  }

  /**********************
   * SEED WITH iTUNES    *
   **********************/
  const TERMS = ['love', 'summer', 'night', 'dance', 'heart', 'dream', 'music', 'rain', 'happy', 'fire'];

  async function seedRandomTracks(n = 6){
    const usedIds = new Set();
    const newOnes = [];

    while (newOnes.length < n) {
      const term = TERMS[Math.floor(Math.random() * TERMS.length)];
      const song = await fetchRandomSong(term);
      if (!song) continue;
      if (usedIds.has(song.trackId)) continue;
      usedIds.add(song.trackId);

      newOnes.push({
        id: song.trackId,
        cover: song.artworkUrl100?.replace('100x100bb', '200x200bb') || '',
        streams: randomStreams(),
        artist: song.artistName,
        title: song.trackName,
        date: song.releaseDate.split('T')[0],
        audio: song.previewUrl || ''
      });
    }

    // Render & store
    newOnes.forEach(appendRow);
    tracks = tracks.concat(newOnes);
    saveTracks();
  }

  async function fetchRandomSong(term){
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=200`;
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      if (!data.results?.length) return null;
      return data.results[Math.floor(Math.random() * data.results.length)];
    } catch (err) {
      console.warn('Fetch failed', err);
      return null;
    }
  }

  function randomStreams(){
    // 10M – 110M inclusive, formatted with commas
    const num = Math.floor(Math.random() * 100_000_000) + 10_000_000;
    return num.toLocaleString();
  }
});
