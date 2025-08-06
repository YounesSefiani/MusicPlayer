/**********BACKGROUND*DU*LECTEUR*DE*MUSIQUE*********/
const colorSchemes = {
  blue: ["#001F3F", "#003366", "#004C99", "#0066CC", "#0080FF", "#3399FF"],
  green: ["#004D1A", "#006622", "#008033", "#009933", "#00B33C", "#00CC44"],
  purple: ["#2A0033", "#3F004D", "#530066", "#660080", "#7A0099", "#8F00B3"],
  red: ["#330000", "#660000", "#990000", "#CC0000", "#FF0000", "#FF3333"],
  teal: ["#003333", "#004D4D", "#006666", "#008080", "#009999", "#00B3B3"],
  orange: ["#331100", "#662200", "#993300", "#CC4400", "#FF5500", "#FF7733"],
  pink: ["#330033", "#4D004D", "#660066", "#800080", "#990099", "#B300B3"],
  yellow: ["#332600", "#664D00", "#997300", "#CC9900", "#FFBF00", "#FFD633"],
};

const columns = Object.keys(colorSchemes);

function createColumns() {
  const wrapper = document.getElementById("music-player-playing-background");
  wrapper.innerHTML = "";

  columns.forEach((columnColor, index) => {
    const column = document.createElement("div");
    column.className = "column";
    column.dataset.colorScheme = columnColor;

    // Create boxes for each column
    const boxCount = Math.ceil(window.innerHeight / 16); // 1rem = 16px
    for (let i = 0; i < boxCount; i++) {
      const box = document.createElement("div");
      box.className = "box";
      column.appendChild(box);
    }

    wrapper.appendChild(column);
  });
}

function animateColumn(column, direction = 1) {
  const boxes = Array.from(column.querySelectorAll(".box"));
  const colorScheme = colorSchemes[column.dataset.colorScheme];

  // Get current colors
  const currentColors = boxes.map((box) => {
    const color = box.style.backgroundColor;
    return colorScheme.indexOf(rgbToHex(color)) !== -1
      ? rgbToHex(color)
      : colorScheme[0];
  });

  // Shift colors
  if (direction > 0) {
    const lastColor = currentColors.pop();
    currentColors.unshift(lastColor);
  } else {
    const firstColor = currentColors.shift();
    currentColors.push(firstColor);
  }

  // Apply new colors
  boxes.forEach((box, i) => {
    box.style.backgroundColor = currentColors[i] || colorScheme[0];
  });
}

function initializeColumns() {
  const columns = document.querySelectorAll(".column");
  columns.forEach((column) => {
    const boxes = column.querySelectorAll(".box");
    const colorScheme = colorSchemes[column.dataset.colorScheme];

    boxes.forEach((box, index) => {
      const colorIndex = index % colorScheme.length;
      box.style.backgroundColor = colorScheme[colorIndex];
    });
  });
}

// Helper function to convert RGB to Hex
function rgbToHex(rgb) {
  if (!rgb) return "#000000";
  if (rgb.startsWith("#")) return rgb;

  const rgbMatch = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (!rgbMatch) return "#000000";

  const r = parseInt(rgbMatch[1]);
  const g = parseInt(rgbMatch[2]);
  const b = parseInt(rgbMatch[3]);

  return (
    "#" +
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
  );
}

// Initial setup
createColumns();
initializeColumns();

// Animate each column independently
document.querySelectorAll(".column").forEach((column, index) => {
  setInterval(() => {
    // Alternate direction based on column index
    const direction = index % 2 === 0 ? 1 : -1;
    animateColumn(column, direction);
  }, 200);
});

// Recreate grid on window resize
window.addEventListener("resize", () => {
  createColumns();
  initializeColumns();
});

/***********************************/

/*********PLAYLIST**********/
const audio = document.getElementById("audio");
const songTitle = document.getElementById("song-title");
const songArtist = document.getElementById("song-artist");
const songAlbum = document.getElementById("song-album");
const track = document.getElementById("music-player-playlist-track");
let currentTrackId = 0;

const trackList = [
  {
    id: 1,
    title: "Change Your Life",
    artist: "Anna Tsuchiya",
    album: "Strip Me?",
    genre: "J-Rock",
    cover: "./cover/change_your_life.jpg",
    src: "./songs/anna_tsuchiya_change_your_life.mp3",
  },
  {
    id: 2,
    title: "Anger's Remorse",
    artist: "Old Gods of Asgard",
    album: "Rebirth",
    genre: "Heavy Metal",
    cover: "./cover/old_gods_of_asgard_rebirth.jpg",
    src: "./songs/old_gods_of_asgard_anger_remorse.mp3",
  },
  {
    id: 3,
    title: "War",
    artist: "Poets of The Fall",
    album: "Twilight Theater",
    genre: "Rock",
    cover: "./cover/poets_of_the_fall_twilight_theater.jpg",
    src: "./songs/poets_of_the_fall_war.mp3",
  },
  {
    id: 4,
    title: "L'odeur de l'essence",
    artist: "Orelsan",
    album: "Civilisation",
    genre: "Rap",
    cover: "./cover/orelsan_civilisation.jpg",
    src: "./songs/orelsan_lodeur_de_lessence.mp3",
  },
  {
    id: 5,
    title: "Nothing to Change",
    artist: "B'Z",
    album: "B'Z",
    genre: "J-Rock",
    cover: "./cover/bz_album.jpg",
    src: "./songs/bz_nothing_to_change.mp3",
  },
  {
    id: 6,
    title: "Zetsubou Billy",
    artist: "Maximum The Hormone",
    album: "Bu-iikikaesu",
    genre: "J-Rock",
    cover: "./cover/maximum_the_hormone_buiikikaesu.jpg",
    src: "./songs/maximum_the_hormone_zetsubou_billy.mp3",
  },
];

const playlist = document.getElementById("music-player-playlist-list");
trackList.forEach((track) => {
  const playlistTrack = document.createElement("div");
  playlistTrack.classList.add("music-player-playlist-track");
  playlistTrack.innerHTML = `
    <div id="music-track-cover">
      <img src="${track.cover}" alt="jaquette"></i>
    </div>
    <div id="music-track-infos">
      <div id="music-track-infos-top">
        <p id="music-track-artist">${track.artist}</p>
        <p id="music-track-title">${track.title}</p>
      </div>
      <div class="music-track-line"></div>
      <div id="music-track-infos-bottom">
        <p id="music-track-album">${track.album}</p>
        <p id="music-track-genre">${track.genre}</p>
      </div>
    </div>
      <button type="button" id="playTrack" onclick="playing(${track.id - 1})">
        <i class="fa-solid fa-play"></i>
      </button>
    </div>
  `;
  playlist.appendChild(playlistTrack);
});

/***********************************/

/**********FONCTIONS**********/
function loadAndPlayTrack() {
  const track = trackList[currentTrackId];
  songTitle.textContent = track.title;
  songArtist.textContent = track.artist;
  songAlbum.textContent = track.album;
  audio.src = track.src;
  audio.load();
  audio.play();
  rotateVinyle();

  updateCoverImage();
}

function stopTrack() {
  songTitle.textContent = "Title";
  songArtist.textContent = "Artiste / Groupe";
  songAlbum.textContent = "Album";
  audio.src = "";
  audio.load();
  currentTrackId = 0;
}

function updateTrackInfo() {
  const track = trackList[currentTrackId];
  songTitle.textContent = track.title;
  songArtist.textContent = track.artist;
  songAlbum.textContent = track.album;
}

function updateCoverImage() {
  const coverImage = document.getElementById("music-player-cover");
  const currentTrack = trackList[currentTrackId];

  coverImage.innerHTML = "";

  if (currentTrack.cover) {
    const img = document.createElement("img");
    img.src = currentTrack.cover;
    coverImage.appendChild(img);
  } else {
    coverImage.innerHTML = '<i class="fa-solid fa-compact-disc"></i>';
  }
}

const timerElapsed = document.querySelector(".player-timer p:nth-child(1)");
const timerTotal = document.querySelector(".player-timer p:nth-child(2)");

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

audio.addEventListener("loadedmetadata", () => {
  timerTotal.textContent = formatTime(audio.duration);
});

const progressBar = document.getElementById("progress-bar");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");

audio.addEventListener("timeupdate", () => {
  const current = audio.currentTime;
  const total = audio.duration;

  // Mise à jour de la barre
  const percent = (current / total) * 100;
  progressBar.style.width = `${percent}%`;

  // Mise à jour des timers
  currentTimeEl.textContent = formatTime(current);
  durationEl.textContent = formatTime(total);
});

function formatTime(time) {
  if (!time) return "--:--";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

const progressContainer = document.getElementById("progress-container");

progressContainer.addEventListener("click", (e) => {
  const rect = progressContainer.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const width = rect.width;
  const percent = clickX / width;

  audio.currentTime = percent * audio.duration;
});

audio.addEventListener("loadedmetadata", updateTrackInfo);

audio.addEventListener("ended", nextSong);

const play = document.querySelector("#playBtn i");
const vinyle = document.getElementById("vinyle");
let rotation = 0;
let animationFrameId = null;

let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let trackLoaded = false;

function rotateVinyle() {
  // Empêche plusieurs animations actives
  if (animationFrameId) return;

  function animate() {
    rotation += 0.5; // Vitesse
    if (rotation >= 360) rotation -= 360;

    vinyle.style.transform = `rotate(${rotation}deg)`;

    // Si on est encore en lecture, continue
    if (isPlaying) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      // Sinon, stoppe l'animation proprement
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  // Lance l’animation
  animationFrameId = requestAnimationFrame(animate);
}
function playing(newTrackId = currentTrackId) {
  const playIcon = document.querySelector("#playBtn i");

  if (newTrackId !== currentTrackId) {
    currentTrackId = newTrackId;
    trackLoaded = false;
    isPlaying = false; // on force le rechargement de la nouvelle piste
  }

  if (!isPlaying) {
    if (!trackLoaded) {
      loadAndPlayTrack(); // Charge la piste uniquement la première fois
      updateCoverImage();
      trackLoaded = true;
    }

    audio.play();
    isPlaying = true;

    rotateVinyle();
    playIcon.classList.replace("fa-play", "fa-pause");
  } else {
    audio.pause();
    isPlaying = false;

    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
    playIcon.classList.replace("fa-pause", "fa-play");
  }
}

function stopSong() {
  audio.pause();
  audio.currentTime = 0;
  isPlaying = false;
  cancelAnimationFrame(animationFrameId);
  animationFrameId = null;
  progressBar.style.width = "0%";

  const playIcon = document.querySelector("#playBtn i");
  playIcon.classList.replace("fa-pause", "fa-play");
  stopTrack();

  const coverImage = document.getElementById("music-player-cover");
  coverImage.innerHTML = '<i class="fa-solid fa-compact-disc"></i>';

  const vinyle = document.getElementById("vinyle");
  vinyle.style.transform = "rotate(0deg)";

  trackLoaded = false;
}

function nextSong() {
  if (isShuffle) {
    let randomTrackId;
    do {
      randomTrackId = Math.floor(Math.random() * trackList.length);
    } while (randomTrackId === currentTrackId && trackList.length > 1);

    currentTrackId = randomTrackId;
  } else {
    currentTrackId = (currentTrackId + 1) % trackList.length; // revient à 0 si on est à la fin
  }

  if (isRepeat) {
    repeatPlayer();
    audio.play();
    return;
  }

  if (isPlaying) {
    loadAndPlayTrack();
    audio.play();
    updateCoverImage();
  } else {
    loadAndPlayTrack();
    audio.pause();
    updateCoverImage();
  }
}

function previousSong() {
  if (isShuffle) {
    let randomTrackId;
    do {
      randomTrackId = Math.floor(Math.random() * trackList.length);
    } while (randomTrackId === currentTrackId && trackList.length > 1);

    currentTrackId = randomTrackId;
  } else {
    currentTrackId = (currentTrackId - 1 + trackList.length) % trackList.length;
  }

  if (isPlaying) {
    loadAndPlayTrack();
    audio.play();
    updateCoverImage();
  } else {
    loadAndPlayTrack();
    audio.pause();
    updateCoverImage();
  }
}

function shufflePlayer() {
  if (!isShuffle) {
    isShuffle = true;
    currentTrackId = Math.floor(Math.random() * trackList.length);
  }
}

const shuffleBtn = document.getElementById("shuffleBtn");
function toggleShuffle() {
  if (!isShuffle) {
    isShuffle = true;
    shufflePlayer();
    shuffleBtn.classList.add("active");
  } else {
    isShuffle = false;
    shuffleBtn.classList.remove("active");
  }
}

function repeatPlayer() {
  if (!isRepeat) {
    isRepeat = true;
    audio.currentTime = 0;
    audio.play();
  }
}

function toggleRepeat() {
  if (!isRepeat) {
    isRepeat = true;
    repeatPlayer();
    repeatBtn.classList.add("active");
  } else {
    isRepeat = false;
    repeatBtn.classList.remove("active");
  }
}

/***********************************/
