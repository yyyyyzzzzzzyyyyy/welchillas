const audio = document.getElementById('audio');
const player = document.getElementById('player');
const list = document.getElementById('music-list');

const cover = document.getElementById('player-cover');
const titleEl = document.getElementById('player-title');
const artistEl = document.getElementById('player-artist');
const playPause = document.getElementById('play-pause');
const progress = document.getElementById('progress');
const volume = document.getElementById('volume');
const shuffleBtn = document.getElementById('shuffle');

let tracks = [];
let currentIndex = 0;
let shuffle = false;

/* LOAD */
fetch('data.json')
  .then(r => r.json())
  .then(data => {
    tracks = data;
    renderList();
  });

function renderList() {
  list.innerHTML = '';
  tracks.forEach((t, i) => {
    const id = String(t.id).padStart(2,'0');
    list.innerHTML += `
      <div class="track">
        <img src="images/${id}.jpg">
        <strong>${t.titulo}</strong>
        <div>${t.artistas}</div>
        <button onclick="play(${i})">▶</button>
      </div>
    `;
  });
}

window.play = i => {
  currentIndex = i;
  const t = tracks[i];
  const id = String(t.id).padStart(2,'0');

  audio.src = `audio/${id}.mp3`;
  cover.src = `images/${id}.jpg`;
  titleEl.textContent = t.titulo;
  artistEl.textContent = t.artistas;

  audio.play();
  playPause.textContent = '⏸';
  player.classList.remove('hidden');
};

playPause.onclick = () => {
  audio.paused ? audio.play() : audio.pause();
  playPause.textContent = audio.paused ? '▶' : '⏸';
};

shuffleBtn.onclick = () => {
  shuffle = !shuffle;
  shuffleBtn.style.background = shuffle ? '#1aff9c' : '#222';
};

audio.onended = () => {
  if (shuffle) {
    currentIndex = Math.floor(Math.random() * tracks.length);
  } else {
    currentIndex = (currentIndex + 1) % tracks.length;
  }
  play(currentIndex);
};

audio.ontimeupdate = () => {
  progress.value = (audio.currentTime / audio.duration) * 100 || 0;
};

progress.oninput = () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
};

volume.oninput = () => audio.volume = volume.value;
