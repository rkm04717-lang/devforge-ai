import { Project } from './types';

export const SAMPLE_DRAGON_GAME_PROJECT: Project = {
  id: 'proj_sample_dragon_game',
  userId: 'user_devforge_demo',
  name: 'Dragon Arena: Flight & Flame',
  description: 'Browser-based dragon combat game featuring real-time flight physics, flame breath particle engine, floating combat text, and dual desktop/mobile touch controls.',
  technology: 'HTML5 Canvas • TypeScript • Web Audio API',
  category: 'game',
  status: 'forged',
  createdAt: '2026-09-10T14:20:00.000Z',
  updatedAt: '2026-09-13T10:30:00.000Z',
  plan: {
    projectName: 'Dragon Arena: Flight & Flame',
    tagline: 'High-altitude wyvern dogfights with responsive mobile joystick and keyboard inputs.',
    description: 'A 60FPS canvas action game built with modular TypeScript/ES modules, particle system for flame breath, dynamic enemy AI swarms, and synthetic sound effects.',
    techStack: {
      primary: 'HTML5 Canvas',
      frameworks: ['Custom 60FPS Game Loop', 'Web Audio API Synth'],
      languages: ['HTML', 'JavaScript', 'CSS'],
      styling: 'Futuristic Dark HUD with Neon Accents',
      runtime: 'Browser Sandbox (Zero dependencies)'
    },
    features: [
      'Kinematic dragon flight controls (Arrow Keys / WASD + Virtual D-Pad for Touch)',
      'Thermal plasma breath particle emitter with damage collider',
      'Autonomous enemy shadow-wyverns with flank behaviors',
      'Synthesized arcade sound effects via Web Audio API (no external asset dependencies)',
      'Responsive full-screen canvas supporting desktop & mobile orientations',
      'Real-time HUD with Dragon Vitality, Plasma Energy, and Wyvern Hunt count'
    ],
    structureSummary: [
      'index.html — Application shell, canvas viewport & mobile touch controls overlay',
      'style.css — Dark futuristic styling, responsive HUD, virtual joystick styles',
      'game.js — Core game engine, entity loop, collision detection, and audio synthesis',
      'README.md — Architecture explanation, build & play instructions'
    ],
    steps: [
      { id: 1, title: 'Initialize Game Engine & Viewport', description: 'Setup 60FPS requestAnimationFrame canvas loop and touch event listeners', affectedFiles: ['index.html', 'game.js'], status: 'completed' },
      { id: 2, title: 'Implement Dragon Flight Physics', description: 'Velocity vectors, drag deceleration, rotation towards cursor/joystick', affectedFiles: ['game.js'], status: 'completed' },
      { id: 3, title: 'Flame Breath Particle System', description: 'Create high-velocity thermal particle emitter with alpha fade and collision bounds', affectedFiles: ['game.js'], status: 'completed' },
      { id: 4, title: 'Enemy AI Wyvern Swarm', description: 'Spawn hunting shadow-drakes that pursue player and evade crossfire', affectedFiles: ['game.js'], status: 'completed' },
      { id: 5, title: 'Synthetic Audio Engine', description: 'Program sound synthesizers for fire breath, wing flaps, and hit impacts', affectedFiles: ['game.js'], status: 'completed' },
      { id: 6, title: 'Dual Mobile & Desktop Controls', description: 'Touch d-pad overlay for mobile with automatic touch detection', affectedFiles: ['index.html', 'style.css'], status: 'completed' }
    ],
    estimatedForgeTokens: 180,
    previewType: 'browser_sandboxed'
  },
  files: [
    {
      id: 'file_dg_html',
      path: 'index.html',
      language: 'html',
      updatedAt: '2026-09-13T10:30:00.000Z',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>Dragon Arena: Flight & Flame</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="game-container">
    <canvas id="arena"></canvas>

    <!-- Top HUD -->
    <header id="hud">
      <div class="hud-stat">
        <span class="label">DRAGON VITALITY</span>
        <div class="bar-container">
          <div id="health-bar" class="bar health"></div>
        </div>
      </div>
      <div class="hud-center">
        <div class="title">DRAGON ARENA</div>
        <div class="score-display">SCORE: <span id="score-val">0</span></div>
      </div>
      <div class="hud-stat">
        <span class="label">FLAME ENERGY</span>
        <div class="bar-container">
          <div id="energy-bar" class="bar energy"></div>
        </div>
      </div>
    </header>

    <!-- Instructions banner on start -->
    <div id="start-overlay" class="overlay">
      <div class="modal">
        <h2>DRAGON ARENA</h2>
        <p class="subtitle">Command the legendary Obsidian Drake.</p>
        <div class="controls-guide">
          <div class="guide-item"><span>Desktop:</span> [WASD] or [Arrow Keys] to Fly • [SPACE] or [Left Click] to Breathe Fire</div>
          <div class="guide-item"><span>Mobile:</span> Use the on-screen joystick and FIRE button below</div>
        </div>
        <button id="start-btn" class="btn-primary">LAUNCH FLIGHT</button>
      </div>
    </div>

    <!-- Game Over overlay -->
    <div id="game-over-overlay" class="overlay hidden">
      <div class="modal">
        <h2 class="danger">WYVERN FALLEN</h2>
        <p>The swarms overwhelmed your dragon.</p>
        <div class="final-score">FINAL SCORE: <span id="final-score-val">0</span></div>
        <button id="restart-btn" class="btn-primary">REFORGE & RETRY</button>
      </div>
    </div>

    <!-- Mobile Virtual Controls -->
    <div id="mobile-controls">
      <div id="dpad-zone">
        <div class="dpad-btn up" data-key="ArrowUp">▲</div>
        <div class="dpad-btn left" data-key="ArrowLeft">◀</div>
        <div class="dpad-btn down" data-key="ArrowDown">▼</div>
        <div class="dpad-btn right" data-key="ArrowRight">▶</div>
      </div>
      <div id="action-zone">
        <button id="mobile-fire-btn" class="fire-btn">🔥 BREATHE FIRE</button>
      </div>
    </div>
  </div>

  <script src="game.js"></script>
</body>
</html>`
    },
    {
      id: 'file_dg_css',
      path: 'style.css',
      language: 'css',
      updatedAt: '2026-09-13T10:30:00.000Z',
      content: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  user-select: none;
  -webkit-user-select: none;
}

body, html {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #06090e;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  color: #e2e8f0;
}

#game-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(circle at center, #111827 0%, #030712 100%);
}

canvas#arena {
  display: block;
  width: 100%;
  height: 100%;
}

/* Technical Cyber HUD */
#hud {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(180deg, rgba(3, 7, 18, 0.85) 0%, rgba(3, 7, 18, 0) 100%);
  pointer-events: none;
}

.hud-stat {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 160px;
}

.hud-stat .label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #94a3b8;
}

.bar-container {
  width: 100%;
  height: 10px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid #334155;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
}

.bar {
  height: 100%;
  width: 100%;
  transition: width 0.15s ease-out;
}

.bar.health {
  background: linear-gradient(90deg, #ef4444, #f97316);
  box-shadow: 0 0 12px rgba(249, 115, 22, 0.6);
}

.bar.energy {
  background: linear-gradient(90deg, #06b6d4, #3b82f6);
  box-shadow: 0 0 12px rgba(6, 182, 212, 0.6);
}

.hud-center {
  text-align: center;
}

.hud-center .title {
  font-size: 14px;
  letter-spacing: 3px;
  font-weight: 800;
  color: #38bdf8;
  text-shadow: 0 0 12px rgba(56, 189, 248, 0.5);
}

.score-display {
  font-size: 18px;
  font-weight: 700;
  color: #f1f5f9;
  font-family: monospace;
}

/* Modals */
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(3, 7, 18, 0.88);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.overlay.hidden {
  display: none;
}

.modal {
  background: #0b1120;
  border: 1px solid #1e293b;
  border-radius: 12px;
  padding: 32px 36px;
  max-width: 480px;
  width: 90%;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
}

.modal h2 {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: 2px;
  color: #f8fafc;
  margin-bottom: 8px;
}

.modal h2.danger {
  color: #f87171;
}

.modal .subtitle {
  color: #94a3b8;
  font-size: 14px;
  margin-bottom: 24px;
}

.controls-guide {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  text-align: left;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.controls-guide span {
  color: #38bdf8;
  font-weight: 600;
}

.btn-primary {
  background: linear-gradient(135deg, #0284c7, #2563eb);
  color: #ffffff;
  border: none;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 14px 28px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  box-shadow: 0 0 20px rgba(37, 99, 235, 0.4);
  transition: transform 0.1s, opacity 0.2s;
}

.btn-primary:active {
  transform: scale(0.98);
}

/* Virtual Mobile Controls */
#mobile-controls {
  position: absolute;
  bottom: 24px;
  left: 20px;
  right: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  pointer-events: none;
}

#dpad-zone {
  position: relative;
  width: 130px;
  height: 130px;
  pointer-events: auto;
}

.dpad-btn {
  position: absolute;
  width: 44px;
  height: 44px;
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid #334155;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 18px;
  cursor: pointer;
  touch-action: none;
}

.dpad-btn:active, .dpad-btn.active {
  background: #0284c7;
  color: #fff;
  box-shadow: 0 0 12px rgba(2, 132, 199, 0.6);
}

.dpad-btn.up { top: 0; left: 43px; }
.dpad-btn.down { bottom: 0; left: 43px; }
.dpad-btn.left { top: 43px; left: 0; }
.dpad-btn.right { top: 43px; right: 0; }

#action-zone {
  pointer-events: auto;
}

.fire-btn {
  background: linear-gradient(135deg, #ea580c, #dc2626);
  border: 2px solid #fdba74;
  color: white;
  font-weight: 800;
  font-size: 14px;
  letter-spacing: 1px;
  width: 140px;
  height: 60px;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(234, 88, 12, 0.5);
  touch-action: none;
}

.fire-btn:active, .fire-btn.active {
  background: #b91c1c;
  transform: scale(0.96);
}`
    },
    {
      id: 'file_dg_js',
      path: 'game.js',
      language: 'javascript',
      updatedAt: '2026-09-13T10:30:00.000Z',
      content: `// Dragon Arena: Flight & Flame - Autonomous 60FPS Game Loop
(function() {
  const canvas = document.getElementById('arena');
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Audio Synth via Web Audio API
  let audioCtx = null;
  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playSound(type) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      const now = audioCtx.currentTime;

      if (type === 'flame') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'hit') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.15);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'kill') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.25);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch(e) {}
  }

  // Game State
  let running = false;
  let score = 0;
  let dragon = {
    x: width / 2,
    y: height / 2,
    vx: 0,
    vy: 0,
    angle: 0,
    health: 100,
    maxHealth: 100,
    energy: 100,
    maxEnergy: 100,
    speed: 4.8,
    isFiring: false,
    radius: 24,
    wingAngle: 0
  };

  const keys = {};
  const particles = [];
  const enemies = [];
  const stars = [];

  // Generate starfield background
  for (let i = 0; i < 120; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.8 + 0.2
    });
  }

  // Input Listeners
  window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ' || e.code === 'Space') {
      dragon.isFiring = true;
    }
  });

  window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
    if (e.key === ' ' || e.code === 'Space') {
      dragon.isFiring = false;
    }
  });

  window.addEventListener('mousedown', () => { dragon.isFiring = true; });
  window.addEventListener('mouseup', () => { dragon.isFiring = false; });
  window.addEventListener('mousemove', (e) => {
    if (!running) return;
    const dx = e.clientX - dragon.x;
    const dy = e.clientY - dragon.y;
    dragon.angle = Math.atan2(dy, dx);
  });

  // Mobile virtual buttons
  document.querySelectorAll('.dpad-btn').forEach(btn => {
    const key = btn.dataset.key;
    const activate = (e) => { e.preventDefault(); keys[key] = true; btn.classList.add('active'); };
    const deactivate = (e) => { e.preventDefault(); keys[key] = false; btn.classList.remove('active'); };
    btn.addEventListener('touchstart', activate, { passive: false });
    btn.addEventListener('touchend', deactivate, { passive: false });
    btn.addEventListener('mousedown', activate);
    btn.addEventListener('mouseup', deactivate);
  });

  const mobileFireBtn = document.getElementById('mobile-fire-btn');
  if (mobileFireBtn) {
    const startFire = (e) => { e.preventDefault(); dragon.isFiring = true; mobileFireBtn.classList.add('active'); };
    const stopFire = (e) => { e.preventDefault(); dragon.isFiring = false; mobileFireBtn.classList.remove('active'); };
    mobileFireBtn.addEventListener('touchstart', startFire, { passive: false });
    mobileFireBtn.addEventListener('touchend', stopFire, { passive: false });
    mobileFireBtn.addEventListener('mousedown', startFire);
    mobileFireBtn.addEventListener('mouseup', stopFire);
  }

  // Spawning enemies
  let lastSpawn = 0;
  function spawnEnemy() {
    const edge = Math.floor(Math.random() * 4);
    let x, y;
    if (edge === 0) { x = Math.random() * width; y = -40; }
    else if (edge === 1) { x = width + 40; y = Math.random() * height; }
    else if (edge === 2) { x = Math.random() * width; y = height + 40; }
    else { x = -40; y = Math.random() * height; }

    enemies.push({
      x, y,
      speed: Math.random() * 2 + 1.8,
      radius: 18,
      health: 30,
      color: '#a855f7'
    });
  }

  // Flame particle generator
  function emitFlame() {
    if (dragon.energy <= 0) return;
    dragon.energy = Math.max(0, dragon.energy - 1.2);
    playSound('flame');

    const nozzleX = dragon.x + Math.cos(dragon.angle) * 32;
    const nozzleY = dragon.y + Math.sin(dragon.angle) * 32;
    const spread = (Math.random() - 0.5) * 0.45;
    const pSpeed = Math.random() * 7 + 8;

    particles.push({
      x: nozzleX,
      y: nozzleY,
      vx: Math.cos(dragon.angle + spread) * pSpeed + dragon.vx * 0.4,
      vy: Math.sin(dragon.angle + spread) * pSpeed + dragon.vy * 0.4,
      life: 1.0,
      decay: Math.random() * 0.04 + 0.03,
      size: Math.random() * 8 + 12,
      hue: Math.random() * 35 + 15 // Orange to fiery yellow
    });
  }

  // UI Handlers
  const startBtn = document.getElementById('start-btn');
  const restartBtn = document.getElementById('restart-btn');
  const startOverlay = document.getElementById('start-overlay');
  const gameOverOverlay = document.getElementById('game-over-overlay');
  const healthBar = document.getElementById('health-bar');
  const energyBar = document.getElementById('energy-bar');
  const scoreVal = document.getElementById('score-val');
  const finalScoreVal = document.getElementById('final-score-val');

  function startGame() {
    initAudio();
    running = true;
    score = 0;
    dragon.x = width / 2;
    dragon.y = height / 2;
    dragon.vx = 0;
    dragon.vy = 0;
    dragon.health = 100;
    dragon.energy = 100;
    enemies.length = 0;
    particles.length = 0;
    startOverlay.classList.add('hidden');
    gameOverOverlay.classList.add('hidden');
  }

  function gameOver() {
    running = false;
    finalScoreVal.textContent = score;
    gameOverOverlay.classList.remove('hidden');
  }

  startBtn.addEventListener('click', startGame);
  restartBtn.addEventListener('click', startGame);

  // Main 60FPS loop
  function loop(time) {
    requestAnimationFrame(loop);

    // Update stars
    for (let s of stars) {
      s.y += s.speed;
      if (s.y > height) s.y = 0;
    }

    if (running) {
      // Movement Input Handling
      let ax = 0, ay = 0;
      if (keys['ArrowUp'] || keys['w'] || keys['W']) ay -= 1;
      if (keys['ArrowDown'] || keys['s'] || keys['S']) ay += 1;
      if (keys['ArrowLeft'] || keys['a'] || keys['A']) ax -= 1;
      if (keys['ArrowRight'] || keys['d'] || keys['D']) ax += 1;

      if (ax !== 0 || ay !== 0) {
        const len = Math.hypot(ax, ay);
        dragon.vx += (ax / len) * 0.6;
        dragon.vy += (ay / len) * 0.6;
      }

      // Physics damping & clamping
      dragon.vx *= 0.92;
      dragon.vy *= 0.92;
      dragon.x += dragon.vx;
      dragon.y += dragon.vy;

      // Screen boundary wrap
      if (dragon.x < 30) dragon.x = 30;
      if (dragon.x > width - 30) dragon.x = width - 30;
      if (dragon.y < 50) dragon.y = 50;
      if (dragon.y > height - 30) dragon.y = height - 30;

      // Energy recharge
      if (!dragon.isFiring) {
        dragon.energy = Math.min(100, dragon.energy + 0.6);
      } else {
        emitFlame();
      }

      // Spawn enemies
      if (time - lastSpawn > 1400) {
        spawnEnemy();
        lastSpawn = time;
      }

      // Update Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        p.size *= 0.96;

        // Check particle vs enemy collisions
        for (let j = enemies.length - 1; j >= 0; j--) {
          const em = enemies[j];
          const dist = Math.hypot(p.x - em.x, p.y - em.y);
          if (dist < em.radius + p.size * 0.5) {
            em.health -= 15;
            p.life = 0;
            playSound('hit');
            if (em.health <= 0) {
              enemies.splice(j, 1);
              score += 150;
              scoreVal.textContent = score;
              playSound('kill');
            }
            break;
          }
        }

        if (p.life <= 0) {
          particles.splice(i, 1);
        }
      }

      // Update Enemies
      for (let i = enemies.length - 1; i >= 0; i--) {
        const em = enemies[i];
        const dx = dragon.x - em.x;
        const dy = dragon.y - em.y;
        const dist = Math.hypot(dx, dy);

        em.x += (dx / dist) * em.speed;
        em.y += (dy / dist) * em.speed;

        // Check collision with player dragon
        if (dist < dragon.radius + em.radius) {
          dragon.health -= 0.6;
          playSound('hit');
          if (dragon.health <= 0) {
            gameOver();
            break;
          }
        }
      }

      // Sync HUD
      healthBar.style.width = Math.max(0, dragon.health) + '%';
      energyBar.style.width = Math.max(0, dragon.energy) + '%';
      dragon.wingAngle += 0.18;
    }

    // Render Canvas
    ctx.fillStyle = '#060a12';
    ctx.fillRect(0, 0, width, height);

    // Draw Stars
    ctx.fillStyle = '#64748b';
    for (let s of stars) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw Particles (Flames)
    for (let p of particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = \`hsl(\${p.hue}, 100%, 55%)\`;
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Draw Enemies (Shadow Wyverns)
    for (let em of enemies) {
      ctx.save();
      ctx.translate(em.x, em.y);
      const angle = Math.atan2(dragon.y - em.y, dragon.x - em.x);
      ctx.rotate(angle);

      ctx.fillStyle = '#9333ea';
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur = 12;

      // Wyvern body
      ctx.beginPath();
      ctx.moveTo(18, 0);
      ctx.lineTo(-12, -10);
      ctx.lineTo(-6, 0);
      ctx.lineTo(-12, 10);
      ctx.closePath();
      ctx.fill();

      // Enemy eyes
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(4, -4, 3, 3);
      ctx.fillRect(4, 1, 3, 3);
      ctx.restore();
    }

    // Draw Player Dragon
    ctx.save();
    ctx.translate(dragon.x, dragon.y);
    ctx.rotate(dragon.angle);

    // Dragon wings flapping
    const wingSpread = Math.sin(dragon.wingAngle) * 16 + 28;
    ctx.fillStyle = '#0284c7';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 16;

    // Left wing
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(-14, -wingSpread);
    ctx.lineTo(8, -12);
    ctx.closePath();
    ctx.fill();

    // Right wing
    ctx.beginPath();
    ctx.moveTo(0, 5);
    ctx.lineTo(-14, wingSpread);
    ctx.lineTo(8, 12);
    ctx.closePath();
    ctx.fill();

    // Dragon body
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(0, 0, 24, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Dragon Horns & Head
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(22, -4);
    ctx.lineTo(34, 0);
    ctx.lineTo(22, 4);
    ctx.closePath();
    ctx.fill();

    // Glowing Eyes
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#fef08a';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(16, -3, 2, 0, Math.PI * 2);
    ctx.arc(16, 3, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  requestAnimationFrame(loop);
})();`
    },
    {
      id: 'file_dg_readme',
      path: 'README.md',
      language: 'markdown',
      updatedAt: '2026-09-13T10:30:00.000Z',
      content: `# Dragon Arena: Flight & Flame

**Forged with DEVFORGE AI** — *Describe it. Forge it.*

## Overview
A zero-dependency, hardware-accelerated 60FPS browser action game featuring an obsidian dragon dogfight against infinite waves of shadow wyverns.

## Architecture
- **Rendering Engine:** Native HTML5 2D Canvas with dual-buffer physics.
- **Audio:** Web Audio API sound synthesis generating dynamic flame breath and impact audio without external WAV/MP3 asset dependencies.
- **Input Controllers:** Responsive dual-channel handling:
  - **Desktop:** Keyboard Arrow / WASD movement + Spacebar / Mouse click fire.
  - **Mobile:** Virtual 4-way D-Pad + Dedicated touch Action Button.
- **Particle System:** Dynamic thermal emitter with velocity decay, alpha fade, and collider physics.

## Running Locally
1. Download or extract the project files.
2. Open \`index.html\` directly in any modern web browser.
3. Or serve with any static web server:
   \`\`\`bash
   npx serve .
   \`\`\`
`
    }
  ]
};

export const SAMPLE_FITNESS_PROJECT: Project = {
  id: 'proj_sample_cyberpulse_fitness',
  userId: 'user_devforge_demo',
  name: 'CyberPulse Fitness Engine',
  description: 'Clean responsive fitness tracking web application with HIIT interval timers, dynamic progress charts, workout logs, and personalized exercise targets.',
  technology: 'HTML5 • CSS Grid • JavaScript • SVG Data Viz',
  category: 'web_app',
  status: 'forged',
  createdAt: '2026-09-11T09:15:00.000Z',
  updatedAt: '2026-09-13T08:45:00.000Z',
  plan: {
    projectName: 'CyberPulse Fitness Engine',
    tagline: 'High-performance athletic telemetry and interval training tracker.',
    description: 'A modular, high-contrast dark dashboard for tracking workouts, active calorie burn rates, and customizable countdown intervals.',
    techStack: {
      primary: 'HTML5 / CSS / Vanilla JS',
      frameworks: ['SVG Micro-Charts', 'Local State Engine'],
      languages: ['HTML', 'JavaScript', 'CSS'],
      styling: 'Dark Technical Athletic UI',
      runtime: 'Browser Sandboxed'
    },
    features: [
      'Configurable HIIT Interval Timer with audio beeps and visual countdown ring',
      'Dynamic SVG metric donut rings for daily goals (Calories, Active Minutes, Water)',
      'Workout session logger with categorical filtering and timestamped history',
      'One-click sample workout seeder and local reset'
    ],
    structureSummary: [
      'index.html — Application shell with layout grid, stats cards, timer view & log modal',
      'style.css — Deep charcoal athletic theme, responsive cards, SVG circular indicators',
      'app.js — Interval timer engine, metric calculation, and session persistence',
      'README.md — Project documentation and setup guidelines'
    ],
    steps: [
      { id: 1, title: 'Create Metric Dashboard Layout', description: 'Build high-contrast cards with circular SVG progress meters', affectedFiles: ['index.html', 'style.css'], status: 'completed' },
      { id: 2, title: 'HIIT Timer Engine', description: 'Accurate interval countdown with Work/Rest phases and audio cues', affectedFiles: ['app.js'], status: 'completed' },
      { id: 3, title: 'Workout Logging Interface', description: 'Form input for exercise type, sets, reps, and calories with local persistence', affectedFiles: ['app.js', 'index.html'], status: 'completed' }
    ],
    estimatedForgeTokens: 140,
    previewType: 'browser_sandboxed'
  },
  files: [
    {
      id: 'file_cp_html',
      path: 'index.html',
      language: 'html',
      updatedAt: '2026-09-13T08:45:00.000Z',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CyberPulse Fitness Engine</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="app-layout">
    <!-- Header -->
    <header class="navbar">
      <div class="brand">
        <div class="pulse-dot"></div>
        <h1>CYBERPULSE</h1>
        <span class="badge">V2.4</span>
      </div>
      <div class="user-stats">
        <span class="streak-tag">ACTIVE DAY: 14</span>
      </div>
    </header>

    <!-- Main Grid -->
    <main class="dashboard-grid">
      <!-- Card 1: Circular Progress -->
      <section class="card progress-card">
        <div class="card-header">
          <h2>DAILY TARGETS</h2>
          <span class="subtext">Burn & Endurance</span>
        </div>
        <div class="rings-wrapper">
          <svg class="progress-ring" viewBox="0 0 120 120">
            <circle class="ring-bg" cx="60" cy="60" r="50"></circle>
            <circle id="calorie-ring" class="ring-fill calories" cx="60" cy="60" r="50" stroke-dasharray="314" stroke-dashoffset="94"></circle>
          </svg>
          <div class="ring-center">
            <span id="cal-count" class="big-num">720</span>
            <span class="unit">KCAL / 1,000</span>
          </div>
        </div>
        <div class="metric-tags">
          <div class="tag-item"><span class="dot cal"></span> 72% Calorie Burn</div>
          <div class="tag-item"><span class="dot min"></span> 42 min Active Time</div>
        </div>
      </section>

      <!-- Card 2: Interval HIIT Timer -->
      <section class="card timer-card">
        <div class="card-header">
          <h2>HIIT INTERVAL TIMER</h2>
          <span id="phase-badge" class="phase-tag work">WORK PHASE</span>
        </div>
        <div class="timer-display">
          <span id="timer-val">00:45</span>
        </div>
        <div class="timer-controls">
          <button id="btn-start-timer" class="btn-action">START INTERVAL</button>
          <button id="btn-reset-timer" class="btn-outline">RESET</button>
        </div>
        <div class="timer-config">
          <label>Work: <strong>45s</strong></label>
          <label>Rest: <strong>15s</strong></label>
          <label>Rounds: <strong id="rounds-val">1 / 8</strong></label>
        </div>
      </section>

      <!-- Card 3: Workout Log -->
      <section class="card log-card">
        <div class="card-header">
          <h2>SESSION LOGS</h2>
          <button id="btn-add-log" class="btn-small">+ LOG ACTIVITY</button>
        </div>
        <div id="logs-container" class="logs-list">
          <!-- Populated by JS -->
        </div>
      </section>
    </main>
  </div>

  <script src="app.js"></script>
</body>
</html>`
    },
    {
      id: 'file_cp_css',
      path: 'style.css',
      language: 'css',
      updatedAt: '2026-09-13T08:45:00.000Z',
      content: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: #090d16;
  color: #f1f5f9;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  min-height: 100vh;
}

.app-layout {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 20px;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 24px;
  border-bottom: 1px solid #1e293b;
  margin-bottom: 28px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pulse-dot {
  width: 12px;
  height: 12px;
  background: #06b6d4;
  border-radius: 50%;
  box-shadow: 0 0 12px #06b6d4;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.8; }
}

.brand h1 {
  font-size: 20px;
  letter-spacing: 2px;
  font-weight: 800;
  color: #f8fafc;
}

.badge {
  background: #1e293b;
  color: #38bdf8;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
}

.streak-tag {
  background: rgba(249, 115, 22, 0.15);
  color: #fb923c;
  border: 1px solid rgba(249, 115, 22, 0.3);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
  gap: 20px;
}

.card {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h2 {
  font-size: 14px;
  letter-spacing: 1.5px;
  font-weight: 700;
  color: #cbd5e1;
}

.subtext {
  font-size: 12px;
  color: #64748b;
}

/* SVG Progress Ring */
.rings-wrapper {
  position: relative;
  width: 170px;
  height: 170px;
  margin: 10px auto 20px;
}

.progress-ring {
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
}

.ring-bg {
  fill: none;
  stroke: #1e293b;
  stroke-width: 10;
}

.ring-fill {
  fill: none;
  stroke-width: 10;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.6s ease;
}

.ring-fill.calories {
  stroke: #06b6d4;
  filter: drop-shadow(0 0 8px rgba(6, 182, 212, 0.6));
}

.ring-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.big-num {
  font-size: 32px;
  font-weight: 800;
  color: #f8fafc;
  font-family: monospace;
}

.unit {
  font-size: 10px;
  color: #94a3b8;
  letter-spacing: 1px;
}

.metric-tags {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #1e293b;
  padding-top: 14px;
  font-size: 12px;
  color: #94a3b8;
}

.dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 4px;
}

.dot.cal { background: #06b6d4; }
.dot.min { background: #f97316; }

/* Timer */
.phase-tag {
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 4px;
  font-weight: 700;
  letter-spacing: 1px;
}

.phase-tag.work {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.phase-tag.rest {
  background: rgba(234, 179, 8, 0.15);
  color: #facc15;
  border: 1px solid rgba(234, 179, 8, 0.3);
}

.timer-display {
  font-size: 54px;
  font-weight: 800;
  font-family: monospace;
  text-align: center;
  color: #f8fafc;
  margin: 16px 0;
  text-shadow: 0 0 20px rgba(6, 182, 212, 0.3);
}

.timer-controls {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.btn-action {
  flex: 2;
  background: #0284c7;
  color: white;
  border: none;
  padding: 12px;
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;
  letter-spacing: 1px;
}

.btn-action:hover { background: #0369a1; }

.btn-outline {
  flex: 1;
  background: transparent;
  color: #94a3b8;
  border: 1px solid #334155;
  padding: 12px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
}

.btn-outline:hover { background: #1e293b; }

.timer-config {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #94a3b8;
  border-top: 1px solid #1e293b;
  padding-top: 14px;
}

/* Logs */
.btn-small {
  background: #1e293b;
  color: #38bdf8;
  border: 1px solid #334155;
  padding: 5px 10px;
  font-size: 11px;
  font-weight: 700;
  border-radius: 4px;
  cursor: pointer;
}

.logs-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  max-height: 240px;
}

.log-item {
  background: #090e18;
  border: 1px solid #1e293b;
  padding: 10px 14px;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.log-title {
  font-weight: 600;
  color: #f1f5f9;
}

.log-detail {
  font-size: 11px;
  color: #64748b;
}`
    },
    {
      id: 'file_cp_js',
      path: 'app.js',
      language: 'javascript',
      updatedAt: '2026-09-13T08:45:00.000Z',
      content: `// CyberPulse Fitness Engine
(function() {
  // Timer State
  let timerInterval = null;
  let isRunning = false;
  let phase = 'work'; // 'work' or 'rest'
  let secondsLeft = 45;
  let currentRound = 1;
  const maxRounds = 8;

  const timerVal = document.getElementById('timer-val');
  const btnStart = document.getElementById('btn-start-timer');
  const btnReset = document.getElementById('btn-reset-timer');
  const phaseBadge = document.getElementById('phase-badge');
  const roundsVal = document.getElementById('rounds-val');

  function updateTimerUI() {
    const m = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
    const s = (secondsLeft % 60).toString().padStart(2, '0');
    timerVal.textContent = \`\${m}:\${s}\`;
    roundsVal.textContent = \`\${currentRound} / \${maxRounds}\`;

    if (phase === 'work') {
      phaseBadge.textContent = 'WORK PHASE';
      phaseBadge.className = 'phase-tag work';
    } else {
      phaseBadge.textContent = 'REST PHASE';
      phaseBadge.className = 'phase-tag rest';
    }
  }

  function tick() {
    if (secondsLeft > 0) {
      secondsLeft--;
      updateTimerUI();
    } else {
      // Phase toggle
      if (phase === 'work') {
        phase = 'rest';
        secondsLeft = 15;
      } else {
        phase = 'work';
        secondsLeft = 45;
        currentRound++;
        if (currentRound > maxRounds) {
          pauseTimer();
          currentRound = 1;
          alert('HIIT Interval Workout Completed! Fantastic job.');
          return;
        }
      }
      updateTimerUI();
    }
  }

  function startTimer() {
    if (isRunning) {
      pauseTimer();
      return;
    }
    isRunning = true;
    btnStart.textContent = 'PAUSE';
    timerInterval = setInterval(tick, 1000);
  }

  function pauseTimer() {
    isRunning = false;
    btnStart.textContent = 'RESUME';
    clearInterval(timerInterval);
  }

  function resetTimer() {
    pauseTimer();
    btnStart.textContent = 'START INTERVAL';
    phase = 'work';
    secondsLeft = 45;
    currentRound = 1;
    updateTimerUI();
  }

  btnStart.addEventListener('click', startTimer);
  btnReset.addEventListener('click', resetTimer);

  // Workout Logs State
  const initialLogs = [
    { title: 'Heavy Barbell Squats', detail: '4 sets × 8 reps • 240 kcal', time: '07:45 AM' },
    { title: 'Rowing Machine Sprints', detail: '2,000m • 180 kcal', time: '08:15 AM' },
    { title: 'Core Stability Circuit', detail: '3 rounds plank / hollow rock', time: 'Yesterday' }
  ];

  const logsContainer = document.getElementById('logs-container');
  const btnAddLog = document.getElementById('btn-add-log');

  function renderLogs() {
    logsContainer.innerHTML = '';
    initialLogs.forEach(item => {
      const el = document.createElement('div');
      el.className = 'log-item';
      el.innerHTML = \`
        <div>
          <div class="log-title">\${item.title}</div>
          <div class="log-detail">\${item.detail}</div>
        </div>
        <span class="subtext">\${item.time}</span>
      \`;
      logsContainer.appendChild(el);
    });
  }

  btnAddLog.addEventListener('click', () => {
    const workouts = ['Incline Dumbbell Press', 'Kettlebell Swings', 'Deadlifts', 'Assault Bike'];
    const chosen = workouts[Math.floor(Math.random() * workouts.length)];
    initialLogs.unshift({
      title: chosen,
      detail: '3 sets × 12 reps • 110 kcal',
      time: 'Just now'
    });
    renderLogs();
  });

  renderLogs();
  updateTimerUI();
})();`
    },
    {
      id: 'file_cp_readme',
      path: 'README.md',
      language: 'markdown',
      updatedAt: '2026-09-13T08:45:00.000Z',
      content: `# CyberPulse Fitness Engine
High-contrast athletic telemetry dashboard with HIIT countdown timer and SVG data rings.
`
    }
  ]
};

export const INITIAL_SAMPLE_PROJECTS: Project[] = [
  SAMPLE_DRAGON_GAME_PROJECT,
  SAMPLE_FITNESS_PROJECT
];

