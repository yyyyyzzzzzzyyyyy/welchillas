const audio = document.getElementById('audio');
const player = document.getElementById('player');
const cover = document.getElementById('player-cover');
const titleEl = document.getElementById('player-title');
const artistEl = document.getElementById('player-artist');
const playPause = document.getElementById('play-pause');
const progress = document.getElementById('progress');
const volume = document.getElementById('volume');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const closePlayer = document.getElementById('close-player');

let tracks = [];
let currentIndex = null;

/* LOAD DATA */
fetch('data.json')
.then(r => r.json())
.then(data => tracks = data);

/* PLAY FROM LIST */
document.addEventListener('click', e => {
  if (!e.target.classList.contains('play-btn')) return;
  const track = e.target.closest('.track');
  currentIndex = Number(track.dataset.index);
  playCurrent();
});

function playCurrent() {
  const t = tracks[currentIndex];
  const id = String(t.id).padStart(2,'0');

  audio.src = `audio/${id}.mp3`;
  cover.src = `images/${id}.jpg`;
  titleEl.textContent = t.titulo;
  artistEl.textContent = t.artistas;

  audio.play();
  playPause.textContent = '⏸';
  player.classList.remove('hidden');
}

/* CONTROLES */
playPause.onclick = () => {
  audio.paused ? audio.play() : audio.pause();
  playPause.textContent = audio.paused ? '▶' : '⏸';
};

audio.onended = () => {
  if (currentIndex < tracks.length - 1) {
    currentIndex++;
    playCurrent();
  }
};

audio.ontimeupdate = () => {
  progress.value = (audio.currentTime / audio.duration) * 100 || 0;
  currentTimeEl.textContent = format(audio.currentTime);
  durationEl.textContent = format(audio.duration);
};

progress.oninput = () =>
  audio.currentTime = (progress.value / 100) * audio.duration;

volume.oninput = () => audio.volume = volume.value;

closePlayer.onclick = () => {
  audio.pause();
  player.classList.add('hidden');
};

function format(sec){
  if (!sec) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2,'0');
  return `${m}:${s}`;
}
