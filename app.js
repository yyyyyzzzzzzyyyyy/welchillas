const list = document.getElementById('music-list');

fetch('data.json')
  .then(res => res.json())
  .then(data => {
    data.forEach(track => {
      const id = String(track["ID"]).padStart(2, '0');

      const row = document.createElement('div');
      row.className = 'track';

      const img = document.createElement('img');
      img.src = `images/${id}.jpg`;
      row.appendChild(img);

      const playBtn = document.createElement('button');
      playBtn.className = 'play-btn';
      playBtn.textContent = '▶';
      row.appendChild(playBtn);

      const info = document.createElement('div');
      info.className = 'track-info';

      info.innerHTML = `
        <div class="track-title">${track["TÍTULO"] || ''}</div>

        <div class="badges">
          <span class="badge interest">${track["TIPO DE INTERÉS"] || ''}</span>
          <span class="badge listen">${track["FORMA RECOMENDADA DE ESCUCHAR"] || ''}</span>
          <span class="badge status">${track["ESTADO"] || ''}</span>
        </div>

        <div class="track-meta">
          <div><strong>ARTISTAS:</strong> ${track["ARTISTAS"] || ''}</div>
          <div>
            <strong>ÁLBUM:</strong> ${track["ALBUM AL QUE PERTENECE"] || ''} ·
            <strong>AÑO:</strong> ${track["AÑO"] || ''} ·
            <strong>DURACIÓN:</strong> ${track["DURACION"] || ''}
          </div>
        </div>

        <div class="context-box">
          <div class="context-title">CONTEXTO</div>
          <div class="context-text">${track["CONTEXTO"] || ''}</div>
        </div>

        ${track["NOTA EXTRA"] ? `
          <div class="note-box">
            <strong>NOTA:</strong> ${track["NOTA EXTRA"]}
          </div>
        ` : ''}
      `;

      row.appendChild(info);
      list.appendChild(row);

      playBtn.onclick = () => playTrack(track, id);
    });
  });

const audio = document.getElementById('audio');
const player = document.getElementById('player');
const cover = document.getElementById('player-cover');
const title = document.getElementById('player-title');
const playPause = document.getElementById('play-pause');
const progress = document.getElementById('progress');
const time = document.getElementById('time');

function playTrack(track, id) {
  audio.src = `audio/${id}.mp3`;
  audio.play();

  cover.src = `images/${id}.jpg`;
  title.textContent = track["TÍTULO"] || '';

  player.classList.remove('hidden');
  playPause.textContent = '⏸';
}

playPause.onclick = () => {
  if (audio.paused) {
    audio.play();
    playPause.textContent = '⏸';
  } else {
    audio.pause();
    playPause.textContent = '▶';
  }
};

audio.ontimeupdate = () => {
  progress.value = (audio.currentTime / audio.duration) * 100 || 0;
  const m = Math.floor(audio.currentTime / 60);
  const s = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
  time.textContent = `${m}:${s}`;
};

progress.oninput = () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
};
