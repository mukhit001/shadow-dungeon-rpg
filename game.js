// ================= HERO =================
const hero = {
  level: 1,
  hp: 100,
  maxHp: 100,
  atk: 12,
  def: 4,
  exp: 0,
  nextExp: 100,
  x: 180,
  y: 100
};

const screen = document.getElementById("screen");
const player = document.getElementById("player");

let monsters = [];

// ================= UI =================
function updateUI() {
  document.getElementById("level").innerText =
    `LVL ${hero.level} ATK:${hero.atk}`;

  document.getElementById("hp").style.width =
    (hero.hp / hero.maxHp * 100) + "%";

  document.getElementById("exp").style.width =
    (hero.exp / hero.nextExp * 100) + "%";

  if (hero.level >= 5)
    document.getElementById("spinBtn").style.display = "block";
}

function log(t) {
  document.getElementById("log").innerText = t;
}

// ================= MOVEMENT =================
function move(dir) {
  const speed = 10;
  if (dir === "up") hero.y -= speed;
  if (dir === "down") hero.y += speed;
  if (dir === "left") hero.x -= speed;
  if (dir === "right") hero.x += speed;

  hero.x = Math.max(0, Math.min(360, hero.x));
  hero.y = Math.max(0, Math.min(130, hero.y));

  player.style.left = hero.x + "px";
  player.style.top = hero.y + "px";
}

// ================= MONSTERS =================
function spawnMonster() {
  const type = Math.random();
  let m = {
    hp: 30,
    x: Math.random() * 350,
    y: Math.random() * 130,
    type: "normal"
  };

  if (type > 0.7) {
    m.type = "fast";
    m.hp = 20;
  } else if (type < 0.3) {
    m.type = "tank";
    m.hp = 50;
  }

  const el = document.createElement("div");
  el.className = `monster ${m.type}`;
  el.style.left = m.x + "px";
  el.style.top = m.y + "px";
  screen.appendChild(el);

  m.el = el;
  monsters.push(m);
}

spawnMonster();
spawnMonster();

// ================= ATTACK =================
function attack() {
  monsters.forEach((m, i) => {
    const dx = hero.x - m.x;
    const dy = hero.y - m.y;
    const dist = Math.sqrt(dx*dx + dy*dy);

    if (dist < 50) {
      m.hp -= hero.atk;
      log("⚔ Удар!");

      if (m.hp <= 0) {
        m.el.classList.add("dead");
        setTimeout(() => m.el.remove(), 600);
        monsters.splice(i, 1);
        hero.exp += 40;
        spawnMonster();
      }
    }
  });

  if (hero.exp >= hero.nextExp) levelUp();
  updateUI();
}

// ================= LEVEL UP =================
function levelUp() {
  hero.level++;
  hero.exp = 0;
  hero.nextExp += 80;
  hero.atk += 5;
  hero.maxHp += 20;
  hero.hp = hero.maxHp;
  log("🔥 LEVEL UP!");
}

// ================= REST =================
function rest() {
  hero.hp = hero.maxHp;
  log("🛌 Отдых");
  updateUI();
}

// ================= SPIN =================
function spin() {
  hero.atk += 5;
  log("🎰 Предмет усилил атаку!");
  updateUI();
}

updateUI();
