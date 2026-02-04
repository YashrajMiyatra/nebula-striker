/* BUNDLED GAME SCRIPT FOR LOCAL EXECUTION */

/* --- SoundController.js --- */
class SoundController {
    constructor() {
        this.ctx = null;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
        this.initialized = true;
    }

    playTone(freq, type, duration) {
        if (!this.initialized) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        osc.stop(this.ctx.currentTime + duration);
    }

    shoot() {
        if (!this.initialized) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.15);

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    }

    explosion() {
        if (!this.initialized) return;
        const bufferSize = this.ctx.sampleRate * 0.5; // 0.5 sec
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);

        noise.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start();
    }

    powerUp() {
        if (!this.initialized) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(1200, this.ctx.currentTime + 0.3);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
    }

    gameOver() {
        if (!this.initialized) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 1.5);

        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 1.5);
    }
}

/* --- InputHandler.js --- */
class InputHandler {
    constructor() {
        this.keys = [];
        window.addEventListener('keydown', e => {
            if ((e.code === 'ArrowDown' ||
                e.code === 'ArrowUp' ||
                e.code === 'ArrowLeft' ||
                e.code === 'ArrowRight' ||
                e.code === 'KeyW' ||
                e.code === 'KeyA' ||
                e.code === 'KeyS' ||
                e.code === 'KeyD' ||
                e.code === 'Space'
            ) && this.keys.indexOf(e.code) === -1) {
                this.keys.push(e.code);
            }
        });
        window.addEventListener('keyup', e => {
            if (e.code === 'ArrowDown' ||
                e.code === 'ArrowUp' ||
                e.code === 'ArrowLeft' ||
                e.code === 'ArrowRight' ||
                e.code === 'KeyW' ||
                e.code === 'KeyA' ||
                e.code === 'KeyS' ||
                e.code === 'KeyD' ||
                e.code === 'Space') {
                this.keys.splice(this.keys.indexOf(e.code), 1);
            }
        });
    }
}

/* --- Particle.js --- */
class Particle {
    constructor(game, x, y, color) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 5 + 2;
        this.speedX = Math.random() * 6 - 3;
        this.speedY = Math.random() * 6 - 3;
        this.markedForDeletion = false;
        this.lifeTimer = 0;
        this.maxLife = 50;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.size *= 0.95;
        this.lifeTimer++;
        if (this.lifeTimer > this.maxLife || this.size < 0.2) {
            this.markedForDeletion = true;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = 1 - (this.lifeTimer / this.maxLife);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

/* --- FloatingText.js --- */
class FloatingText {
    constructor(game, value, x, y, size, color) {
        this.game = game;
        this.value = value;
        this.x = x;
        this.y = y;
        this.size = size;
        this.lifeTimer = 0;
        this.maxLife = 100;
        this.color = color;
        this.markedForDeletion = false;
    }
    update() {
        this.y -= 1; // Float up
        this.lifeTimer++;
        if (this.lifeTimer > this.maxLife) this.markedForDeletion = true;
    }
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = 1 - (this.lifeTimer / this.maxLife);
        ctx.font = `bold ${this.size}px Orbitron`; // Use game font
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fillText(this.value, this.x, this.y);
        ctx.restore();
    }
}

/* --- PowerUp.js --- */
class PowerUp {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.markedForDeletion = false;
        this.speedY = 2; // Float down slowly

        // Types: 0=Rapid, 1=Spread, 2=Wingman, 3=Health
        const rand = Math.random();
        if (rand < 0.3) {
            this.type = 'RAPID';
            this.color = '#ffff00'; // Yellow
        } else if (rand < 0.6) {
            this.type = 'SPREAD';
            this.color = '#aa00ff'; // Purple
        } else if (rand < 0.8) {
            this.type = 'WINGMAN';
            this.color = '#00f3ff'; // Cyan
        } else {
            this.type = 'HEALTH';
            this.color = '#00ff88'; // Green
        }
    }

    update() {
        this.y += this.speedY;
        if (this.y > this.game.height) this.markedForDeletion = true;
    }

    draw(ctx) {
        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 15, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.5;
        ctx.fill();

        // Icon/Text inside
        ctx.fillStyle = '#fff';
        ctx.globalAlpha = 1;
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        let label = '';
        if (this.type === 'RAPID') label = 'R';
        if (this.type === 'SPREAD') label = 'S';
        if (this.type === 'WINGMAN') label = 'W';
        if (this.type === 'HEALTH') label = '+';
        ctx.fillText(label, this.x + this.width / 2, this.y + this.height / 2);

        ctx.restore();
    }
}

/* --- Projectile.js --- */
class Projectile {
    constructor(game, x, y, angle = 0) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 4;
        this.height = 15;
        this.speed = 15;
        this.markedForDeletion = false;
        this.color = '#ffff00';
        this.angle = angle;
    }

    update() {
        this.y -= this.speed * Math.cos(this.angle);
        this.x += this.speed * Math.sin(this.angle); // Handle angles
        if (this.y < 0 || this.x < 0 || this.x > this.game.width) this.markedForDeletion = true;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.fillStyle = '#ccff00';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ccff00';
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.fill();
        ctx.restore();
    }
}

/* --- Enemy.js --- */
class Enemy {
    constructor(game) {
        this.game = game;
        this.width = 40;
        this.height = 40;
        this.x = Math.random() * (this.game.width - this.width);
        this.y = -this.height;
        this.speedY = Math.random() * 2 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.markedForDeletion = false;
        this.lives = 2;
        this.score = 10;
        this.color = Math.random() > 0.5 ? '#ff0055' : '#ff9900';
        this.angle = 0;
        this.spinSpeed = Math.random() * 0.1 - 0.05;
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.angle += this.spinSpeed;

        if (this.x < 0 || this.x > this.game.width - this.width) {
            this.speedX *= -1;
        }

        if (this.y > this.game.height) {
            this.markedForDeletion = true;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle);

        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;

        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            ctx.lineTo(this.width / 2 * Math.cos(i * 2 * Math.PI / 6), this.width / 2 * Math.sin(i * 2 * Math.PI / 6));
        }
        ctx.closePath();
        ctx.stroke();

        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.3;
        ctx.fill();

        ctx.restore();
    }
}

/* --- Player.js --- */
class Player {
    constructor(game) {
        this.game = game;
        this.width = 60;
        this.height = 60;
        this.x = this.game.width * 0.5 - this.width * 0.5;
        this.y = this.game.height - 100;
        this.speedOfMovement = 8;
        this.color = '#00f3ff';

        // Shooting Stats
        this.shootTimer = 0;
        this.shootInterval = 200;
        this.weaponType = 'NORMAL'; // NORMAL, RAPID, SPREAD
        this.hasWingman = false;

        this.hp = 100;
        this.maxHp = 100;
    }

    reset() {
        this.x = this.game.width * 0.5 - this.width * 0.5;
        this.y = this.game.height - 100;
        this.hp = 100;
        this.weaponType = 'NORMAL';
        this.shootInterval = 200;
        this.hasWingman = false;
        this.game.healthBar.style.width = '100%';
        this.updateHealthVisuals();
    }

    updateHealthVisuals() {
        const pct = Math.max(0, (this.hp / this.maxHp) * 100);
        this.game.healthBar.style.width = pct + '%';
        if (pct < 30) {
            this.game.healthBar.style.boxShadow = '0 0 15px #ff0055';
            this.game.healthBar.style.background = '#ff0055';
        } else {
            this.game.healthBar.style.boxShadow = '0 0 15px #00ff88';
            this.game.healthBar.style.background = 'linear-gradient(90deg, #00f3ff, #00ff88)';
        }
    }

    activatePowerUp(type) {
        this.game.sounds.powerUp(); // Sound Trigger
        if (type === 'HEALTH') {
            this.hp = Math.min(this.hp + 30, this.maxHp);
            this.updateHealthVisuals();
            this.game.addFloatingText('+30 HP', this.x, this.y, 20, '#00ff88');
        } else if (type === 'RAPID') {
            this.weaponType = 'RAPID';
            this.shootInterval = 80; // Super fast
            this.game.addFloatingText('RAPID FIRE!', this.x, this.y, 20, '#ffff00');
        } else if (type === 'SPREAD') {
            this.weaponType = 'SPREAD';
            this.shootInterval = 250;
            this.game.addFloatingText('SPREAD SHOT!', this.x, this.y, 20, '#aa00ff');
        } else if (type === 'WINGMAN') {
            this.hasWingman = true;
            this.game.addFloatingText('WINGMAN EQUIPPED!', this.x, this.y, 20, '#00f3ff');
        }
    }

    update(inputCmds, deltaTime) {
        if (inputCmds.includes('KeyA') || inputCmds.includes('ArrowLeft')) this.x -= this.speedOfMovement;
        if (inputCmds.includes('KeyD') || inputCmds.includes('ArrowRight')) this.x += this.speedOfMovement;
        if (inputCmds.includes('KeyW') || inputCmds.includes('ArrowUp')) this.y -= this.speedOfMovement;
        if (inputCmds.includes('KeyS') || inputCmds.includes('ArrowDown')) this.y += this.speedOfMovement;

        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;
        if (this.y < 0) this.y = 0;
        if (this.y > this.game.height - this.height) this.y = this.game.height - this.height;

        if (inputCmds.includes('Space')) {
            if (this.shootTimer > this.shootInterval) {
                this.shoot();
                this.shootTimer = 0;
            }
        }
        this.shootTimer += deltaTime;
    }

    shoot() {
        this.game.sounds.shoot(); // Sound Trigger

        // Main Logic
        if (this.weaponType === 'SPREAD') {
            this.game.projectiles.push(new Projectile(this.game, this.x + this.width / 2, this.y, 0));
            this.game.projectiles.push(new Projectile(this.game, this.x + this.width / 2, this.y, 0.2)); // Right angle
            this.game.projectiles.push(new Projectile(this.game, this.x + this.width / 2, this.y, -0.2)); // Left angle
        } else {
            // Normal or Rapid (Just straight)
            this.game.projectiles.push(new Projectile(this.game, this.x + 5, this.y));
            this.game.projectiles.push(new Projectile(this.game, this.x + this.width - 5, this.y));
        }

        // Wingman Logic
        if (this.hasWingman) {
            this.game.projectiles.push(new Projectile(this.game, this.x - 20, this.y + 20));
            this.game.projectiles.push(new Projectile(this.game, this.x + this.width + 20, this.y + 20));
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;

        // Ship
        ctx.beginPath();
        ctx.moveTo(0, -this.height / 2);
        ctx.lineTo(this.width / 2, this.height / 2);
        ctx.lineTo(0, this.height / 2 - 15);
        ctx.lineTo(-this.width / 2, this.height / 2);
        ctx.closePath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = 'rgba(0, 243, 255, 0.1)';
        ctx.fill();

        // Wingman Graphics
        if (this.hasWingman) {
            ctx.fillStyle = '#00f3ff';
            ctx.beginPath(); ctx.arc(-40, 0, 5, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(40, 0, 5, 0, Math.PI * 2); ctx.fill();
        }

        ctx.restore();
    }
}

/* --- Game.js --- */
class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;

        this.lastTime = 0;
        this.score = 0;
        this.gameOver = false;
        this.isPlaying = false;

        this.player = new Player(this);
        this.input = new InputHandler();
        this.sounds = new SoundController();

        this.projectiles = [];
        this.enemies = [];
        this.particles = [];
        this.powerUps = [];
        this.floatingTexts = [];

        this.enemyTimer = 0;
        this.enemyInterval = 1000;

        this.scoreEl = document.getElementById('score-value');
        this.finalScoreEl = document.getElementById('final-score');
        this.startScreen = document.getElementById('start-screen');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.restartBtn = document.getElementById('restart-btn');
        this.healthBar = document.getElementById('health-bar');

        this.initListeners();

        this.stars = [];
        this.initStars();
    }

    initListeners() {
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isPlaying && !this.gameOver) {
                this.startGame();
            }
        });

        this.restartBtn.addEventListener('click', (e) => {
            // Stop propagation to prevent any weird overlapping clicks
            e.stopPropagation();
            this.resetGame();
            this.startGame();
        });
    }

    initStars() {
        this.stars = [];
        for (let i = 0; i < 150; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 2,
                speed: Math.random() * 0.5 + 0.1
            });
        }
    }

    startGame() {
        this.sounds.init(); // Initialize Audio Context on user input

        this.isPlaying = true;
        this.gameOver = false;
        this.score = 0;
        this.scoreEl.innerText = '0';
        this.startScreen.classList.remove('active');
        this.startScreen.classList.add('hidden');
        this.gameOverScreen.classList.remove('active');
        this.gameOverScreen.classList.add('hidden');
        this.lastTime = 0;

        // Reset everything again just to be safe
        this.enemies = [];
        this.projectiles = [];
        this.particles = [];
        this.powerUps = [];
        this.floatingTexts = [];
        this.player.reset();

        this.animate(0);
    }

    resetGame() {
        this.gameOver = false;
        this.score = 0;
        this.gameOverScreen.classList.add('hidden');
        this.gameOverScreen.classList.remove('active');
        this.player.reset();
        this.enemies = [];
        this.powerUps = [];
        this.projectiles = [];
        this.particles = [];
        this.floatingTexts = [];
        this.enemyInterval = 1000;
    }

    addFloatingText(value, x, y, size, color) {
        this.floatingTexts.push(new FloatingText(this, value, x, y, size, color));
    }

    renderBackground() {
        this.ctx.fillStyle = 'rgba(5, 5, 16, 0.5)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.fillStyle = '#ffffff';
        this.stars.forEach(star => {
            this.ctx.fillRect(star.x, star.y, star.size, star.size);
            star.y += star.speed;
            if (star.y > this.height) {
                star.y = 0;
                star.x = Math.random() * this.width;
            }
        });
    }

    checkCollision(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.height + rect1.y > rect2.y
        );
    }

    update(deltaTime) {
        if (!this.isPlaying) return;

        this.player.update(this.input.keys, deltaTime);

        this.projectiles.forEach((p, index) => {
            p.update();
            if (p.markedForDeletion) this.projectiles.splice(index, 1);
        });

        // Enemy Spawning
        if (this.enemyTimer > this.enemyInterval) {
            this.enemies.push(new Enemy(this));
            this.enemyTimer = 0;
            if (this.enemyInterval > 400) this.enemyInterval -= 10;
        } else {
            this.enemyTimer += deltaTime;
        }

        this.enemies.forEach((enemy, index) => {
            enemy.update();
            if (enemy.markedForDeletion) {
                this.enemies.splice(index, 1);
            }

            // Collision Player vs Enemy
            if (this.checkCollision(this.player, enemy)) {
                enemy.markedForDeletion = true;
                this.createExplosion(enemy.x, enemy.y, enemy.color);
                this.player.hp -= 20;
                this.player.updateHealthVisuals();
                if (this.player.hp <= 0) {
                    this.gameOver = true;
                    this.sounds.gameOver(); // Sound Trigger
                }
            }

            // Collision Projectile vs Enemy
            this.projectiles.forEach((projectile, pIndex) => {
                if (this.checkCollision(enemy, projectile)) {
                    enemy.lives--;
                    projectile.markedForDeletion = true;
                    this.createExplosion(projectile.x, projectile.y, '#ffff00');

                    if (enemy.lives <= 0) {
                        enemy.markedForDeletion = true;
                        this.createExplosion(enemy.x, enemy.y, enemy.color, 10);
                        this.score += enemy.score;
                        this.scoreEl.innerText = this.score;
                        this.sounds.explosion(); // Sound Trigger for Kill

                        // DROP POWERUP? 50% Chance (High Drop Rate)
                        if (Math.random() < 0.5) {
                            this.powerUps.push(new PowerUp(this, enemy.x, enemy.y));
                        }
                    }
                }
            });
        });

        // PowerUps Update & Collision
        this.powerUps.forEach((p, index) => {
            p.update();
            if (this.checkCollision(this.player, p)) {
                this.player.activatePowerUp(p.type);
                p.markedForDeletion = true;
            }
            if (p.markedForDeletion) this.powerUps.splice(index, 1);
        });

        // Particles & Text
        this.particles.forEach((p, index) => {
            p.update();
            if (p.markedForDeletion) this.particles.splice(index, 1);
        });
        this.floatingTexts.forEach((t, i) => {
            t.update();
            if (t.markedForDeletion) this.floatingTexts.splice(i, 1);
        });
    }

    createExplosion(x, y, color, count = 5) {
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(this, x, y, color));
        }
    }

    draw() {
        this.renderBackground();

        if (!this.isPlaying) return;

        this.player.draw(this.ctx);

        this.powerUps.forEach(p => p.draw(this.ctx));
        this.projectiles.forEach(p => p.draw(this.ctx));
        this.enemies.forEach(e => e.draw(this.ctx));
        this.particles.forEach(p => p.draw(this.ctx));
        this.floatingTexts.forEach(t => t.draw(this.ctx));
    }

    animate(timeStamp) {
        const deltaTime = timeStamp - this.lastTime;
        this.lastTime = timeStamp;

        if (this.isPlaying && !this.gameOver) {
            this.update(deltaTime);
        }

        this.draw();

        if (!this.gameOver) {
            requestAnimationFrame(this.animate.bind(this));
        } else {
            this.gameOverScreen.classList.remove('hidden');
            this.gameOverScreen.classList.add('active');
            this.finalScoreEl.innerText = this.score;
        }
    }

    start() {
        this.animate(0);
    }

    resize(w, h) {
        this.width = w;
        this.height = h;
    }
}

/* --- Initialization --- */
window.addEventListener('load', () => {
    const canvas = document.getElementById('gameCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const game = new Game(canvas);
    game.start();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        game.resize(canvas.width, canvas.height);
    });
});
