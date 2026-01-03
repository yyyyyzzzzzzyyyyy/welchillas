const list = document.getElementById('music-list');

/* === FUNCIÓN ROBUSTA PARA LEER COLUMNAS === */
function get(track, keys) {
  const normalized = {};
  Object.keys(track).forEach(k => {
    const clean = k
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/\n/g, ' ')
      .trim();
    normalized[clean] = track[k];
  });

  for (let key of keys) {
    const cleanKey = key
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/\n/g, ' ')
      .trim();

    if (normalized[cleanKey]) {
      return normalized[cleanKey];
    }
  }

  return '—';
}

/* === CARGA DE DATOS === */
fetch('data.json')
  .then(res => res.json())
  .then(data => {
    data.forEach(track => {
      const id = String(track.ID).padStart(2, '0');

      const row = document.createElement('div');
      row.className = 'track';

      row.innerHTML = `
        <img src="images/${id}.jpg">

        <button class="play-btn">▶</button>

        <div class="track-info">
          <div class="track-title">
            ${get(track, ['TÍTULO','TITULO'])}
          </div>

          <div class="badges">
            <span class="badge interest">
              ${get(track, ['TIPO DE INTERÉS','TIPO DE INTERES'])}
            </span>
            <span class="badge listen">
              ${get(track, ['FORMA RECOMENDADA DE ESCUCHAR'])}
            </span>
            <span class="badge status">
              ${get(track, ['ESTADO'])}
            </span>
          </div>

          <div class="track-meta">
            <div><strong>ARTISTAS:</strong>
              ${get(track, ['ARTISTAS'])}
            </div>
            <div>
              <strong>ÁLBUM:</strong>
              ${get(track, ['ALBUM AL QUE PERTENECE','ALBUM'])}
              · <strong>AÑO:</strong>
              ${get(track, ['AÑO','ANO'])}
              · <strong>DURACIÓN:</strong>
              ${get(track, ['DURACION','DURACIÓN'])}
            </div>
          </div>

          <div class="context-box">
            <div class="context-title">CONTEXTO</div>
            ${get(track, ['CONTEXTO'])}
          </div>

          <div class="note-box">
            <strong>NOTA:</strong>
            ${get(track, ['NOTA EXTRA','NOTA'])}
          </div>
        </div>
      `;

      list.appendChild(row);

      row.querySelector('.play-btn').onclick = () => play(track, id);
    });
  });

/* === REPRODUCTOR === */
const audio = document.getElementById('audio');
const player = document.getElementById('player');
const cover = document.getElementById('player-cover');
const title = document.getElementById('player-title');
const playPause = document.getElementById('play-pause');
const progress = document.getElementById('progress');
const time = document.getElementById('time');

function play(track, id) {
  audio.src = `audio/${id}.mp3`;
  audio.play();
  cover.src = `images/${id}.jpg`;
  title.textContent = get(track, ['TÍTULO','TITULO']);
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
