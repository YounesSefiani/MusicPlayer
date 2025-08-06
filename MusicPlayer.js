
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
  }
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
