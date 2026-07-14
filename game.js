const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const ui = {
  modeName: document.getElementById("modeName"),
  modeTimer: document.getElementById("modeTimer"),
  stageReadout: document.getElementById("stageReadout"),
  riftReadout: document.getElementById("riftReadout"),
  powerReadout: document.getElementById("powerReadout"),
  ammoMeter: document.getElementById("ammoMeter"),
  ammoReadout: document.getElementById("ammoReadout"),
  aiDifficultyReadout: document.getElementById("aiDifficultyReadout"),
  bricks: document.getElementById("bricks"),
  grizzles: document.getElementById("grizzles"),
  leaderboard: document.getElementById("leaderboard"),
  spinBtn: document.getElementById("spinBtn"),
  shopBtn: document.getElementById("shopBtn"),
  resetBtn: document.getElementById("resetBtn"),
  wheelModal: document.getElementById("wheelModal"),
  wheelResult: document.getElementById("wheelResult"),
  modeChoices: document.getElementById("modeChoices"),
  challengeChoices: document.getElementById("challengeChoices"),
  aiDifficultyChoices: document.getElementById("aiDifficultyChoices"),
  shopModal: document.getElementById("shopModal"),
  closeShopBtn: document.getElementById("closeShopBtn"),
  shopItems: document.getElementById("shopItems"),
  toast: document.getElementById("toast"),
};

const modes = [
  { id: "normal", label: "Normal Play", seconds: 300, color: "#38d6a9", text: "Classic 200-stage obby run." },
  { id: "race", label: "Race", seconds: 300, color: "#ffd24a", text: "Race AI players to the finish." },
  { id: "coins", label: "Coins", seconds: 300, color: "#62b7ff", text: "Coins appear across the course." },
  { id: "war", label: "War", seconds: 300, color: "#ff5c7a", text: "50-ammo blaster fight on the obby." },
  { id: "lava", label: "Lava Rising", seconds: 300, color: "#ff8f3d", text: "Lava climbs upward while you run." },
  { id: "boss", label: "Boss Obby", seconds: 300, color: "#c68cff", text: "A floating boss randomly targets a runner." },
  { id: "trex", label: "T-Rex Boss", seconds: 180, color: "#9fdb6f", text: "Very hard paid fight: 500 bricks + 2 grizzles." },
  { id: "disaster", label: "Random Disaster", seconds: 300, color: "#6fffe0", text: "Wind, meteors, lightning, fog, and more rotate." },
  { id: "dark", label: "Dark Mode", seconds: 300, color: "#8da0ff", text: "A dark course with a flashlight view." },
  { id: "endless", label: "Endless", seconds: Infinity, color: "#c68cff", text: "Keep climbing generated stages forever." },
];

const lavaCourseLiftSpeed = 0.035;
const grizzlePlayRewardSeconds = 13 * 60;

const aiDifficulties = {
  easy: {
    label: "Easy",
    accelBase: 15.5,
    accelMood: 4.5,
    speedBase: 5.9,
    speedMood: 1.35,
    jumpRangeBase: 8.0,
    jumpRangeMood: 0.6,
    jumpRangeDy: 0.45,
    jumpWait: 0.82,
    jumpBase: 8.2,
    jumpMood: 0.75,
    jumpDy: 0.12,
    shotBase: 1.25,
    shotRandom: 1.45,
    playerTargetChance: 0.52,
  },
  normal: {
    label: "Normal",
    accelBase: 18.5,
    accelMood: 5.4,
    speedBase: 6.8,
    speedMood: 1.7,
    jumpRangeBase: 8.5,
    jumpRangeMood: 0.78,
    jumpRangeDy: 0.52,
    jumpWait: 0.72,
    jumpBase: 8.65,
    jumpMood: 0.95,
    jumpDy: 0.15,
    shotBase: 0.95,
    shotRandom: 1.15,
    playerTargetChance: 0.66,
  },
  hard: {
    label: "Hard",
    accelBase: 23,
    accelMood: 7.2,
    speedBase: 8.15,
    speedMood: 2.35,
    jumpRangeBase: 9.1,
    jumpRangeMood: 0.95,
    jumpRangeDy: 0.62,
    jumpWait: 0.62,
    jumpBase: 9.15,
    jumpMood: 1.15,
    jumpDy: 0.18,
    shotBase: 0.68,
    shotRandom: 0.9,
    playerTargetChance: 0.82,
  },
  ultra: {
    label: "Ultra Hard",
    accelBase: 31,
    accelMood: 10,
    speedBase: 10.2,
    speedMood: 3.4,
    jumpRangeBase: 10.8,
    jumpRangeMood: 1.45,
    jumpRangeDy: 0.85,
    jumpWait: 0.38,
    jumpBase: 10.3,
    jumpMood: 1.55,
    jumpDy: 0.26,
    shotBase: 0.34,
    shotRandom: 0.55,
    playerTargetChance: 0.96,
  },
};

const gear = [
  { name: "Jump Coil", currency: "bricks", cost: 500, duration: 60, key: "jumpCoil", text: "Higher jumps for 1 minute." },
  { name: "Speed Coil", currency: "bricks", cost: 600, duration: 60, key: "speedCoil", text: "Faster running for 1 minute." },
  { name: "Magic Carpet", currency: "bricks", cost: 3000, duration: 60, key: "carpet", text: "Float over gaps for 1 minute." },
];

const eggs = [
  { name: "Normal Egg", currency: "bricks", cost: 300, tier: "normal" },
  { name: "Super Egg", currency: "bricks", cost: 600, tier: "super" },
  { name: "Epic Egg", currency: "bricks", cost: 1000, tier: "epic" },
  { name: "Legendary Egg", currency: "bricks", cost: 2000, tier: "legendary" },
  { name: "Ultra Egg", currency: "bricks", cost: 3500, tier: "ultra" },
];

const grizzleItems = [
  { name: "4 Min Speed Coil", currency: "grizzles", cost: 5, duration: 240, key: "speedCoil", text: "Longer speed boost." },
  { name: "5 Min Jump Coil", currency: "grizzles", cost: 5, duration: 300, key: "jumpCoil", text: "Longer jump boost." },
  { name: "5 Min Magic Carpet", currency: "grizzles", cost: 23, duration: 300, key: "carpet", text: "Longer carpet flight." },
  { name: "2 Min Invisible Potion", currency: "grizzles", cost: 3, duration: 120, key: "invisible", text: "Harder for war shots to hit." },
  { name: "2 Min Immortal Potion", currency: "grizzles", cost: 8, duration: 120, key: "immortal", text: "Respawn anywhere for 2 minutes." },
];

const zoneThemes = [
  { name: "Sky Foundry", color: "#38d6a9", accent: "#e9fff8", pattern: "bolts" },
  { name: "Neon Circuit", color: "#4aa9ff", accent: "#ffd24a", pattern: "circuit" },
  { name: "Candy Rift", color: "#ff7aa6", accent: "#fff0a6", pattern: "stripes" },
  { name: "Crystal Garden", color: "#8fdb6f", accent: "#c68cff", pattern: "crystal" },
  { name: "Moon Dock", color: "#8da0ff", accent: "#6fffe0", pattern: "stars" },
];

const riftPowers = [
  { id: "comet", label: "Comet Dash", color: "#ffd24a" },
  { id: "feather", label: "Feather Fall", color: "#8da0ff" },
  { id: "magnet", label: "Magnet Boots", color: "#6fffe0" },
  { id: "echo", label: "Echo Jump", color: "#ff7aa6" },
];

const state = {
  width: 1,
  height: 1,
  dpr: 1,
  keys: new Set(),
  platforms: [],
  coins: [],
  shots: [],
  bots: [],
  endlessCount: 0,
  riftStreak: 0,
  bestRiftStreak: 0,
  riftFlash: 0,
  stageBrickMilestone: 0,
  grizzlePlaySeconds: 0,
  riftPower: { id: "none", label: "none", color: "#f8fbff", time: 0 },
  riftDashCooldown: 0,
  echoJumpReady: false,
  bricks: 300,
  grizzles: 1,
  aiDifficulty: "hard",
  mode: modes[0],
  modeEndsAt: 0,
  roundActive: false,
  lavaLevel: -18,
  lavaStartAt: 0,
  lavaBaseLevel: -18,
  lavaCourseLift: 0,
  bossShots: [],
  bossClock: 2.2,
  trexBackup: null,
  trex: { hits: 0, shotClock: 0.7, specialClock: 30, special: "none", specialTime: 0, ended: false },
  disaster: { type: "calm", time: 0, next: 8 },
  shopTab: "gear",
  lastTime: performance.now(),
  camera: { x: 0, y: 3, z: -2.2, yaw: 0, pitch: -0.1, dragging: false, lastX: 0, lastY: 0 },
};

const player = makeRunner("You", "#39d98a", true);

function makeRunner(name, color, isPlayer = false) {
  return {
    name,
    color,
    isPlayer,
    x: 0,
    y: 1.25,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    stage: 0,
    checkpoint: 0,
    onGround: false,
    finishTime: 0,
    aiMood: Math.random(),
    aiWait: 0,
    shotClock: 1 + Math.random() * 2,
    ammo: 50,
    prevY: 1.25,
    buffs: {
      speedCoil: 0,
      jumpCoil: 0,
      carpet: 0,
      invisible: 0,
      immortal: 0,
    },
  };
}

function resize() {
  state.dpr = Math.min(window.devicePixelRatio || 1, 2);
  state.width = Math.floor(window.innerWidth);
  state.height = Math.floor(window.innerHeight);
  canvas.width = Math.floor(state.width * state.dpr);
  canvas.height = Math.floor(state.height * state.dpr);
  canvas.style.width = `${state.width}px`;
  canvas.style.height = `${state.height}px`;
  ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
}

function buildCourse() {
  state.platforms = [];
  state.coins = [];
  state.endlessCount = 0;
  state.riftStreak = 0;

  addPlatform({
    x: 0,
    y: 0,
    z: 0,
    w: 10,
    d: 10,
    h: 1.2,
    color: "#52b6ff",
    accent: "#f8fbff",
    zone: "Launch Plaza",
    pattern: "circuit",
    tag: "start",
  });
  const lanes = [0, 1.7, 3.2, 1.7, 0, -1.7, -3.2, -1.7];
  const totalStages = 200;
  const finalStep = totalStages - 1;
  let previous = state.platforms[0];
  let y = 0.22;
  for (let i = 1; i < finalStep; i += 1) {
    const theme = zoneThemes[Math.floor((i - 1) / 10) % zoneThemes.length];
    const progress = i / (finalStep - 1);
    const hardEnd = progress > 0.6;
    const finalStretch = progress > 0.78;
    const formationStep = i % 64;
    const ringRun = formationStep >= 18 && formationStep <= 30;
    const spiralStair = formationStep >= 42 && formationStep <= 54;
    const circlePlatform = i % 64 === 31 || i % 64 === 55;
    const stairRun = spiralStair || (i % 42 >= 8 && i % 42 <= 16);
    const checkpoint = i % 10 === 0;
    const checkpointStair = checkpoint && stairRun;
    const checkpointMoving = checkpoint && !checkpointStair;
    const allowObstacles = !checkpoint;
    const bigSpinner = allowObstacles && !ringRun && !spiralStair && (i % 34 === 0 || (hardEnd && i % 23 === 0) || (finalStretch && i % 17 === 0));
    const narrow = i % 6 === 0 || (hardEnd && i % 4 === 0);
    const hazard = allowObstacles && (i % 7 === 0 || (finalStretch && i % 5 === 0));
    const w = bigSpinner
      ? 9.2
      : circlePlatform
        ? 10.5
        : ringRun
          ? 4.9
          : Math.max(finalStretch ? 3.6 : 4.2, (narrow ? 4.8 : 6.4 + (i % 3) * 0.7) - progress * 1.35 + (stairRun ? 0.25 : 0));
    const d = bigSpinner
      ? 9.2
      : circlePlatform
        ? 10.5
        : ringRun
          ? 4.9
          : Math.max(finalStretch ? 4.2 : 4.8, (narrow ? 5 : 6.4) - progress * 0.85 - (stairRun ? 0.2 : 0));
    const gap = bigSpinner
      ? 2.25
      : ringRun || spiralStair
        ? 0.95
        : Math.min(3.15, (narrow ? 1.25 : 1.65 + (i % 4) * 0.2) + progress * 0.85 + (finalStretch && i % 3 === 0 ? 0.25 : 0) - (stairRun ? 0.35 : 0));
    const laneX = lanes[i % lanes.length];
    const ringT = (formationStep - 18) / 12;
    const spiralT = (formationStep - 42) / 12;
    const x = ringRun
      ? Math.sin(ringT * Math.PI * 1.65 - Math.PI * 0.4) * 9
      : spiralStair
        ? Math.cos(spiralT * Math.PI * 1.75) * (5.8 + spiralT * 2.2)
        : laneX;
    const z = previous.z + previous.d / 2 + d / 2 + gap;
    y += (spiralStair ? 0.58 : ringRun ? 0.26 : stairRun ? 0.46 : i % 3 === 0 ? 0.36 : 0.22) + (finalStretch && i % 5 === 0 ? 0.1 : 0);
    const platformColor = hazard ? shade(theme.color, -24) : i % 2 === 0 ? theme.color : shade(theme.color, 18);
    const platform = {
      x,
      y,
      z,
      w,
      d,
      h: 1.1,
      color: platformColor,
      accent: theme.accent,
      zone: theme.name,
      pattern: theme.pattern,
      rift: allowObstacles && (i === 4 || i % 9 === 0 || (hardEnd && i % 17 === 0)),
      crystal: allowObstacles && (i === 3 || i % 13 === 0 || (finalStretch && i % 6 === 0)),
      boostPad: allowObstacles && (i % 11 === 0 || (finalStretch && i % 15 === 0) || (stairRun && i % 5 === 0)),
      gravityWell: allowObstacles && (i === 6 || i % 14 === 0 || (hardEnd && i % 9 === 0)),
      prismRail: false,
      stairRun,
      ringRun,
      spiralStair,
      circlePlatform,
      bigSpinner,
      laserGate: allowObstacles && (i % 27 === 0 || (hardEnd && i % 14 === 0) || (finalStretch && i % 10 === 0)),
      spikes: allowObstacles && (i % 16 === 0 || (hardEnd && i % 6 === 0) || (finalStretch && i % 4 === 0) || (stairRun && i % 3 === 0)),
      lavaPad: allowObstacles && ((hardEnd && i % 11 === 0) || (finalStretch && i % 7 === 0) || (stairRun && i % 5 === 0)),
      sweeper: allowObstacles && ((hardEnd && i % 13 === 0) || (finalStretch && i % 9 === 0)),
      tag: checkpoint ? "checkpoint" : "step",
      motion: checkpointMoving || i % 12 === 0 || (hardEnd && i % 7 === 0) || (finalStretch && i % 5 === 0) ? i * 0.43 : 0,
    };
    addPlatform(platform);
    previous = platform;
  }

  addPlatform({
    x: 0,
    y: y + 0.55,
    z: previous.z + previous.d / 2 + 6.6,
    w: 13,
    d: 10,
    h: 1.4,
    color: "#31d095",
    accent: "#ffd24a",
    zone: "Grizzle Crown",
    pattern: "stars",
    rift: true,
    gravityWell: true,
    tag: "finish",
  });

  const eligible = state.platforms
    .map((p, index) => ({ p, index }))
    .filter((entry) => entry.p.tag !== "start" && entry.p.tag !== "finish");
  for (let i = 0; i < 200; i += 1) {
    const { p, index } = eligible[i % eligible.length];
    const column = (i * 37) % 100 / 100 - 0.5;
    const row = (i * 53) % 100 / 100 - 0.5;
    state.coins.push({
      id: i,
      platformIndex: index,
      x: p.x + column * Math.max(1, p.w - 1.2),
      y: p.y + 1.1,
      z: p.z + row * Math.max(1, p.d - 1.2),
      baseY: p.y + 1.1,
      taken: false,
      pulse: Math.random() * Math.PI * 2,
    });
  }
}

function addPlatform(platform) {
  state.platforms.push({ ...platform, ox: platform.x, oz: platform.z });
}

function resetRunner(runner, checkpoint = runner.checkpoint, message = "") {
  const p = state.platforms[checkpoint] || state.platforms[0];
  runner.x = p.x;
  runner.y = p.y + 1.25;
  runner.z = p.z;
  runner.vx = 0;
  runner.vy = 0;
  runner.vz = 0;
  runner.stage = checkpoint;
  runner.checkpoint = checkpoint;
  runner.onGround = false;
  if (runner.isPlayer) {
    if (runner.buffs.immortal <= 0) state.riftStreak = 0;
    state.echoJumpReady = false;
    showToast(message || (runner.buffs.immortal > 0 ? "Respawned with immortal potion." : "Back at checkpoint."));
  }
}

function setupBots() {
  const names = ["BoltBen", "Mika", "Jax", "Skye", "Nova", "Rin"];
  const colors = ["#f94f6d", "#4aa9ff", "#ffd24a", "#c68cff", "#ff8f70", "#33d6c5"];
  state.bots = names.map((name, index) => {
    const bot = makeRunner(name, colors[index], false);
    bot.x = -2 + index * 0.8;
    bot.z = -1.5 - index * 0.5;
    bot.y = 1.25;
    return bot;
  });
}

function placeBotAtStart(bot, index) {
  const start = state.platforms[0];
  const lane = index - (state.bots.length - 1) / 2;
  bot.x = start.x + lane * 1.25;
  bot.y = start.y + 1.25;
  bot.z = start.z;
}

function resetWarAmmo() {
  [player, ...state.bots].forEach((runner) => {
    runner.ammo = 50;
  });
}

function buildTrexArena() {
  if (!state.trexBackup) {
    state.trexBackup = {
      platforms: state.platforms,
      coins: state.coins,
      endlessCount: state.endlessCount,
    };
  }
  state.platforms = [];
  state.coins = [];
  state.endlessCount = 0;
  const total = 36;
  const radius = 25;
  for (let i = 0; i < total; i += 1) {
    const angle = Math.PI + (i / total) * Math.PI * 2;
    const checkpoint = i % 6 === 0;
    const wide = i % 9 === 0;
    addPlatform({
      x: Math.sin(angle) * radius,
      y: Math.sin(i * 0.55) * 0.55 + Math.floor(i / 6) * 0.22,
      z: Math.cos(angle) * radius,
      w: wide ? 8.2 : checkpoint ? 7.2 : 5.6,
      d: wide ? 8.2 : checkpoint ? 7.2 : 5.6,
      h: 1.12,
      color: checkpoint ? "#9fdb6f" : i % 2 === 0 ? "#6fd07b" : "#4a9d64",
      accent: "#fff0a6",
      zone: "T-Rex Ring",
      pattern: i % 3 === 0 ? "crystal" : "bolts",
      tag: i === 0 ? "start" : checkpoint ? "checkpoint" : "step",
      rift: false,
      boostPad: false,
      gravityWell: false,
      stairRun: false,
      spikes: !checkpoint && i % 5 === 0,
      lavaPad: !checkpoint && i % 7 === 0,
      sweeper: !checkpoint && i % 8 === 0,
      bigSpinner: !checkpoint && i % 11 === 0,
      laserGate: !checkpoint && i % 13 === 0,
      motion: !checkpoint && i % 4 === 0 ? i * 0.36 : 0,
      trexArena: true,
    });
  }
}

function restoreTrexArena() {
  if (!state.trexBackup) return;
  state.platforms = state.trexBackup.platforms;
  state.coins = state.trexBackup.coins;
  state.endlessCount = state.trexBackup.endlessCount;
  state.trexBackup = null;
}

function resetTrexFight() {
  state.trex = { hits: 0, shotClock: 0.7, specialClock: 30, special: "none", specialTime: 0, ended: false };
}

function restoreLavaCourse() {
  for (const p of state.platforms) {
    if (Number.isFinite(p.lavaBaseY)) {
      p.y = p.lavaBaseY;
      delete p.lavaBaseY;
    }
  }
  state.lavaCourseLift = 0;
}

function setLavaCourseLift(lift) {
  state.lavaCourseLift = lift;
  state.platforms.forEach((p, index) => {
    if (!Number.isFinite(p.lavaBaseY)) p.lavaBaseY = p.y;
    const liftBias = 0.45 + Math.min(1, index / 70) * 0.65;
    p.y = p.lavaBaseY + lift * liftBias;
  });
}

function resetRoundRunners() {
  player.finishTime = 0;
  resetRunner(player, 0);
  state.bots.forEach((runner, index) => {
    runner.finishTime = 0;
    runner.aiWait = 0;
    runner.shotClock = 1 + Math.random() * 2;
    resetRunner(runner, 0);
    placeBotAtStart(runner, index);
  });
}

function startMode(mode) {
  restoreTrexArena();
  restoreLavaCourse();
  state.mode = mode;
  const now = performance.now();
  if (mode.id === "trex") buildTrexArena();
  resetRoundRunners();
  state.roundActive = true;
  state.lastTime = now;
  state.modeEndsAt = now + mode.seconds * 1000;
  state.stageBrickMilestone = 0;
  ui.modeName.textContent = mode.label;
  state.shots = [];
  state.bossShots = [];
  state.bossClock = 1.7;
  resetTrexFight();
  state.lavaLevel = Math.max(-18, player.y - 8);
  state.lavaStartAt = now;
  state.lavaBaseLevel = state.lavaLevel;
  state.lavaCourseLift = 0;
  state.disaster = { type: "calm", time: 0, next: 8 };

  if (mode.id === "coins") {
    state.coins.forEach((coin) => {
      coin.taken = false;
    });
    showToast("Coins mode started.");
  }

  if (mode.id === "race") {
    showToast("Race mode started.");
  } else if (mode.id === "coins") {
    return;
  } else if (mode.id === "war") {
    resetWarAmmo();
    showToast("War mode started.");
  } else if (mode.id === "lava") {
    showToast("Lava Rising started.");
  } else if (mode.id === "boss") {
    showToast("Boss Obby started.");
  } else if (mode.id === "trex") {
    state.camera.yaw = 0;
    state.camera.pitch = -0.08;
    showToast("T-Rex Boss started. Survive 3 minutes.");
  } else if (mode.id === "disaster") {
    showToast("Random Disaster started.");
  } else if (mode.id === "dark") {
    showToast("Dark Mode started.");
  } else if (mode.id === "endless") {
    player.finishTime = 0;
    state.endlessCount = Math.max(0, state.platforms.length - 1);
    ensureEndlessPlatforms();
    showToast("Endless mode started.");
  } else {
    showToast(`${mode.label} started.`);
  }
}

function renderModeChoices() {
  ui.modeChoices.innerHTML = "";
  ui.challengeChoices.innerHTML = "";
  for (const mode of modes) {
    const button = document.createElement("button");
    button.className = `mode-choice${mode.id === "trex" ? " challenge-choice" : ""}`;
    button.style.borderColor = mode.color;
    button.innerHTML = `<strong>${mode.label}</strong><span>${mode.text}</span>`;
    button.addEventListener("click", () => chooseMode(mode));
    (mode.id === "trex" ? ui.challengeChoices : ui.modeChoices).append(button);
  }
}

function renderDifficultyChoices() {
  ui.aiDifficultyChoices.innerHTML = "";
  for (const [id, difficulty] of Object.entries(aiDifficulties)) {
    const button = document.createElement("button");
    button.className = `difficulty-choice${state.aiDifficulty === id ? " active" : ""}`;
    button.type = "button";
    button.textContent = difficulty.label;
    button.addEventListener("click", () => chooseAiDifficulty(id));
    ui.aiDifficultyChoices.append(button);
  }
  ui.aiDifficultyReadout.textContent = (aiDifficulties[state.aiDifficulty] || aiDifficulties.hard).label;
}

function chooseAiDifficulty(id) {
  if (!aiDifficulties[id]) return;
  state.aiDifficulty = id;
  renderDifficultyChoices();
  showToast(`AI difficulty: ${aiDifficulties[id].label}.`);
}

function openModeChooser(message = "Pick the next obby challenge.") {
  state.roundActive = false;
  state.keys.clear();
  renderModeChoices();
  ui.wheelModal.classList.remove("hidden");
  ui.wheelResult.textContent = message;
}

function chooseMode(mode) {
  if (mode.id === "trex") {
    if (state.bricks < 500 || state.grizzles < 2) {
      showToast("Need 500 bricks and 2 grizzles.");
      return;
    }
    state.bricks -= 500;
    state.grizzles -= 2;
  }
  ui.wheelModal.classList.add("hidden");
  startMode(mode);
}

function updatePlatformMotion(time) {
  for (const p of state.platforms) {
    if (p.motion) {
      p.x = p.ox + Math.sin(time * 0.0015 + p.motion) * 2.5;
    }
  }
}

function updateBuffs(runner, dt) {
  for (const key of Object.keys(runner.buffs)) {
    runner.buffs[key] = Math.max(0, runner.buffs[key] - dt);
  }
  if (runner.isPlayer) {
    state.riftPower.time = Math.max(0, state.riftPower.time - dt);
    state.riftDashCooldown = Math.max(0, state.riftDashCooldown - dt);
    if (state.riftPower.time <= 0) state.riftPower = { id: "none", label: "none", color: "#f8fbff", time: 0 };
  }
}

function applyPhysics(runner, dt) {
  const speedBoost = runner.buffs.speedCoil > 0 ? 1.55 : 1;
  const carpet = runner.buffs.carpet > 0;
  const disasterType = state.mode.id === "disaster" ? state.disaster.type : "none";
  const activePower = runner.isPlayer && state.riftPower.time > 0 ? state.riftPower.id : "none";
  const aiTune = aiDifficulties[state.aiDifficulty] || aiDifficulties.hard;
  const accel = runner.isPlayer ? 29 : aiTune.accelBase + runner.aiMood * aiTune.accelMood;
  const powerSpeed = activePower === "comet" ? 1.18 : 1;
  const aiMaxSpeed = aiTune.speedBase + runner.aiMood * aiTune.speedMood;
  const maxSpeed = (runner.isPlayer ? (carpet ? 22 : 11) : aiMaxSpeed) * speedBoost * powerSpeed;
  const friction = carpet ? 0.93 : runner.isPlayer && disasterType === "slippery" ? 0.985 : runner.onGround ? 0.83 : 0.97;

  let inputX = 0;
  let inputZ = 0;

  if (runner.isPlayer) {
    const strafe = Number(state.keys.has("KeyD") || state.keys.has("ArrowRight")) - Number(state.keys.has("KeyA") || state.keys.has("ArrowLeft"));
    const forward = Number(state.keys.has("KeyW") || state.keys.has("ArrowUp")) - Number(state.keys.has("KeyS") || state.keys.has("ArrowDown"));
    const yawSin = Math.sin(state.camera.yaw);
    const yawCos = Math.cos(state.camera.yaw);
    const controlFlip = disasterType === "reverse" ? -1 : 1;
    inputX = (strafe * yawCos + forward * yawSin) * controlFlip;
    inputZ = (forward * yawCos - strafe * yawSin) * controlFlip;
    if (carpet) {
      const climb = Number(state.keys.has("Space")) - Number(state.keys.has("ShiftLeft") || state.keys.has("ShiftRight"));
      const pitchLift = forward > 0 ? Math.max(0, -state.camera.pitch) * 8 : 0;
      runner.vx += inputX * 22 * dt;
      runner.vz += inputZ * 22 * dt;
      runner.vy += (climb * 15 + pitchLift + 1.6) * dt;
      if (climb === 0) runner.vy = Math.max(runner.vy, -0.35);
      runner.onGround = false;
    } else if (state.keys.has("Space") && runner.onGround) {
      runner.vy = runner.buffs.jumpCoil > 0 ? 13.4 : 10.6;
      runner.onGround = false;
      state.echoJumpReady = activePower === "echo";
    } else if (state.keys.has("Space") && activePower === "echo" && state.echoJumpReady) {
      runner.vy = 10.2;
      runner.onGround = false;
      state.echoJumpReady = false;
      state.riftFlash = Math.max(state.riftFlash, 0.45);
    }
    if (!carpet && activePower === "comet" && state.keys.has("ShiftLeft") && state.riftDashCooldown <= 0) {
      runner.vx += yawSin * 16;
      runner.vz += yawCos * 16;
      runner.vy = Math.max(runner.vy, 2.8);
      state.riftDashCooldown = 2.4;
      state.riftFlash = Math.max(state.riftFlash, 0.5);
    }
    if (activePower === "magnet") pullTowardNextPlatform(runner, dt);
  } else {
    const target = state.platforms[Math.min(runner.stage + 1, state.platforms.length - 1)];
    const dx = target.x - runner.x;
    const dy = target.y - runner.y;
    const dz = target.z - runner.z;
    const dist = Math.hypot(dx, dz) || 1;
    inputX = dx / dist;
    inputZ = dz / dist;
    const jumpRange = aiTune.jumpRangeBase + runner.aiMood * aiTune.jumpRangeMood + Math.max(0, dy) * aiTune.jumpRangeDy;
    const shouldJump = runner.onGround && ((dist < jumpRange && target.y >= runner.y - 1.4) || runner.aiWait > aiTune.jumpWait);
    if (shouldJump) {
      runner.vy = aiTune.jumpBase + runner.aiMood * aiTune.jumpMood + Math.max(0, dy) * aiTune.jumpDy;
      runner.onGround = false;
      runner.aiWait = 0;
    }
    runner.aiWait += dt;
  }

  const len = Math.hypot(inputX, inputZ) || 1;
  inputX /= len;
  inputZ /= len;
  runner.vx += inputX * accel * dt;
  runner.vz += inputZ * accel * dt;

  const hSpeed = Math.hypot(runner.vx, runner.vz);
  if (hSpeed > maxSpeed) {
    runner.vx = (runner.vx / hSpeed) * maxSpeed;
    runner.vz = (runner.vz / hSpeed) * maxSpeed;
  }

  runner.vx *= Math.pow(friction, dt * 60);
  runner.vz *= Math.pow(friction, dt * 60);
  const lowGravity = disasterType === "lowGravity";
  const gravity = runner.isPlayer ? (carpet ? 2.2 : lowGravity ? 10 : activePower === "feather" && runner.vy < 0 ? 8 : 21) : 24;
  runner.vy -= gravity * dt;
  if (carpet) runner.vy = Math.max(-3.2, Math.min(8.5, runner.vy));
  if (activePower === "feather") runner.vy = Math.max(runner.vy, -4.2);

  const previousY = runner.y;
  runner.prevY = previousY;
  runner.x += runner.vx * dt;
  runner.y += runner.vy * dt;
  runner.z += runner.vz * dt;

  resolvePlatforms(runner, previousY);
  if (runner.y < -18) resetRunner(runner, runner.buffs.immortal > 0 ? runner.stage : runner.checkpoint);
}

function pullTowardNextPlatform(runner, dt) {
  const target = state.platforms[Math.min(runner.stage + 1, state.platforms.length - 1)];
  if (!target) return;
  const dx = target.x - runner.x;
  const dz = target.z - runner.z;
  const dist = Math.hypot(dx, dz);
  if (dist < 2 || dist > 18) return;
  runner.vx += (dx / dist) * 7.5 * dt;
  runner.vz += (dz / dist) * 7.5 * dt;
}

function resolvePlatforms(runner, previousY = runner.prevY) {
  runner.onGround = false;
  let best = null;
  for (let i = 0; i < state.platforms.length; i += 1) {
    const p = state.platforms[i];
    const insideX = Math.abs(runner.x - p.x) <= p.w / 2 + 0.62;
    const insideZ = Math.abs(runner.z - p.z) <= p.d / 2 + 0.62;
    const landingY = p.y + 1.25;
    const crossedTop = previousY >= landingY - 0.18 && runner.y <= landingY + 0.52;
    const closeToTop = runner.y >= landingY - 0.85 && runner.y <= landingY + 0.62;
    if (insideX && insideZ && runner.vy <= 0 && (crossedTop || closeToTop)) {
      if (!best || p.y > best.platform.y) best = { platform: p, index: i };
    }
  }

  if (best) {
    const p = best.platform;
    runner.y = p.y + 1.25;
    runner.vy = 0;
    runner.onGround = true;
    runner.stage = Math.max(runner.stage, best.index);
    if (p.tag === "checkpoint" || p.tag === "start" || p.tag === "finish") {
      runner.checkpoint = best.index;
    }
    if (runner.isPlayer && p.boostPad) {
      runner.vz += 2.5;
      runner.buffs.speedCoil = Math.max(runner.buffs.speedCoil, 2.2);
    }
    if (runner.isPlayer && p.gravityWell && !p.wellClaimed) triggerGravityWell(p);
    if (runner.isPlayer && p.rift && !p.riftClaimed) claimRift(p);
    if (touchesObstacle(runner, p)) {
      damageRunner(runner, obstacleMessage(p));
      return;
    }
    if (p.tag === "lava" && runner.buffs.immortal <= 0) {
      runner.vy = 7;
      if (runner.isPlayer) showToast("Lava hit.");
      resetRunner(runner);
      return;
    }
    if (runner.isPlayer) awardStageBricks();
    if (p.tag === "finish" && state.mode.id !== "endless" && !runner.finishTime) {
      runner.finishTime = performance.now();
      if (runner.isPlayer) {
        state.bricks += state.mode.id === "race" ? 210 : 125;
        state.grizzles += state.mode.id === "race" ? 1 : 0;
        showToast("Finish reached.");
      }
    }
  }
}

function awardStageBricks() {
  if (state.mode.id === "coins") return;
  const milestone = Math.floor(player.stage / 3);
  if (milestone <= state.stageBrickMilestone) return;
  const gained = (milestone - state.stageBrickMilestone) * 10;
  state.stageBrickMilestone = milestone;
  state.bricks += gained;
}

function touchesObstacle(runner, platform) {
  if (runner.buffs.immortal > 0) return false;
  const localX = runner.x - platform.x;
  const localZ = runner.z - platform.z;
  if (platform.crystal && Math.hypot(localX - platform.w * 0.26, localZ + platform.d * 0.22) < 1.05) return true;
  if (platform.spikes && touchesSpikeRow(localX, localZ, platform)) return true;
  if (platform.lavaPad && Math.abs(localX) < platform.w * 0.32 && Math.abs(localZ) < platform.d * 0.28) return true;
  if (platform.sweeper && touchesSweeper(localX, localZ, platform)) return true;
  if (platform.bigSpinner && touchesBigSpinner(localX, localZ, platform)) return true;
  if (platform.laserGate && Math.abs(localZ) < 0.34 && Math.abs(localX) < platform.w * 0.36) return true;
  return false;
}

function touchesSpikeRow(localX, localZ, platform) {
  const spikeCount = Math.max(2, Math.min(5, Math.floor(platform.w / 1.45)));
  for (let i = 0; i < spikeCount; i += 1) {
    const t = spikeCount === 1 ? 0 : i / (spikeCount - 1);
    const spikeX = -platform.w * 0.32 + t * platform.w * 0.64;
    const spikeZ = platform.d * 0.18 * (i % 2 === 0 ? 1 : -1);
    if (Math.hypot(localX - spikeX, localZ - spikeZ) < 0.78) return true;
  }
  return false;
}

function touchesSweeper(localX, localZ, platform) {
  const angle = performance.now() * 0.0022 + platform.z * 0.08;
  const axisX = Math.cos(angle);
  const axisZ = Math.sin(angle);
  const along = localX * axisX + localZ * axisZ;
  const across = Math.abs(-localX * axisZ + localZ * axisX);
  const length = Math.min(platform.w, platform.d) * 0.42;
  return Math.abs(along) < length && across < 0.36;
}

function touchesBigSpinner(localX, localZ, platform) {
  const angle = performance.now() * 0.0016 + platform.z * 0.05;
  const length = Math.min(platform.w, platform.d) * 0.42;
  for (let i = 0; i < 2; i += 1) {
    const a = angle + i * Math.PI / 2;
    const axisX = Math.cos(a);
    const axisZ = Math.sin(a);
    const along = localX * axisX + localZ * axisZ;
    const across = Math.abs(-localX * axisZ + localZ * axisX);
    if (Math.abs(along) < length && across < 0.42) return true;
  }
  return false;
}

function obstacleMessage(platform) {
  if (platform.bigSpinner) return "Big spinner hit.";
  if (platform.laserGate) return "Laser gate hit.";
  if (platform.sweeper) return "Sweeper hit.";
  if (platform.lavaPad) return "Lava pad hit.";
  if (platform.spikes || platform.crystal) return "Spikes hit.";
  return "Obstacle hit.";
}

function damageRunner(runner, message) {
  runner.vy = 7;
  if (runner.isPlayer) {
    state.bricks = Math.max(0, state.bricks - 5);
    resetRunner(runner, runner.checkpoint, message);
  } else {
    resetRunner(runner, runner.checkpoint);
    runner.aiWait = 0;
  }
}

function claimRift(platform) {
  platform.riftClaimed = true;
  state.riftStreak += 1;
  state.bestRiftStreak = Math.max(state.bestRiftStreak, state.riftStreak);
  state.riftFlash = 1;
  state.bricks += 26 + state.riftStreak * 4;
  const power = riftPowers[(state.riftStreak - 1) % riftPowers.length];
  state.riftPower = { ...power, time: 18 };
  state.riftDashCooldown = 0;
  state.echoJumpReady = power.id === "echo";
  player.buffs.speedCoil = Math.max(player.buffs.speedCoil, power.id === "comet" ? 5 : 3.5);
  if (state.riftStreak % 4 === 0) state.grizzles += 1;
  const bonus = state.riftStreak % 4 === 0 ? " +1 grizzle" : "";
  showToast(`${power.label} rift ${state.riftStreak}!${bonus}`);
}

function triggerGravityWell(platform) {
  platform.wellClaimed = true;
  const forward = Math.sin(state.camera.yaw);
  const ahead = Math.cos(state.camera.yaw);
  player.vx += forward * 3.4;
  player.vz += ahead * 6.2;
  player.vy = Math.max(player.vy, 12.2);
  state.riftFlash = Math.max(state.riftFlash, 0.65);
  showToast("Gravity well launched you.");
}

function updateCoins(dt) {
  if (state.mode.id !== "coins") return;
  for (const coin of state.coins) {
    coin.pulse += dt * 4;
    coin.y = coin.baseY + Math.sin(coin.pulse) * 0.16;
    if (!coin.taken && Math.hypot(player.x - coin.x, player.y - coin.y, player.z - coin.z) < 1.6) {
      coin.taken = true;
      state.bricks += 2;
    }
  }
}

function updatePlayTimeRewards(dt) {
  state.grizzlePlaySeconds += dt;
  while (state.grizzlePlaySeconds >= grizzlePlayRewardSeconds) {
    state.grizzlePlaySeconds -= grizzlePlayRewardSeconds;
    state.grizzles += 1;
    showToast("+1 grizzle for play time.");
  }
}

function updateWar(dt) {
  if (state.mode.id !== "war") return;
  const runners = [player, ...state.bots];
  const aiTune = aiDifficulties[state.aiDifficulty] || aiDifficulties.hard;

  for (const bot of state.bots) {
    bot.shotClock -= dt;
    if (bot.shotClock <= 0 && bot.ammo > 0) {
      bot.shotClock = aiTune.shotBase + Math.random() * aiTune.shotRandom;
      const target = Math.random() < aiTune.playerTargetChance ? player : runners[Math.floor(Math.random() * runners.length)];
      const dx = target.x - bot.x;
      const dy = target.y + 0.58 - bot.y;
      const dz = target.z - bot.z;
      const d = Math.hypot(dx, dy, dz) || 1;
      fireWarShot(bot, dx / d, dy / d, dz / d);
    }
  }

  for (const shot of state.shots) {
    shot.life -= dt;
    shot.x += shot.vx * dt;
    shot.y += shot.vy * dt;
    shot.z += shot.vz * dt;
    for (const target of runners) {
      if (target === shot.owner) continue;
      const hitRadius = target.isPlayer && target.buffs.invisible > 0 ? 0.55 : 1.25;
      if (Math.hypot(target.x - shot.x, target.y - shot.y, target.z - shot.z) < hitRadius) {
        shot.life = 0;
        if (target.buffs.immortal <= 0) {
          target.vx -= Math.sign(shot.vx || 1) * 5;
          target.vy = 7;
          if (target.isPlayer) {
            state.bricks = Math.max(0, state.bricks - 10);
            showToast("Tagged in war mode.");
          }
        }
        break;
      }
    }
  }
  state.shots = state.shots.filter((shot) => shot.life > 0);
}

function fireWarShot(shooter, dirX, dirY, dirZ) {
  if (state.mode.id !== "war" || shooter.ammo <= 0) return false;
  shooter.ammo -= 1;
  state.shots.push({
    x: shooter.x,
    y: shooter.y + 1.2,
    z: shooter.z,
    vx: dirX * 22,
    vy: dirY * 22,
    vz: dirZ * 22,
    life: 2.2,
    owner: shooter,
  });
  return true;
}

function shootPlayerWarShot() {
  if (state.mode.id !== "war") return;
  if (player.ammo <= 0) {
    showToast("Out of ammo.");
    return;
  }
  const yawSin = Math.sin(state.camera.yaw);
  const yawCos = Math.cos(state.camera.yaw);
  const pitchSin = Math.sin(state.camera.pitch);
  const pitchCos = Math.cos(state.camera.pitch);
  fireWarShot(player, yawSin * pitchCos, pitchSin, yawCos * pitchCos);
}

function updateEndless() {
  if (state.mode.id !== "endless") return;
  ensureEndlessPlatforms();
}

function updateLavaRising(dt) {
  if (state.mode.id !== "lava") return;
  const elapsed = Math.max(0, (performance.now() - state.lavaStartAt) / 1000);
  setLavaCourseLift(elapsed * lavaCourseLiftSpeed);
  state.lavaLevel = state.lavaBaseLevel + elapsed * 0.26 + Math.sin(performance.now() * 0.002) * 0.12;
  if (player.y - 0.9 < state.lavaLevel && player.buffs.immortal <= 0) {
    damageRunner(player, "Lava caught you.");
  }
}

function updateBoss(dt) {
  if (state.mode.id !== "boss") return;
  state.bossClock -= dt;
  if (state.bossClock <= 0) {
    const leaderStage = Math.max(...[player, ...state.bots].map((runner) => runner.stage));
    state.bossClock = Math.max(0.75, 2.2 - leaderStage * 0.01);
    spawnBossShot();
  }
  updateHazardShots(dt);
}

function updateTrexBoss(dt) {
  if (state.mode.id !== "trex" || state.trex.ended) return;
  state.trex.shotClock -= dt;
  state.trex.specialClock -= dt;
  state.trex.specialTime = Math.max(0, state.trex.specialTime - dt);
  if (state.trex.specialTime <= 0) state.trex.special = "none";

  if (state.trex.shotClock <= 0) {
    state.trex.shotClock += 0.7;
    spawnTrexShot();
  }

  if (state.trex.specialClock <= 0) {
    triggerTrexSpecial();
  }

  if (state.trex.special === "roar") {
    const dist = Math.hypot(player.x, player.z) || 1;
    player.vx += (player.x / dist) * 8.5 * dt;
    player.vz += (player.z / dist) * 8.5 * dt;
  }

  updateTrexShots(dt);
}

function spawnTrexShot(speed = 19, radius = 1.18, spread = 0) {
  const eye = { x: 0, y: 7.1, z: 0 };
  let dx = player.x - eye.x;
  let dy = player.y + 0.65 - eye.y;
  let dz = player.z - eye.z;
  if (spread) {
    const cos = Math.cos(spread);
    const sin = Math.sin(spread);
    const rx = dx * cos - dz * sin;
    const rz = dx * sin + dz * cos;
    dx = rx;
    dz = rz;
  }
  const d = Math.hypot(dx, dy, dz) || 1;
  state.bossShots.push({
    x: eye.x,
    y: eye.y,
    z: eye.z,
    vx: (dx / d) * speed,
    vy: (dy / d) * speed,
    vz: (dz / d) * speed,
    life: 3.6,
    color: "#ff355e",
    radius,
    trex: true,
  });
}

function triggerTrexSpecial() {
  const specials = ["roar", "stomp", "laser"];
  const type = specials[Math.floor(Math.random() * specials.length)];
  state.trex.special = type;
  state.trex.specialTime = type === "laser" ? 2.6 : 4.2;
  state.trex.specialClock = 30;
  if (type === "roar") {
    showToast("T-Rex special: roar push.");
  } else if (type === "stomp") {
    showToast("T-Rex special: shockwave stomp.");
    for (let i = 0; i < 14; i += 1) {
      const angle = (i / 14) * Math.PI * 2;
      state.bossShots.push({
        x: Math.sin(angle) * 3,
        y: 1.25,
        z: Math.cos(angle) * 3,
        vx: Math.sin(angle) * 15,
        vy: 0,
        vz: Math.cos(angle) * 15,
        life: 2.2,
        color: "#ffd24a",
        radius: 1.55,
        trex: true,
      });
    }
  } else {
    showToast("T-Rex special: eye laser.");
    for (let i = -2; i <= 2; i += 1) spawnTrexShot(24, 1.45, i * 0.12);
  }
}

function updateTrexShots(dt) {
  for (const shot of state.bossShots) {
    shot.life -= dt;
    shot.x += shot.vx * dt;
    shot.y += shot.vy * dt;
    shot.z += shot.vz * dt;
    if (shot.trex && Math.hypot(player.x - shot.x, player.y - shot.y, player.z - shot.z) < shot.radius) {
      shot.life = 0;
      registerTrexHit();
    }
  }
  state.bossShots = state.bossShots.filter((shot) => shot.life > 0);
}

function registerTrexHit() {
  if (state.trex.ended) return;
  state.trex.hits += 1;
  if (state.trex.hits >= 3) {
    finishTrexFight(false);
    return;
  }
  resetRunner(player, player.checkpoint, `T-Rex hit ${state.trex.hits}/3.`);
}

function finishTrexFight(won) {
  if (state.trex.ended) return;
  state.trex.ended = true;
  state.roundActive = false;
  state.bossShots = [];
  const message = won ? "T-Rex survived: +700 bricks, +3 grizzles." : "T-Rex loss: +300 bricks, +1 grizzle.";
  if (won) {
    state.bricks += 700;
    state.grizzles += 3;
  } else {
    state.bricks += 300;
    state.grizzles += 1;
  }
  restoreTrexArena();
  resetRunner(player, 0, message);
  openModeChooser(won ? "You beat the T-Rex. Choose the next mode." : "The T-Rex won. Choose the next mode.");
}

function nextBossTarget() {
  const runners = [player, ...state.bots];
  if (!runners.length) return player;
  return runners[Math.floor(Math.random() * runners.length)];
}

function spawnBossShot() {
  const targetRunner = nextBossTarget();
  const ahead = state.platforms[Math.min(targetRunner.stage + 7, state.platforms.length - 1)] || state.platforms[targetRunner.stage] || state.platforms[0];
  const sx = ahead.x + (Math.random() - 0.5) * 7;
  const sy = ahead.y + 6;
  const sz = ahead.z + 2;
  const dx = targetRunner.x - sx;
  const dy = targetRunner.y + 0.45 - sy;
  const dz = targetRunner.z - sz;
  const d = Math.hypot(dx, dy, dz) || 1;
  state.bossShots.push({
    x: sx,
    y: sy,
    z: sz,
    vx: (dx / d) * 16,
    vy: (dy / d) * 16,
    vz: (dz / d) * 16,
    life: 4,
    color: "#c68cff",
    radius: 1.2,
    bossMode: true,
  });
}

function updateRandomDisaster(dt) {
  if (state.mode.id !== "disaster") return;
  state.disaster.next -= dt;
  state.disaster.time -= dt;
  if (state.disaster.next <= 0 || state.disaster.time <= 0) {
    const types = ["wind", "meteors", "lowGravity", "lightning", "quake", "fog", "slippery", "reverse"];
    const type = types[Math.floor(Math.random() * types.length)];
    state.disaster = { type, time: 18, next: 18 };
    const names = {
      wind: "wind",
      meteors: "meteors",
      lowGravity: "low gravity",
      lightning: "lightning",
      quake: "earthquake",
      fog: "fog",
      slippery: "slippery platforms",
      reverse: "reversed controls",
    };
    showToast(`Disaster: ${names[type]}.`);
  }

  if (state.disaster.type === "wind") {
    const gust = Math.sin(performance.now() * 0.0012) * 10;
    player.vx += gust * dt;
  } else if (state.disaster.type === "meteors") {
    state.bossClock -= dt;
    if (state.bossClock <= 0) {
      state.bossClock = 0.75;
      spawnMeteor();
    }
  } else if (state.disaster.type === "lightning") {
    state.bossClock -= dt;
    if (state.bossClock <= 0) {
      state.bossClock = 1.05;
      spawnLightning();
    }
  } else if (state.disaster.type === "quake") {
    const rumble = Math.sin(performance.now() * 0.018) * 4.5;
    player.vx += rumble * dt;
    player.vz += Math.cos(performance.now() * 0.015) * 3.2 * dt;
  }
  updateHazardShots(dt);
}

function spawnMeteor() {
  const target = state.platforms[Math.min(player.stage + 2, state.platforms.length - 1)] || state.platforms[player.stage] || state.platforms[0];
  const sx = target.x + (Math.random() - 0.5) * 8;
  const sz = target.z + (Math.random() - 0.5) * 5;
  state.bossShots.push({
    x: sx,
    y: target.y + 12,
    z: sz,
    vx: 0,
    vy: -18,
    vz: 0,
    life: 3.2,
    color: "#ff8f3d",
    radius: 1.35,
  });
}

function spawnLightning() {
  const target = state.platforms[Math.min(player.stage + 1 + Math.floor(Math.random() * 4), state.platforms.length - 1)] || state.platforms[player.stage] || state.platforms[0];
  const sx = target.x + (Math.random() - 0.5) * Math.max(4, target.w);
  const sz = target.z + (Math.random() - 0.5) * Math.max(4, target.d);
  state.bossShots.push({
    x: sx,
    y: target.y + 14,
    z: sz,
    vx: 0,
    vy: -28,
    vz: 0,
    life: 1.8,
    color: "#6fffe0",
    radius: 1.65,
    hazardName: "Lightning hit.",
  });
}

function updateHazardShots(dt) {
  const runners = state.mode.id === "boss" ? [player, ...state.bots] : [player];
  for (const shot of state.bossShots) {
    shot.life -= dt;
    shot.x += shot.vx * dt;
    shot.y += shot.vy * dt;
    shot.z += shot.vz * dt;
    for (const runner of runners) {
      const hitRadius = runner.isPlayer && runner.buffs.invisible > 0 ? shot.radius * 0.55 : shot.radius;
      const canDamage = !runner.isPlayer || runner.buffs.immortal <= 0;
      if (canDamage && Math.hypot(runner.x - shot.x, runner.y - shot.y, runner.z - shot.z) < hitRadius) {
        shot.life = 0;
        damageRunner(runner, state.mode.id === "boss" ? "Boss blast hit." : shot.hazardName || "Meteor hit.");
        break;
      }
    }
  }
  state.bossShots = state.bossShots.filter((shot) => shot.life > 0);
}

function ensureEndlessPlatforms() {
  const last = state.platforms[state.platforms.length - 1];
  let previous = last;
  while (previous.z - player.z < 180) {
    state.endlessCount += 1;
    const narrow = state.endlessCount % 6 === 0;
    const theme = zoneThemes[state.endlessCount % zoneThemes.length];
    const formationStep = state.endlessCount % 48;
    const ringRun = formationStep >= 12 && formationStep <= 22;
    const spiralStair = formationStep >= 31 && formationStep <= 40;
    const circlePlatform = formationStep === 23 || formationStep === 41;
    const w = circlePlatform ? 9.6 : ringRun ? 4.9 : narrow ? 4.8 : 6 + (state.endlessCount % 3) * 0.8;
    const d = circlePlatform ? 9.6 : ringRun ? 4.9 : narrow ? 5.2 : 6.3;
    const gap = ringRun || spiralStair ? 0.95 : narrow ? 1.25 : 1.65 + (state.endlessCount % 4) * 0.18;
    const platformColor = state.endlessCount % 2 === 0 ? theme.color : shade(theme.color, 18);
    const stairRun = spiralStair || (state.endlessCount % 28 >= 7 && state.endlessCount % 28 <= 12);
    const checkpoint = state.endlessCount % 20 === 0;
    const checkpointStair = checkpoint && stairRun;
    const checkpointMoving = checkpoint && !checkpointStair;
    const allowObstacles = !checkpoint;
    const platform = {
      x: ringRun
        ? Math.sin(((formationStep - 12) / 10) * Math.PI * 1.55 - Math.PI * 0.35) * 8.4
        : spiralStair
          ? Math.cos(((formationStep - 31) / 9) * Math.PI * 1.7) * (5.2 + ((formationStep - 31) / 9) * 2.4)
          : Math.sin(state.endlessCount * 0.9) * 6.4,
      y: previous.y + (spiralStair ? 0.48 : stairRun ? 0.34 : ringRun ? 0.22 : state.endlessCount % 3 === 0 ? 0.3 : 0.18),
      z: previous.z + previous.d / 2 + d / 2 + gap,
      w,
      d,
      h: 1.1,
      color: platformColor,
      accent: theme.accent,
      zone: theme.name,
      pattern: theme.pattern,
      rift: allowObstacles && state.endlessCount % 8 === 0,
      crystal: allowObstacles && (state.endlessCount % 10 === 4 || state.endlessCount % 17 === 0),
      boostPad: allowObstacles && state.endlessCount % 9 === 0,
      gravityWell: allowObstacles && state.endlessCount % 11 === 0,
      prismRail: false,
      stairRun,
      ringRun,
      spiralStair,
      circlePlatform,
      bigSpinner: allowObstacles && state.endlessCount % 26 === 0,
      laserGate: allowObstacles && state.endlessCount % 21 === 0,
      spikes: allowObstacles && state.endlessCount % 12 === 0,
      lavaPad: allowObstacles && state.endlessCount % 15 === 0,
      sweeper: allowObstacles && state.endlessCount % 18 === 0,
      tag: checkpoint ? "checkpoint" : "step",
      motion: checkpointMoving || state.endlessCount % 12 === 0 ? state.endlessCount * 0.43 : 0,
      endless: true,
    };
    addPlatform(platform);
    previous = platform;
  }
}

function render() {
  const w = state.width;
  const h = state.height;
  ctx.clearRect(0, 0, w, h);
  drawSky(w, h);

  const walkSpeed = Math.hypot(player.vx, player.vz);
  const bob = player.onGround ? Math.sin(performance.now() * 0.012) * Math.min(0.12, walkSpeed * 0.012) : 0;
  state.camera.x += (player.x - state.camera.x) * 0.36;
  state.camera.y += (player.y + 1.35 + bob - state.camera.y) * 0.3;
  state.camera.z += (player.z - 2.2 - state.camera.z) * 0.36;

  if (state.mode.id === "lava") drawRisingLava();

  const drawables = [];
  for (let i = 0; i < state.platforms.length; i += 1) {
    if (!isDarkVisibleStage(i)) continue;
    const p = state.platforms[i];
    const depth = cameraDepth(p.x, p.y, p.z);
    if (depth > -8 && depth < 190) {
      drawables.push({ kind: "platform", z: depth + p.y * 0.2, item: p });
    }
  }
  if (state.mode.id === "coins") {
    for (const coin of state.coins) {
      if (!isDarkVisibleStage(coin.platformIndex ?? -99)) continue;
      const depth = cameraDepth(coin.x, coin.y, coin.z);
      if (!coin.taken && depth > -2 && depth < 150) {
        drawables.push({ kind: "coin", z: depth + coin.y * 0.2, item: coin });
      }
    }
  }
  for (const shot of state.shots) drawables.push({ kind: "shot", z: cameraDepth(shot.x, shot.y, shot.z), item: shot });
  for (const shot of state.bossShots) drawables.push({ kind: "bossShot", z: cameraDepth(shot.x, shot.y, shot.z), item: shot });
  if (state.mode.id !== "trex") {
    for (const runner of state.bots) {
      if (!isDarkVisibleStage(runner.stage)) continue;
      drawables.push({ kind: "runner", z: cameraDepth(runner.x, runner.y, runner.z), item: runner });
    }
  }
  drawables.sort((a, b) => b.z - a.z);

  for (const d of drawables) {
    if (d.kind === "platform") drawCuboid(d.item);
    if (d.kind === "coin") drawCoin(d.item);
    if (d.kind === "runner") drawRunner(d.item);
    if (d.kind === "shot") drawShot(d.item);
    if (d.kind === "bossShot") drawBossShot(d.item);
  }

  if (state.mode.id === "boss") drawBoss(w, h);
  if (state.mode.id === "trex") drawTrexBoss(w, h);
  drawRiftFlash(w, h);
  drawCurrentPlatformGuide(w, h);
  drawFirstPersonOverlay(w, h);
  drawVignette(w, h);
  if (state.mode.id === "dark") drawDarkness(w, h);
  if (state.mode.id === "disaster") drawDisasterOverlay(w, h);
}

function isDarkVisibleStage(index) {
  if (state.mode.id !== "dark") return true;
  return Math.abs(index - player.stage) <= 1;
}

function drawSky(w, h) {
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, state.mode.id === "dark" ? "#101625" : "#86c9ff");
  const horizon = Math.max(0.24, Math.min(0.68, 0.49 + state.camera.pitch * 0.52));
  sky.addColorStop(Math.max(0.05, horizon - 0.01), state.mode.id === "dark" ? "#242b3a" : "#bde5ff");
  sky.addColorStop(horizon, state.mode.id === "dark" ? "#27331f" : "#8ed3a0");
  sky.addColorStop(1, state.mode.id === "dark" ? "#10180f" : "#3d7d57");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "rgba(255,255,255,0.55)";
  for (let i = 0; i < 7; i += 1) {
    const x = ((i * 241 - state.camera.yaw * 260) % (w + 180)) - 90;
    const y = 70 + (i % 3) * 42 + state.camera.pitch * 170;
    ctx.beginPath();
    ctx.ellipse(x, y, 55, 16, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 42, y + 6, 40, 12, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const t = performance.now() * 0.00045;
  for (let i = 0; i < 4; i += 1) {
    ctx.save();
    ctx.globalAlpha = 0.14;
    ctx.strokeStyle = ["#c68cff", "#38d6a9", "#ffd24a", "#62b7ff"][i];
    ctx.lineWidth = 18;
    ctx.beginPath();
    for (let x = -80; x <= w + 80; x += 60) {
      const y = 58 + i * 32 + Math.sin(x * 0.012 + t * 5 + i) * 18 + state.camera.pitch * 110;
      if (x === -80) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }
}

function cameraCoords(x, y, z) {
  const relX = x - state.camera.x;
  const relY = y - state.camera.y;
  const relZ = z - state.camera.z;
  const yawSin = Math.sin(state.camera.yaw);
  const yawCos = Math.cos(state.camera.yaw);
  const pitchSin = Math.sin(state.camera.pitch);
  const pitchCos = Math.cos(state.camera.pitch);
  const yawX = relX * yawCos - relZ * yawSin;
  const yawZ = relX * yawSin + relZ * yawCos;
  return {
    x: yawX,
    y: relY * pitchCos - yawZ * pitchSin,
    z: relY * pitchSin + yawZ * pitchCos,
  };
}

function cameraDepth(x, y, z) {
  return cameraCoords(x, y, z).z;
}

function project(x, y, z) {
  const point = cameraCoords(x, y, z);
  const dz = point.z;
  if (dz <= 0.45) return null;
  const focal = Math.min(state.width, state.height) * 0.82;
  const scale = focal / dz;
  return {
    x: state.width / 2 + point.x * scale,
    y: state.height * 0.4 - point.y * scale,
    s: scale,
    dz,
  };
}

function drawCuboid(p) {
  const x1 = p.x - p.w / 2;
  const x2 = p.x + p.w / 2;
  const z1 = p.z - p.d / 2;
  const z2 = p.z + p.d / 2;
  const yTop = p.y;
  const yBot = p.y - p.h;
  const v = {
    tlf: project(x1, yTop, z1),
    trf: project(x2, yTop, z1),
    trb: project(x2, yTop, z2),
    tlb: project(x1, yTop, z2),
    blf: project(x1, yBot, z1),
    brf: project(x2, yBot, z1),
    brb: project(x2, yBot, z2),
    blb: project(x1, yBot, z2),
  };
  if (Object.values(v).some((point) => !point)) return;

  poly([v.tlf, v.trf, v.brf, v.blf], shade(p.color, -22));
  poly([v.trf, v.trb, v.brb, v.brf], shade(p.color, -36));
  poly([v.tlb, v.trb, v.brb, v.blb], shade(p.color, -16));
  poly([v.tlf, v.trf, v.trb, v.tlb], p.color);
  if (p.ringRun) drawRingRunMarker(p);
  if (p.circlePlatform) drawCirclePlatformMarker(p);
  if (p.spiralStair) drawSpiralMarker(p);
  if (p.stairRun) drawStairEdge(p);
  if (p.boostPad) drawBoostPad(p);
  if (p.gravityWell) drawGravityWell(p);
  if (p.lavaPad) drawLavaPad(p);
  if (p.spikes) drawSpikes(p);
  if (p.sweeper) drawSweeper(p);
  if (p.bigSpinner) drawBigSpinner(p);
  if (p.laserGate) drawLaserGate(p);
  if (p.crystal) drawCrystal(p);
  if (p.rift) drawRiftGate(p);

  if (p.tag === "checkpoint") {
    const flag = project(p.x, p.y + 3.3, p.z);
    const pole = project(p.x, p.y, p.z);
    if (flag && pole) {
      ctx.strokeStyle = "#f8fbff";
      ctx.lineWidth = Math.max(2, flag.s * 0.04);
      ctx.beginPath();
      ctx.moveTo(pole.x, pole.y);
      ctx.lineTo(flag.x, flag.y);
      ctx.stroke();
      ctx.fillStyle = "#ffd24a";
      ctx.fillRect(flag.x, flag.y, 34 * flag.s * 0.08, 20 * flag.s * 0.08);
    }
  }
}

function drawSurfacePattern(p) {
  ctx.save();
  ctx.strokeStyle = p.accent || "rgba(255,255,255,0.55)";
  ctx.globalAlpha = 0.44;
  ctx.lineWidth = 2;

  if (p.pattern === "stripes") {
    for (let i = -3; i <= 3; i += 1) lineOnTop(p, -p.w / 2, i * 0.9, p.w / 2, i * 0.9);
  } else if (p.pattern === "circuit") {
    lineOnTop(p, -p.w * 0.32, -p.d * 0.25, p.w * 0.32, -p.d * 0.25);
    lineOnTop(p, -p.w * 0.22, 0, p.w * 0.12, 0);
    lineOnTop(p, p.w * 0.12, 0, p.w * 0.12, p.d * 0.28);
    lineOnTop(p, -p.w * 0.1, p.d * 0.25, p.w * 0.35, p.d * 0.25);
  } else if (p.pattern === "stars") {
    for (let i = 0; i < 4; i += 1) {
      const x = ((i * 1.9) % 4 - 2) * (p.w * 0.14);
      const z = ((i * 2.7) % 4 - 2) * (p.d * 0.12);
      drawTopStar(p, x, z, 0.42);
    }
  } else if (p.pattern === "crystal") {
    lineOnTop(p, 0, -p.d * 0.38, p.w * 0.28, 0);
    lineOnTop(p, p.w * 0.28, 0, 0, p.d * 0.38);
    lineOnTop(p, 0, p.d * 0.38, -p.w * 0.28, 0);
    lineOnTop(p, -p.w * 0.28, 0, 0, -p.d * 0.38);
  } else {
    for (let i = -2; i <= 2; i += 1) lineOnTop(p, i * 0.9, -p.d / 2, i * 0.9, p.d / 2);
  }

  ctx.restore();
}

function lineOnTop(p, ax, az, bx, bz) {
  const a = project(p.x + ax, p.y + 0.04, p.z + az);
  const b = project(p.x + bx, p.y + 0.04, p.z + bz);
  if (!a || !b) return;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
}

function drawTopLoop(p, radius, color, alpha = 0.8) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  let started = false;
  for (let i = 0; i <= 24; i += 1) {
    const angle = (i / 24) * Math.PI * 2;
    const point = project(p.x + Math.cos(angle) * radius, p.y + 0.065, p.z + Math.sin(angle) * radius);
    if (!point) continue;
    if (!started) {
      ctx.moveTo(point.x, point.y);
      started = true;
    } else {
      ctx.lineTo(point.x, point.y);
    }
  }
  if (started) ctx.stroke();
  ctx.restore();
}

function drawRingRunMarker(p) {
  drawTopLoop(p, Math.min(p.w, p.d) * 0.31, "rgba(255, 240, 166, 0.82)", 0.72);
}

function drawCirclePlatformMarker(p) {
  drawTopLoop(p, Math.min(p.w, p.d) * 0.37, "rgba(255, 240, 166, 0.92)", 0.86);
  drawTopLoop(p, Math.min(p.w, p.d) * 0.2, "rgba(248, 251, 255, 0.65)", 0.72);
}

function drawSpiralMarker(p) {
  ctx.save();
  ctx.globalAlpha = 0.78;
  ctx.strokeStyle = "rgba(111, 255, 224, 0.8)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i += 1) {
    const offset = (i - 1) * p.d * 0.16;
    lineOnTop(p, -p.w * 0.34, offset - p.d * 0.08, p.w * 0.34, offset + p.d * 0.08);
  }
  ctx.restore();
}

function drawStairEdge(p) {
  ctx.save();
  ctx.globalAlpha = 0.55;
  ctx.strokeStyle = "rgba(248, 251, 255, 0.72)";
  ctx.lineWidth = 2;
  lineOnTop(p, -p.w * 0.38, -p.d * 0.36, p.w * 0.38, -p.d * 0.36);
  lineOnTop(p, -p.w * 0.38, p.d * 0.36, p.w * 0.38, p.d * 0.36);
  ctx.restore();
}

function drawTopStar(p, ox, oz, size) {
  const c = project(p.x + ox, p.y + 0.05, p.z + oz);
  if (!c) return;
  const r = Math.max(2, c.s * size * 0.08);
  ctx.beginPath();
  ctx.moveTo(c.x, c.y - r);
  ctx.lineTo(c.x + r, c.y);
  ctx.lineTo(c.x, c.y + r);
  ctx.lineTo(c.x - r, c.y);
  ctx.closePath();
  ctx.fillStyle = p.accent || "#ffffff";
  ctx.fill();
}

function drawBoostPad(p) {
  const center = project(p.x, p.y + 0.08, p.z);
  if (!center) return;
  ctx.save();
  ctx.globalAlpha = 0.82;
  ctx.strokeStyle = "#f8fbff";
  ctx.lineWidth = Math.max(2, center.s * 0.035);
  lineOnTop(p, -1.1, -0.7, 0, 0.7);
  lineOnTop(p, 0, 0.7, 1.1, -0.7);
  ctx.restore();
}

function drawSpikes(p) {
  const spikeCount = Math.max(2, Math.min(5, Math.floor(p.w / 1.45)));
  ctx.save();
  ctx.globalAlpha = 0.88;
  ctx.fillStyle = "#f8fbff";
  ctx.strokeStyle = "#ff5c7a";
  ctx.lineWidth = 2;
  for (let i = 0; i < spikeCount; i += 1) {
    const t = spikeCount === 1 ? 0 : i / (spikeCount - 1);
    const x = p.x - p.w * 0.32 + t * p.w * 0.64;
    const z = p.z + p.d * 0.18 * (i % 2 === 0 ? 1 : -1);
    const baseA = project(x - 0.34, p.y + 0.08, z);
    const baseB = project(x + 0.34, p.y + 0.08, z);
    const tip = project(x, p.y + 1.05, z);
    if (!baseA || !baseB || !tip) continue;
    ctx.beginPath();
    ctx.moveTo(baseA.x, baseA.y);
    ctx.lineTo(tip.x, tip.y);
    ctx.lineTo(baseB.x, baseB.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

function drawLavaPad(p) {
  const pad = [
    project(p.x - p.w * 0.32, p.y + 0.09, p.z - p.d * 0.28),
    project(p.x + p.w * 0.32, p.y + 0.09, p.z - p.d * 0.28),
    project(p.x + p.w * 0.32, p.y + 0.09, p.z + p.d * 0.28),
    project(p.x - p.w * 0.32, p.y + 0.09, p.z + p.d * 0.28),
  ];
  if (pad.some((point) => !point)) return;
  const pulse = 0.55 + Math.sin(performance.now() * 0.007 + p.z) * 0.12;
  ctx.save();
  ctx.globalAlpha = 0.82;
  poly(pad, `rgba(255, ${Math.floor(95 + pulse * 80)}, 40, 0.86)`);
  ctx.strokeStyle = "#fff0a6";
  ctx.lineWidth = 2;
  for (let i = -1; i <= 1; i += 1) {
    lineOnTop(p, -p.w * 0.22, i * p.d * 0.11, p.w * 0.22, i * p.d * 0.11);
  }
  ctx.restore();
}

function drawPrismRail(p) {
  ctx.save();
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = p.accent || "#f8fbff";
  ctx.lineWidth = 3;
  lineOnTop(p, -p.w * 0.38, -p.d * 0.38, p.w * 0.38, p.d * 0.38);
  lineOnTop(p, p.w * 0.38, -p.d * 0.38, -p.w * 0.38, p.d * 0.38);
  ctx.restore();
}

function drawSweeper(p) {
  const angle = performance.now() * 0.0022 + p.z * 0.08;
  const length = Math.min(p.w, p.d) * 0.42;
  const ax = Math.cos(angle) * length;
  const az = Math.sin(angle) * length;
  const a = project(p.x - ax, p.y + 0.28, p.z - az);
  const b = project(p.x + ax, p.y + 0.28, p.z + az);
  const center = project(p.x, p.y + 0.34, p.z);
  if (!a || !b || !center) return;
  ctx.save();
  ctx.strokeStyle = "#ff5c7a";
  ctx.lineWidth = Math.max(4, center.s * 0.045);
  ctx.shadowColor = "#ff5c7a";
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#101820";
  ctx.beginPath();
  ctx.arc(center.x, center.y, Math.max(4, center.s * 0.045), 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#f8fbff";
  ctx.stroke();
  ctx.restore();
}

function drawBigSpinner(p) {
  const center = project(p.x, p.y + 0.18, p.z);
  if (!center) return;
  const angle = performance.now() * 0.0016 + p.z * 0.05;
  const radius = Math.min(p.w, p.d) * 0.42;
  ctx.save();
  ctx.globalAlpha = 0.9;
  ctx.strokeStyle = "rgba(248, 251, 255, 0.62)";
  ctx.lineWidth = Math.max(2, center.s * 0.018);
  ctx.beginPath();
  ctx.ellipse(center.x, center.y, center.s * radius * 0.15, center.s * radius * 0.06, 0, 0, Math.PI * 2);
  ctx.stroke();

  for (let i = 0; i < 2; i += 1) {
    const a = angle + i * Math.PI / 2;
    const ax = Math.cos(a) * radius;
    const az = Math.sin(a) * radius;
    const start = project(p.x - ax, p.y + 0.34, p.z - az);
    const end = project(p.x + ax, p.y + 0.34, p.z + az);
    if (!start || !end) continue;
    ctx.strokeStyle = i === 0 ? "#ff5c7a" : "#ffd24a";
    ctx.lineWidth = Math.max(5, center.s * 0.055);
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }

  ctx.shadowBlur = 0;
  ctx.fillStyle = "#101820";
  ctx.beginPath();
  ctx.arc(center.x, center.y, Math.max(6, center.s * 0.065), 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#f8fbff";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

function drawLaserGate(p) {
  const leftBase = project(p.x - p.w * 0.34, p.y + 0.12, p.z);
  const leftTop = project(p.x - p.w * 0.34, p.y + 2.15, p.z);
  const rightBase = project(p.x + p.w * 0.34, p.y + 0.12, p.z);
  const rightTop = project(p.x + p.w * 0.34, p.y + 2.15, p.z);
  const beamA = project(p.x - p.w * 0.3, p.y + 1.15, p.z);
  const beamB = project(p.x + p.w * 0.3, p.y + 1.15, p.z);
  if (!leftBase || !leftTop || !rightBase || !rightTop || !beamA || !beamB) return;
  ctx.save();
  ctx.strokeStyle = "#f8fbff";
  ctx.lineWidth = Math.max(2, beamA.s * 0.03);
  ctx.beginPath();
  ctx.moveTo(leftBase.x, leftBase.y);
  ctx.lineTo(leftTop.x, leftTop.y);
  ctx.moveTo(rightBase.x, rightBase.y);
  ctx.lineTo(rightTop.x, rightTop.y);
  ctx.stroke();
  ctx.strokeStyle = "#ff5c7a";
  ctx.lineWidth = Math.max(4, beamA.s * 0.045);
  ctx.shadowColor = "#ff5c7a";
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.moveTo(beamA.x, beamA.y);
  ctx.lineTo(beamB.x, beamB.y);
  ctx.stroke();
  ctx.restore();
}

function drawGravityWell(p) {
  const center = project(p.x, p.y + 0.12, p.z);
  if (!center) return;
  const t = performance.now() * 0.006 + p.z;
  ctx.save();
  ctx.globalAlpha = p.wellClaimed ? 0.24 : 0.82;
  ctx.strokeStyle = p.wellClaimed ? "rgba(255,255,255,0.5)" : "#6fffe0";
  ctx.lineWidth = Math.max(2, center.s * 0.02);
  ctx.shadowColor = "#6fffe0";
  ctx.shadowBlur = p.wellClaimed ? 0 : 12;
  for (let i = 0; i < 3; i += 1) {
    const r = Math.max(5, center.s * (0.08 + i * 0.045 + Math.sin(t + i) * 0.006));
    ctx.beginPath();
    ctx.ellipse(center.x, center.y, r * 1.45, r * 0.62, t + i * 0.7, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.shadowBlur = 0;
  ctx.restore();
}

function drawCrystal(p) {
  const base = project(p.x + p.w * 0.26, p.y + 0.12, p.z - p.d * 0.22);
  const top = project(p.x + p.w * 0.26, p.y + 1.35, p.z - p.d * 0.22);
  const left = project(p.x + p.w * 0.12, p.y + 0.52, p.z - p.d * 0.22);
  const right = project(p.x + p.w * 0.4, p.y + 0.52, p.z - p.d * 0.22);
  if (!base || !top || !left || !right) return;
  ctx.save();
  ctx.globalAlpha = 0.78;
  poly([top, right, base, left], p.accent || "#c68cff");
  ctx.restore();
}

function drawRiftGate(p) {
  const claimed = p.riftClaimed;
  const t = performance.now() * 0.004 + p.z;
  const alpha = claimed ? 0.2 : 0.75 + Math.sin(t) * 0.12;
  const leftBase = project(p.x - p.w * 0.28, p.y + 0.15, p.z);
  const leftTop = project(p.x - p.w * 0.28, p.y + 3.3, p.z);
  const rightBase = project(p.x + p.w * 0.28, p.y + 0.15, p.z);
  const rightTop = project(p.x + p.w * 0.28, p.y + 3.3, p.z);
  const crown = project(p.x, p.y + 4.05, p.z);
  if (!leftBase || !leftTop || !rightBase || !rightTop || !crown) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = claimed ? "rgba(255,255,255,0.55)" : (p.accent || "#c68cff");
  ctx.lineWidth = Math.max(3, crown.s * 0.07);
  ctx.shadowColor = ctx.strokeStyle;
  ctx.shadowBlur = claimed ? 0 : 18;
  ctx.beginPath();
  ctx.moveTo(leftBase.x, leftBase.y);
  ctx.lineTo(leftTop.x, leftTop.y);
  ctx.quadraticCurveTo(crown.x, crown.y, rightTop.x, rightTop.y);
  ctx.lineTo(rightBase.x, rightBase.y);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = claimed ? "rgba(255,255,255,0.35)" : "#f8fbff";
  ctx.beginPath();
  ctx.arc(crown.x, crown.y, Math.max(3, crown.s * 0.06), 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function poly(points, color) {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i].x, points[i].y);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawCoin(coin) {
  const p = project(coin.x, coin.y, coin.z);
  if (!p) return;
  const r = Math.max(3, 0.17 * p.s);
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.scale(Math.abs(Math.cos(coin.pulse * 1.5)) * 0.62 + 0.22, 1);
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = "#ffd24a";
  ctx.fill();
  ctx.lineWidth = Math.max(1, r * 0.18);
  ctx.strokeStyle = "#fff4a2";
  ctx.stroke();
  ctx.restore();
}

function drawRunner(runner) {
  if (Math.hypot(runner.x - state.camera.x, runner.y - state.camera.y, runner.z - state.camera.z) < 1.35) return;
  if (runner.buffs.invisible > 0 && runner.isPlayer) ctx.globalAlpha = 0.45;
  const body = { x: runner.x, y: runner.y, z: runner.z, w: 0.9, d: 0.62, h: 1.25, color: runner.color };
  const headPoint = project(runner.x, runner.y + 1.18, runner.z);
  drawMiniBox(body);
  if (headPoint) {
    const r = Math.max(5, headPoint.s * 0.12);
    ctx.beginPath();
    ctx.arc(headPoint.x, headPoint.y, r, 0, Math.PI * 2);
    ctx.fillStyle = runner.isPlayer ? "#ffe0b2" : "#f1c083";
    ctx.fill();
    ctx.strokeStyle = "rgba(25,35,45,0.3)";
    ctx.stroke();
  }

  const label = project(runner.x, runner.y + 2.1, runner.z);
  if (label) {
    ctx.font = `800 ${Math.max(10, Math.min(15, label.s * 0.12))}px system-ui`;
    ctx.textAlign = "center";
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(0,0,0,0.45)";
    ctx.strokeText(runner.name, label.x, label.y);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(runner.name, label.x, label.y);
  }
  ctx.globalAlpha = 1;
}

function drawMiniBox(box) {
  const p = {
    x: box.x,
    y: box.y - 0.25,
    z: box.z,
    w: box.w,
    d: box.d,
    h: box.h,
    color: box.color,
  };
  drawCuboid(p);
}

function drawShot(shot) {
  const p = project(shot.x, shot.y, shot.z);
  if (!p) return;
  ctx.beginPath();
  ctx.arc(p.x, p.y, Math.max(3, p.s * 0.06), 0, Math.PI * 2);
  ctx.fillStyle = "#ff355e";
  ctx.shadowColor = "#ff355e";
  ctx.shadowBlur = 14;
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawBossShot(shot) {
  const p = project(shot.x, shot.y, shot.z);
  if (!p) return;
  ctx.save();
  ctx.fillStyle = shot.color || "#c68cff";
  ctx.shadowColor = shot.color || "#c68cff";
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.arc(p.x, p.y, Math.max(5, p.s * 0.12), 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.restore();
}

function drawBoss() {
  const target = state.platforms[Math.min(player.stage + 9, state.platforms.length - 1)] || state.platforms[player.stage] || state.platforms[0];
  const p = project(target.x, target.y + 8, target.z + 2);
  if (!p) return;
  const size = Math.max(18, p.s * 0.45);
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.fillStyle = "#5a2d8f";
  ctx.strokeStyle = "#f8fbff";
  ctx.lineWidth = 3;
  ctx.shadowColor = "#c68cff";
  ctx.shadowBlur = 18;
  roundRect(-size, -size * 0.72, size * 2, size * 1.44, 8);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#ffd24a";
  ctx.beginPath();
  ctx.arc(-size * 0.38, -size * 0.1, size * 0.13, 0, Math.PI * 2);
  ctx.arc(size * 0.38, -size * 0.1, size * 0.13, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#ff5c7a";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-size * 0.45, size * 0.32);
  ctx.lineTo(size * 0.45, size * 0.32);
  ctx.stroke();
  ctx.restore();
}

function drawTrexBoss() {
  const body = project(0, 4.4, 0);
  const head = project(0, 7.1, 0.65);
  const tail = project(-5.3, 4.8, -0.5);
  const playerPoint = project(player.x, player.y + 1.1, player.z);
  if (!body || !head) return;
  const size = Math.max(34, body.s * 0.72);

  ctx.save();
  if (head && playerPoint) {
    ctx.strokeStyle = state.trex.special === "laser" ? "rgba(255, 53, 94, 0.82)" : "rgba(255, 53, 94, 0.34)";
    ctx.lineWidth = state.trex.special === "laser" ? 5 : 2;
    ctx.shadowColor = "#ff355e";
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.moveTo(head.x + size * 0.22, head.y - size * 0.08);
    ctx.lineTo(playerPoint.x, playerPoint.y);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  if (tail) {
    ctx.strokeStyle = "#365f37";
    ctx.lineWidth = Math.max(10, size * 0.28);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(body.x - size * 0.45, body.y + size * 0.08);
    ctx.lineTo(tail.x, tail.y);
    ctx.stroke();
  }

  ctx.translate(body.x, body.y);
  ctx.fillStyle = "#4f9a44";
  ctx.strokeStyle = "#f8fbff";
  ctx.lineWidth = 3;
  ctx.shadowColor = "#9fdb6f";
  ctx.shadowBlur = 22;
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.9, size * 0.48, -0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.fillStyle = "#2d6830";
  ctx.fillRect(-size * 0.36, size * 0.28, size * 0.18, size * 0.55);
  ctx.fillRect(size * 0.28, size * 0.24, size * 0.18, size * 0.6);
  ctx.fillStyle = "#7dcf63";
  for (let i = -2; i <= 2; i += 1) {
    ctx.beginPath();
    ctx.moveTo(i * size * 0.18, -size * 0.48);
    ctx.lineTo(i * size * 0.18 + size * 0.08, -size * 0.78);
    ctx.lineTo(i * size * 0.18 + size * 0.16, -size * 0.45);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  ctx.save();
  ctx.translate(head.x, head.y);
  ctx.fillStyle = "#5fb14f";
  ctx.strokeStyle = "#f8fbff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.58, size * 0.38, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ff355e";
  ctx.shadowColor = "#ff355e";
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.arc(size * 0.22, -size * 0.08, size * 0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#f8fbff";
  for (let i = -2; i <= 2; i += 1) {
    ctx.beginPath();
    ctx.moveTo(i * size * 0.12, size * 0.22);
    ctx.lineTo(i * size * 0.12 + size * 0.06, size * 0.38);
    ctx.lineTo(i * size * 0.12 + size * 0.12, size * 0.22);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function drawRisingLava() {
  const time = performance.now();
  const nearZ = player.z + 6;
  const farZ = player.z + 150;
  const leftX = player.x - 42;
  const rightX = player.x + 42;
  const frontLow = Math.min(state.lavaLevel - 5, state.camera.y - 8);
  const wall = [
    project(leftX, state.lavaLevel, nearZ),
    project(rightX, state.lavaLevel, nearZ),
    project(rightX, frontLow, nearZ),
    project(leftX, frontLow, nearZ),
  ];
  const points = [
    project(leftX, state.lavaLevel, nearZ),
    project(rightX, state.lavaLevel, nearZ),
    project(rightX, state.lavaLevel, farZ),
    project(leftX, state.lavaLevel, farZ),
  ];
  const visibleSurface = !points.some((point) => !point);
  const visibleWall = !wall.some((point) => !point);
  if (!visibleSurface && !visibleWall) return;
  ctx.save();
  ctx.shadowColor = "#ff5c2e";
  ctx.shadowBlur = 22;
  if (visibleWall) {
    const wallGradient = ctx.createLinearGradient(0, wall[0].y, 0, wall[2].y);
    wallGradient.addColorStop(0, "rgba(255, 240, 120, 0.92)");
    wallGradient.addColorStop(0.24, "rgba(255, 103, 28, 0.92)");
    wallGradient.addColorStop(1, "rgba(150, 19, 10, 0.86)");
    poly(wall, wallGradient);
  }
  if (visibleSurface) poly(points, "rgba(255, 74, 28, 0.88)");
  ctx.shadowBlur = 0;

  const lavaCloseness = 1 - Math.max(0, Math.min(1, (player.y - state.lavaLevel) / 13));
  const visibleRise = state.height * (0.12 + lavaCloseness * 0.54);
  const glow = ctx.createLinearGradient(0, state.height, 0, state.height - visibleRise);
  glow.addColorStop(0, "rgba(255, 69, 24, 0.54)");
  glow.addColorStop(0.55, "rgba(255, 108, 28, 0.22)");
  glow.addColorStop(1, "rgba(255, 69, 24, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, state.height - visibleRise, state.width, visibleRise);

  ctx.lineCap = "round";
  for (let row = 0; row < 14; row += 1) {
    const z = nearZ + 2 + row * 10;
    const a = project(leftX + 4, state.lavaLevel + 0.05, z);
    const b = project(rightX - 4, state.lavaLevel + 0.05, z + Math.sin(time * 0.0025 + row) * 2.2);
    if (!a || !b) continue;
    ctx.strokeStyle = row % 2 === 0 ? "rgba(255, 236, 130, 0.72)" : "rgba(255, 137, 38, 0.68)";
    ctx.lineWidth = Math.max(1.4, a.s * 0.025);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y + Math.sin(time * 0.006 + row) * 5);
    ctx.lineTo(b.x, b.y + Math.cos(time * 0.005 + row) * 5);
    ctx.stroke();
  }

  for (let i = 0; i < 18; i += 1) {
    const z = player.z + 6 + ((i * 19 + time * 0.018) % 128);
    const x = player.x + Math.sin(i * 8.13) * 30;
    const p = project(x, state.lavaLevel + 0.12, z);
    if (!p) continue;
    const radius = Math.max(1.5, p.s * (0.08 + (i % 3) * 0.025));
    ctx.fillStyle = i % 2 === 0 ? "rgba(255, 240, 166, 0.78)" : "rgba(255, 143, 61, 0.72)";
    ctx.beginPath();
    ctx.arc(p.x, p.y + Math.sin(time * 0.007 + i) * 3, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawDarkness(w, h) {
  const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.12, w / 2, h / 2, Math.max(w, h) * 0.58);
  g.addColorStop(0, "rgba(0, 0, 0, 0.05)");
  g.addColorStop(0.34, "rgba(0, 0, 0, 0.36)");
  g.addColorStop(1, "rgba(0, 0, 0, 0.94)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

function drawDisasterOverlay(w, h) {
  if (state.disaster.type === "calm") return;
  const type = state.disaster.type;
  ctx.save();
  if (type === "fog") {
    const fog = ctx.createLinearGradient(0, 0, 0, h);
    fog.addColorStop(0, "rgba(238, 247, 255, 0.48)");
    fog.addColorStop(0.55, "rgba(210, 235, 244, 0.34)");
    fog.addColorStop(1, "rgba(238, 247, 255, 0.18)");
    ctx.fillStyle = fog;
    ctx.fillRect(0, 0, w, h);
  } else if (type === "lightning") {
    ctx.globalAlpha = 0.12 + Math.max(0, Math.sin(performance.now() * 0.02)) * 0.12;
    ctx.fillStyle = "#6fffe0";
    ctx.fillRect(0, 0, w, h);
  } else if (type === "quake") {
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = "#ffd24a";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(255, 210, 74, 0.42)";
    ctx.lineWidth = 3;
    for (let i = 0; i < 5; i += 1) {
      const y = h * (0.22 + i * 0.14) + Math.sin(performance.now() * 0.014 + i) * 14;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y + Math.sin(i * 2.1) * 24);
      ctx.stroke();
    }
  } else {
    ctx.globalAlpha = type === "lowGravity" ? 0.14 : type === "slippery" ? 0.16 : type === "reverse" ? 0.13 : 0.1;
    ctx.fillStyle =
      type === "meteors" ? "#ff8f3d" :
      type === "wind" ? "#6fffe0" :
      type === "slippery" ? "#62b7ff" :
      type === "reverse" ? "#ff7aa6" :
      "#8da0ff";
    ctx.fillRect(0, 0, w, h);
  }
  ctx.restore();
}

function drawCurrentPlatformGuide(w, h) {
  const p = state.platforms[player.stage] || state.platforms[player.checkpoint] || state.platforms[0];
  const edgeDistance = Math.min(
    p.w / 2 - Math.abs(player.x - p.x),
    p.d / 2 - Math.abs(player.z - p.z),
  );
  if (edgeDistance < -0.8) return;

  const danger = p.tag === "lava";
  const alpha = Math.max(0.18, Math.min(0.52, 0.54 - edgeDistance * 0.08));
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = danger ? "#ff5c7a" : p.color;
  ctx.strokeStyle = danger ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 255, 255, 0.62)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(w * 0.18, h);
  ctx.lineTo(w * 0.82, h);
  ctx.lineTo(w * 0.66, h * 0.72);
  ctx.lineTo(w * 0.34, h * 0.72);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.globalAlpha = 0.42;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
  ctx.beginPath();
  ctx.moveTo(w * 0.34, h * 0.72);
  ctx.lineTo(w * 0.66, h * 0.72);
  ctx.stroke();
  ctx.restore();
}

function drawFirstPersonOverlay(w, h) {
  const cx = w / 2;
  const cy = h / 2;
  ctx.save();
  ctx.strokeStyle = "rgba(248, 251, 255, 0.86)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 12, cy);
  ctx.lineTo(cx - 4, cy);
  ctx.moveTo(cx + 4, cy);
  ctx.lineTo(cx + 12, cy);
  ctx.moveTo(cx, cy - 12);
  ctx.lineTo(cx, cy - 4);
  ctx.moveTo(cx, cy + 4);
  ctx.lineTo(cx, cy + 12);
  ctx.stroke();

  if (state.riftPower.time > 0) {
    ctx.strokeStyle = state.riftPower.color;
    ctx.globalAlpha = 0.72;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, 23 + Math.sin(performance.now() * 0.008) * 2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  const armY = h + 76;
  const sway = Math.sin(performance.now() * 0.01) * Math.min(8, Math.hypot(player.vx, player.vz));
  drawArm(w * 0.17 + sway, armY, -0.2, player.color);
  drawArm(w * 0.83 + sway, armY, 0.2, player.color);

  if (player.buffs.carpet > 0) {
    ctx.fillStyle = "rgba(198, 140, 255, 0.72)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w * 0.26, h - 74);
    ctx.lineTo(w * 0.74, h - 74);
    ctx.lineTo(w * 0.66, h - 8);
    ctx.lineTo(w * 0.34, h - 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  drawCompanionCore(w, h);
  ctx.restore();
}

function drawCompanionCore(w, h) {
  const t = performance.now() * 0.004;
  const x = w * 0.72 + Math.sin(t) * 18;
  const y = h * 0.28 + Math.cos(t * 1.3) * 10;
  const r = state.riftPower.time > 0 ? 13 : 9;
  ctx.save();
  ctx.globalAlpha = 0.82;
  ctx.shadowColor = state.riftPower.time > 0 ? state.riftPower.color : "#6fffe0";
  ctx.shadowBlur = 18;
  ctx.fillStyle = state.riftPower.time > 0 ? state.riftPower.color : "#6fffe0";
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(255,255,255,0.75)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, r + 8, t, t + Math.PI * 1.35);
  ctx.stroke();
  ctx.restore();
}

function drawArm(x, y, angle, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = shade(color, -10);
  ctx.strokeStyle = "rgba(0, 0, 0, 0.22)";
  ctx.lineWidth = 2;
  roundRect(-28, -118, 56, 128, 18);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ffe0b2";
  roundRect(-23, -144, 46, 42, 15);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawVignette(w, h) {
  const g = ctx.createRadialGradient(w / 2, h * 0.5, h * 0.2, w / 2, h * 0.5, h * 0.8);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,0.22)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

function drawRiftFlash(w, h) {
  if (state.riftFlash <= 0) return;
  const alpha = Math.min(0.22, state.riftFlash * 0.22);
  const g = ctx.createRadialGradient(w / 2, h * 0.46, 20, w / 2, h * 0.46, h * 0.72);
  g.addColorStop(0, `rgba(198, 140, 255, ${alpha})`);
  g.addColorStop(0.48, `rgba(56, 214, 169, ${alpha * 0.45})`);
  g.addColorStop(1, "rgba(198, 140, 255, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

function shade(hex, amount) {
  if (hex.startsWith("rgb")) {
    const parts = hex.match(/\d+/g)?.map(Number) || [255, 255, 255];
    const r = Math.max(0, Math.min(255, parts[0] + amount));
    const g = Math.max(0, Math.min(255, parts[1] + amount));
    const b = Math.max(0, Math.min(255, parts[2] + amount));
    return `rgb(${r}, ${g}, ${b})`;
  }
  const clean = hex.replace("#", "");
  const n = parseInt(clean, 16);
  const r = Math.max(0, Math.min(255, (n >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amount));
  const b = Math.max(0, Math.min(255, (n & 255) + amount));
  return `rgb(${r}, ${g}, ${b})`;
}

function formatTime(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(total / 60).toString().padStart(2, "0");
  const seconds = (total % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function ordinalPlace(place) {
  if (place % 100 >= 11 && place % 100 <= 13) return `${place}th`;
  const suffixes = { 1: "st", 2: "nd", 3: "rd" };
  return `${place}${suffixes[place % 10] || "th"}`;
}

function getPlayerPlacement() {
  const ranked = [player, ...state.bots]
    .slice()
    .sort((a, b) => b.stage - a.stage || b.z - a.z);
  return ranked.findIndex((runner) => runner === player) + 1;
}

function updateUi() {
  ui.bricks.textContent = state.bricks.toLocaleString();
  ui.grizzles.textContent = state.grizzles.toLocaleString();
  ui.stageReadout.textContent =
    state.mode.id === "trex"
      ? `Hits ${state.trex.hits} / 3`
      : state.mode.id === "endless"
        ? `${Math.max(1, player.stage + 1)} / endless`
        : `${Math.min(player.stage + 1, state.platforms.length)} / ${state.platforms.length}`;
  ui.riftReadout.textContent = `${state.riftStreak} streak`;
  ui.powerReadout.textContent =
    state.riftPower.time > 0 ? `${state.riftPower.label} ${Math.ceil(state.riftPower.time)}s` : "none";
  ui.aiDifficultyReadout.textContent = (aiDifficulties[state.aiDifficulty] || aiDifficulties.hard).label;
  ui.modeTimer.textContent = !state.roundActive
    ? "CHOOSE"
    : state.mode.id === "endless"
      ? "ENDLESS"
      : formatTime(state.modeEndsAt - performance.now());
  ui.ammoReadout.textContent = `${player.ammo} / 50`;
  ui.ammoMeter.classList.toggle("hidden", state.mode.id !== "war");

  if (state.mode.id === "trex") {
    ui.leaderboard.innerHTML = [
      `<li><span>1</span><strong>T-Rex hits</strong><span>${state.trex.hits}/3</span></li>`,
      `<li><span>2</span><strong>Survive</strong><span>3:00</span></li>`,
      `<li><span>3</span><strong>Special</strong><span>${Math.ceil(state.trex.specialClock)}s</span></li>`,
    ].join("");
    return;
  }

  const ranked = [player, ...state.bots]
    .slice()
    .sort((a, b) => b.stage - a.stage || b.z - a.z)
    .slice(0, 5);
  ui.leaderboard.innerHTML = ranked
    .map((runner, index) => `<li><span>${index + 1}</span><strong>${runner.name}</strong><span>${runner.stage + 1}</span></li>`)
    .join("");
}

function renderShop() {
  const source = state.shopTab === "gear" ? gear : state.shopTab === "eggs" ? eggs : grizzleItems;
  ui.shopItems.innerHTML = "";
  for (const item of source) {
    const card = document.createElement("article");
    card.className = "shop-card";
    const body = document.createElement("div");
    const title = document.createElement("h2");
    title.textContent = item.name;
    const text = document.createElement("p");
    text.textContent = item.text || `${item.tier[0].toUpperCase()}${item.tier.slice(1)} pet egg.`;
    body.append(title, text);

    const price = document.createElement("div");
    price.className = "price";
    const amount = document.createElement("span");
    amount.textContent = `${item.cost.toLocaleString()} ${item.currency}`;
    const button = document.createElement("button");
    button.textContent = "Buy";
    button.addEventListener("click", () => buyItem(item));
    price.append(amount, button);
    card.append(body, price);
    ui.shopItems.append(card);
  }
}

function buyItem(item) {
  if (state[item.currency] < item.cost) {
    showToast(`Need more ${item.currency}.`);
    return;
  }
  state[item.currency] -= item.cost;
  if (item.tier) {
    const prize = hatchEgg(item.tier);
    showToast(`${item.name} hatched ${prize}.`);
  } else {
    player.buffs[item.key] = Math.max(player.buffs[item.key], item.duration);
    showToast(`${item.name} active.`);
  }
  updateUi();
}

function hatchEgg(tier) {
  const prizes = {
    normal: ["Pebble Pup", "Mini Noob", "Cloud Buddy"],
    super: ["Neon Runner", "Blue Dragon", "Gold Buddy"],
    epic: ["Crystal Cat", "Rocket Cub", "Laser Pal"],
    legendary: ["Royal Grizzle", "Void Phoenix", "Sun Knight"],
    ultra: ["Galaxy Grizzle", "Rainbow Titan", "Obby Crown"],
  };
  const bonus = { normal: 15, super: 35, epic: 75, legendary: 145, ultra: 260 };
  state.bricks += bonus[tier];
  if (tier === "legendary" || tier === "ultra") state.grizzles += tier === "ultra" ? 2 : 1;
  const list = prizes[tier];
  return list[Math.floor(Math.random() * list.length)];
}

let toastTimer = 0;
function showToast(message) {
  ui.toast.textContent = message;
  ui.toast.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => ui.toast.classList.add("hidden"), 1800);
}

function canLookAround() {
  return ui.wheelModal.classList.contains("hidden") && ui.shopModal.classList.contains("hidden");
}

function applyLookDelta(dx, dy) {
  state.camera.yaw += dx * 0.006;
  state.camera.pitch = Math.max(-0.55, Math.min(0.65, state.camera.pitch - dy * 0.005));
}

function startMouseLook(event) {
  if (!canLookAround()) return;
  if (event.button === 0 && state.mode.id === "war") shootPlayerWarShot();
  state.camera.dragging = true;
  state.camera.lastX = event.clientX;
  state.camera.lastY = event.clientY;
  canvas.setPointerCapture?.(event.pointerId);
  try {
    const lockRequest = canvas.requestPointerLock?.();
    lockRequest?.catch?.(() => {});
  } catch {
    // Drag look still works when the browser blocks pointer lock.
  }
  event.preventDefault();
}

function updateMouseLook(event) {
  if (!state.camera.dragging && document.pointerLockElement !== canvas) return;
  const dx = document.pointerLockElement === canvas ? event.movementX || 0 : event.clientX - state.camera.lastX;
  const dy = document.pointerLockElement === canvas ? event.movementY || 0 : event.clientY - state.camera.lastY;
  state.camera.lastX = event.clientX;
  state.camera.lastY = event.clientY;
  applyLookDelta(dx, dy);
  event.preventDefault();
}

function stopMouseLook(event) {
  state.camera.dragging = false;
  if (event?.pointerId !== undefined) canvas.releasePointerCapture?.(event.pointerId);
}

function handlePointerLockChange() {
  state.camera.dragging = document.pointerLockElement === canvas;
}

function gameLoop(now) {
  const dt = Math.min(0.033, (now - state.lastTime) / 1000);
  state.lastTime = now;

  if (!canLookAround()) {
    state.camera.dragging = false;
    if (document.pointerLockElement === canvas) document.exitPointerLock?.();
  }

  if (!state.roundActive) {
    render();
    updateUi();
    requestAnimationFrame(gameLoop);
    return;
  }

  updatePlatformMotion(now);
  updateLavaRising(dt);
  const runners = state.mode.id === "trex" ? [player] : [player, ...state.bots];
  for (const runner of runners) {
    updateBuffs(runner, dt);
    applyPhysics(runner, dt);
  }
  updatePlayTimeRewards(dt);
  updateCoins(dt);
  updateWar(dt);
  updateEndless();
  updateBoss(dt);
  updateTrexBoss(dt);
  updateRandomDisaster(dt);
  state.riftFlash = Math.max(0, state.riftFlash - dt);

  if (state.mode.id === "trex" && state.modeEndsAt - now <= 0 && !state.trex.ended) {
    finishTrexFight(true);
  }

  if (state.modeEndsAt - now <= 0 && ui.wheelModal.classList.contains("hidden")) {
    const placement = ordinalPlace(getPlayerPlacement());
    const message = `You got ${placement} place. Choose the next mode.`;
    showToast(`You got ${placement} place.`);
    openModeChooser(message);
  }

  render();
  updateUi();
  requestAnimationFrame(gameLoop);
}

window.addEventListener("resize", resize);
canvas.addEventListener("pointerdown", startMouseLook);
window.addEventListener("pointermove", updateMouseLook);
window.addEventListener("pointerup", stopMouseLook);
window.addEventListener("pointercancel", stopMouseLook);
document.addEventListener("mousemove", updateMouseLook);
document.addEventListener("pointerlockchange", handlePointerLockChange);
canvas.addEventListener("contextmenu", (event) => event.preventDefault());
window.addEventListener("keydown", (event) => {
  state.keys.add(event.code);
  if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)) event.preventDefault();
});
window.addEventListener("keyup", (event) => state.keys.delete(event.code));

ui.spinBtn.addEventListener("click", () => {
  openModeChooser("Pick the next obby challenge.");
});
ui.shopBtn.addEventListener("click", () => {
  renderShop();
  ui.shopModal.classList.remove("hidden");
});
ui.closeShopBtn.addEventListener("click", () => ui.shopModal.classList.add("hidden"));
ui.resetBtn.addEventListener("click", () => resetRunner(player, player.buffs.immortal > 0 ? player.stage : player.checkpoint));
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((el) => el.classList.remove("active"));
    tab.classList.add("active");
    state.shopTab = tab.dataset.tab;
    renderShop();
  });
});

resize();
buildCourse();
setupBots();
renderModeChoices();
renderDifficultyChoices();
resetRoundRunners();
ui.modeName.textContent = state.mode.label;
openModeChooser("Pick a mode to start the obby.");
requestAnimationFrame(gameLoop);
