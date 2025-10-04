const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// === Special Stars (approximate positions RA/Dec) ===
const specialStars = [
  // Orion
  { name: "Betelgeuse", color: "rgb(255,120,80)", ra: 0.28, dec: 0.35 },
  { name: "Rigel", color: "rgb(180,200,255)", ra: 0.33, dec: 0.55 },

  // Virgo
  { name: "Spica", color: "rgb(170,190,255)", ra: 0.65, dec: 0.55 },

  // Pavo
  { name: "Peacock", color: "rgb(120,160,255)", ra: 0.8, dec: 0.75 },

  // Cygnus
  { name: "Deneb", color: "rgb(190,210,255)", ra: 0.55, dec: 0.25 },

  // Cassiopeia
  { name: "Schedar", color: "rgb(255,200,170)", ra: 0.45, dec: 0.2 },
  { name: "Caph", color: "rgb(255,230,200)", ra: 0.42, dec: 0.22 },

  // Andromeda
  { name: "Alpheratz", color: "rgb(255,240,200)", ra: 0.35, dec: 0.28 },
  { name: "Mirach", color: "rgb(255,200,160)", ra: 0.38, dec: 0.32 },
  { name: "Almach", color: "rgb(255,180,140)", ra: 0.40, dec: 0.35 },

  // Perseus
  { name: "Algol", color: "rgb(255,180,160)", ra: 0.52, dec: 0.28 },
  { name: "Mirfak", color: "rgb(255,210,170)", ra: 0.50, dec: 0.25 },

  // Pisces
  { name: "Alrescha", color: "rgb(200,220,255)", ra: 0.60, dec: 0.45 },
  { name: "Torcularis", color: "rgb(230,230,255)", ra: 0.62, dec: 0.48 },

  // Cetus
  { name: "Mira", color: "rgb(255,160,140)", ra: 0.25, dec: 0.55 },
  { name: "Deneb Kaitos", color: "rgb(180,200,255)", ra: 0.27, dec: 0.58 },

  // Hercules
  { name: "Kornephoros", color: "rgb(255,220,180)", ra: 0.58, dec: 0.18 },
  { name: "Rasalgethi", color: "rgb(255,160,120)", ra: 0.60, dec: 0.20 },

  // Draco
  { name: "Eltanin", color: "rgb(255,220,190)", ra: 0.70, dec: 0.15 },
  { name: "Rastaban", color: "rgb(255,200,160)", ra: 0.72, dec: 0.12 },

  // Ophiuchus
  { name: "Rasalhague", color: "rgb(200,220,255)", ra: 0.55, dec: 0.40 },
  { name: "Sabik", color: "rgb(220,220,255)", ra: 0.57, dec: 0.42 }
];

// === Constellation links ===
const constellations = {
  Orion: ["Betelgeuse", "Rigel"],
  Cassiopeia: ["Schedar", "Caph"],
  Cygnus: ["Deneb"],
  Virgo: ["Spica"],
  Pavo: ["Peacock"],
  Andromeda: ["Alpheratz", "Mirach", "Almach"],
  Perseus: ["Mirfak", "Algol"],
  Pisces: ["Alrescha", "Torcularis"],
  Cetus: ["Mira", "Deneb Kaitos"],
  Hercules: ["Kornephoros", "Rasalgethi"],
  Draco: ["Eltanin", "Rastaban"],
  Ophiuchus: ["Rasalhague", "Sabik"]
};

// === Background stars ===
const stars = [];
for (let i = 0; i < 250; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.2,
    baseAlpha: 0.3 + Math.random() * 0.7,
    flicker: Math.random() * 0.05,
    angle: Math.random() * Math.PI * 2,
    speed: 0.00005 + Math.random() * 0.0001
  });
}

// === Init special stars with drift velocity ===
specialStars.forEach(s => {
  s.x = (s.ra - 0.5) * canvas.width + canvas.width / 2;
  s.y = (s.dec - 0.5) * canvas.height + canvas.height / 2;
  s.vx = (Math.random() - 0.5) * 0.2;
  s.vy = (Math.random() - 0.5) * 0.2;
});

// === Drawing ===
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background stars
  stars.forEach(star => {
    star.angle += star.speed;
    const dx = Math.cos(star.angle) * 0.3;
    const dy = Math.sin(star.angle) * 0.3;

    const alpha = star.baseAlpha + Math.sin(Date.now() * 0.002 + star.x) * star.flicker;
    ctx.beginPath();
    ctx.arc((star.x + dx) % canvas.width, (star.y + dy) % canvas.height, star.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fill();
  });

  const positions = {};

  // Special stars drift bebas
  specialStars.forEach(s => {
    s.x += s.vx;
    s.y += s.vy;
    if (s.x < 0 || s.x > canvas.width) s.vx *= -1;
    if (s.y < 0 || s.y > canvas.height) s.vy *= -1;

    positions[s.name] = { x: s.x, y: s.y };

    // Flicker
    const flicker = 0.2 + Math.abs(Math.sin(Date.now() * 0.003 + s.x)) * 0.3;
    ctx.beginPath();
    ctx.arc(s.x, s.y, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = s.color;
    ctx.globalAlpha = 0.7 + flicker * 0.3;
    ctx.fill();
    ctx.globalAlpha = 1;
  });

  // Constellation lines
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = "rgba(200,200,255,0.15)";
  ctx.beginPath();

  for (let [name, starsList] of Object.entries(constellations)) {
    for (let i = 0; i < starsList.length - 1; i++) {
      const s1 = positions[starsList[i]];
      const s2 = positions[starsList[i + 1]];
      if (s1 && s2) {
        ctx.moveTo(s1.x, s1.y);
        ctx.lineTo(s2.x, s2.y);
      }
    }
  }

  ctx.stroke();
  ctx.globalAlpha = 1;
}

function animate() {
  draw();
  requestAnimationFrame(animate);
}
animate();
