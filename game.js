// ================= HERO =================
const hero = {
  level: 1,
  hp: 100,
  maxHp: 100,
  atk: 12,
  def: 4,
  exp: 0,
  nextExp: 100
};

// ================= ITEMS =================
const items = {
  common: [
    { name: "🟦 Iron Sword", atk: 3 },
    { name: "🟦 Leather Armor", def: 2 }
  ],
  epic: [
    { name: "🟪 Shadow Blade", atk: 8 },
    { name: "🟪 Dark Armor", def: 6 }
  ],
  legendary: [
    { name: "🟨 Monarch Relic", atk: 15, def: 10 }
  ]
};

// ================= MONSTER =================
function monster() {
  return {
    hp: 30 + hero.level * 15,
    atk: 6 + hero.level * 3
  };
}

let enemy = monster();

// ================= ELEMENTS =================
const playerEl = document.getElementById("player");
const monsterEl = document.getElementById("monster");
const screenEl = document.getElementById("screen");

// ================= UI =================
function updateUI() {
  document.getElementById("level").innerText =
    `LVL ${hero.level}  ATK:${hero.atk} DEF:${hero.def}`;

  document.getElementById("hp").style.width =
    (hero.hp / hero.maxHp * 100) + "%";

  document.getElementById("exp").style.width =
    (hero.exp / hero.nextExp * 100) + "%";

  if (hero.level >= 5) {
    document.getElementById("spinBtn").style.display = "block";
  }
}

function log(text) {
  document.getElementById("log").innerText = text;
}

// ================= FIGHT =================
function fight() {

  // ---- АНИМАЦИЯ УДАРА ----
  playerEl.classList.add("attack");
  monsterEl.classList.add("damage");
  screenEl.classList.add("shake");

  setTimeout(() => {
    playerEl.classList.remove("attack");
    monsterEl.classList.remove("damage");
    screenEl.classList.remove("shake");
  }, 250);

  // ---- БОЙ ----
  let dmgToEnemy = Math.max(hero.atk - 3, 1);
  let dmgToHero = Math.max(enemy.atk - hero.def, 1);

  enemy.hp -= dmgToEnemy;
  hero.hp -= dmgToHero;

  if (hero.hp <= 0) {
    hero.hp = hero.maxHp;
    hero.exp = Math.max(hero.exp - 20, 0);
    log("☠ Ты погиб и был возвращён");
    enemy = monster();
    updateUI();
    return;
  }

  if (enemy.hp <= 0) {
    hero.exp += 40 + hero.level * 10;
    log("⚔ Монстр повержен!");

    if (hero.exp >= hero.nextExp && hero.level < 10) {
      levelUp();
    }

    enemy = monster();
  }

  updateUI();
}

// ================= LEVEL UP =================
function levelUp() {
  hero.level++;
  hero.exp = 0;
  hero.nextExp += 80;
  hero.maxHp += 25;
  hero.atk += 6;
  hero.def += 3;
  hero.hp = hero.maxHp;
  log("🔥 LEVEL UP!");
}

// ================= REST =================
function rest() {
  hero.hp = hero.maxHp;
  log("🛌 Отдых восстановил HP");
  updateUI();
}

// ================= SPIN =================
function spin() {
  let roll = Math.random() * 100;
  let rarity;

  if (roll < 65) rarity = "common";
  else if (roll < 90) rarity = "epic";
  else rarity = "legendary";

  let drop = items[rarity][
    Math.floor(Math.random() * items[rarity].length)
  ];

  if (drop.atk) hero.atk += drop.atk;
  if (drop.def) hero.def += drop.def;

  log(`🎰 Выпало: ${drop.name}!`);
  updateUI();
}

// ================= START =================
updateUI();
