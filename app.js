const tracksContainer = document.getElementById("tracks");
const audio = document.getElementById("audio");

const player = document.getElementById("player");
const playerImg = document.getElementById("player-img");
const playerTitle = document.getElementById("player-title");
const playPauseBtn = document.getElementById("playPause");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const back10 = document.getElementById("back10");
const forward10 = document.getElementById("forward10");

let currentTrack = null;
let isPlaying = false;

// ==========================
// CARGA DEL JSON
// ==========================
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    data.forEach(track => {
      const trackDiv = document.createElement("div");
      trackDiv.className = "track";

      trackDiv.innerHTML = `
        <img src="${track.imagen}" alt="cover">

        <div class="track-info">
          <div class="track-title">${track.titulo}</div>

          <div class="track-meta">
            <span class="badge ${track.interesColor}">${track.interes}</span>
            <span class="badge ${track.escuchaColor}">${track.formaEscuchar}</span>
            <span class="badge ${track.estadoColor}">${track.estado}</span>
          </div>

          <div class="context-box">
            <div class="context-title">CONTEXTO</div>
            <div>${track.contexto || ""}</div>
          </div>

          ${track.notaExtra ? `
          <div class="note-box">
            <strong>NOTA EXTRA:</strong> ${track.notaExtra}
          </div>` : ""}

        </div>

        <button class="play-btn">▶</button>
      `;

      const playBtn = trackDiv.querySelector(".play-btn");

      playBtn.addEventListener("click", () => {
        loadTrack(track);
      });

      tracksContainer.appendChild(trackDiv);
    });
  });

// ==========================
// REPRODUCTOR
// ==========================
function loadTrack(track) {
  if (currentTrack !== track) {
    audio.src = track.audio;
    playerImg.src = track.imagen;
    playerTitle.textContent = track.titulo;
    currentTrack = track;
  }

  player.classList.remove("hidden");
  audio.play();
  isPlaying = true;
  playPauseBtn.textContent = "⏸";
}

playPauseBtn.addEventListener("click", () => {
  if (!audio.src) return;

  if (isPlaying) {
    audio.pause();
    playPauseBtn.textContent = "▶";
  } else {
    audio.play();
    playPauseBtn.textContent = "⏸";
  }
  isPlaying = !isPlaying;
});

audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  progress.value = (audio.currentTime / audio.duration) * 100;
});

progress.addEventListener("input", () => {
  if (!audio.duration) return;
  audio.currentTime = (progress.value / 100) * audio.duration;
});

volume.addEventListener("input", () => {
  audio.volume = volume.value;
});

back10.addEventListener("click", () => {
  audio.currentTime = Math.max(0, audio.currentTime - 10);
});

forward10.addEventListener("click", () => {
  audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
});
