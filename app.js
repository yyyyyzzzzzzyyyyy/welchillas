let songs = [];
let currentIndex = -1;
let shuffle = false;
let repeat = false;

const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");
const progress = document.getElementById("progress-bar");
const volume = document.getElementById("volume");

const titleEl = document.getElementById("player-title");
const artistEl = document.getElementById("player-artist");
const coverEl = document.getElementById("player-cover");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");

fetch("data.json")
  .then(r => r.json())
  .then(data => {
    songs = data;
    renderSongs();
  });

function renderSongs(){
  const container = document.getElementById("songs-container");
  container.innerHTML = "";

  songs.forEach((song,i)=>{
    const div = document.createElement("div");
    div.className = "song";
    div.innerHTML = `
      <img src="${song["ENLACE IMAGEN"]}">
      <h3>${song["TÍTULO"]}</h3>
      <p>${song.ARTISTAS}</p>
    `;
    div.onclick = ()=>playSong(i);
    container.appendChild(div);
  });
}

function playSong(i){
  currentIndex = i;
  const song = songs[i];

  audio.src = song["ENLACE CANCIÓN"].replace("view?usp=drive_link","preview");
  audio.play();

  titleEl.textContent = song["TÍTULO"];
  artistEl.textContent = song.ARTISTAS;
  coverEl.src = song["ENLACE IMAGEN"];

  playBtn.textContent = "⏸";
}

playBtn.onclick = ()=>{
  if(audio.paused){
    audio.play();
    playBtn.textContent = "⏸";
  }else{
    audio.pause();
    playBtn.textContent = "▶";
  }
};

nextBtn.onclick = ()=>{
  if(shuffle){
    playSong(Math.floor(Math.random()*songs.length));
  }else{
    playSong((currentIndex+1)%songs.length);
  }
};

prevBtn.onclick = ()=>{
  playSong((currentIndex-1+songs.length)%songs.length);
};

shuffleBtn.onclick = ()=>{
  shuffle = !shuffle;
  shuffleBtn.style.color = shuffle ? "#6affc8" : "#fff";
};

repeatBtn.onclick = ()=>{
  repeat = !repeat;
  repeatBtn.style.color = repeat ? "#6aa8ff" : "#fff";
};

audio.ontimeupdate = ()=>{
  progress.value = (audio.currentTime / audio.duration) * 100 || 0;
  currentTimeEl.textContent = format(audio.currentTime);
  durationEl.textContent = format(audio.duration);
};

progress.oninput = ()=>{
  audio.currentTime = (progress.value/100) * audio.duration;
};

volume.oninput = ()=>{
  audio.volume = volume.value;
};

audio.onended = ()=>{
  if(repeat){
    playSong(currentIndex);
  }else{
    nextBtn.onclick();
  }
};

function format(t){
  if(isNaN(t)) return "0:00";
  const m = Math.floor(t/60);
  const s = Math.floor(t%60).toString().padStart(2,"0");
  return `${m}:${s}`;
}
