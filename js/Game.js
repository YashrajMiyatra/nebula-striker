import Player from './Player.js';
import InputHandler from './InputHandler.js';
import Particle from './Particle.js';
import Enemy from './Enemy.js';

export default class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;

        this.lastTime = 0;
        this.score = 0;
        this.gameOver = false;

        // Game State
        this.isPlaying = false;

        // Entities
        this.player = new Player(this);
        this.input = new InputHandler();

        this.projectiles = [];
        this.enemies = [];
        this.particles = [];

        // Enemy Timer
        this.enemyTimer = 0;
        this.enemyInterval = 1000;

        // UI Elements
        this.scoreEl = document.getElementById('score-value');
        this.finalScoreEl = document.getElementById('final-score');
        this.startScreen = document.getElementById('start-screen');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.restartBtn = document.getElementById('restart-btn');
        this.healthBar = document.getElementById('health-bar');

        this.initListeners();

        // Background Stars
        this.stars = [];
        this.initStars();
    }

    initListeners() {
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isPlaying && !this.gameOver) {
                this.startGame();
            }
        });

        this.restartBtn.addEventListener('click', () => {
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
        this.isPlaying = true;
        this.gameOver = false;
        this.score = 0;
        this.scoreEl.innerText = '0';
        this.startScreen.classList.remove('active');
        this.startScreen.classList.add('hidden');
        this.gameOverScreen.classList.add('hidden');
        this.lastTime = 0;
        this.player.reset();
        this.projectiles = [];
        this.enemies = [];
        this.particles = [];
        this.animate(0);
    }

    resetGame() {
        this.gameOver = false;
        this.score = 0;
        this.gameOverScreen.classList.add('hidden');
        this.startScreen.classList.remove('hidden');
        this.player.reset();
    }

    resize(w, h) {
        this.width = w;
        this.height = h;
    }

    renderBackground() {
        this.ctx.fillStyle = 'rgba(5, 5, 16, 0.5)'; // Slight trail
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

        // Player
        this.player.update(this.input.keys, deltaTime);

        // Projectiles
        this.projectiles.forEach((p, index) => {
            p.update();
            if (p.markedForDeletion) this.projectiles.splice(index, 1);
        });

        // Enemies
        if (this.enemyTimer > this.enemyInterval) {
            this.enemies.push(new Enemy(this));
            this.enemyTimer = 0;
            // Decrease interval slightly to make it harder over time
            if (this.enemyInterval > 400) this.enemyInterval -= 10;
        } else {
            this.enemyTimer += deltaTime;
        }

        this.enemies.forEach((enemy, index) => {
            enemy.update();
            if (enemy.markedForDeletion) {
                this.enemies.splice(index, 1);
            }

            // Collision with Player
            if (this.checkCollision(this.player, enemy)) {
                enemy.markedForDeletion = true;
                this.createExplosion(enemy.x, enemy.y, enemy.color);
                this.player.hp -= 20;
                this.updateHealth();
                if (this.player.hp <= 0) {
                    this.gameOver = true;
                }
            }

            // Collision with Projectiles
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
                    }
                }
            });
        });

        // Particles
        this.particles.forEach((p, index) => {
            p.update();
            if (p.markedForDeletion) this.particles.splice(index, 1);
        });
    }

    createExplosion(x, y, color, count = 5) {
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(this, x, y, color));
        }
    }

    updateHealth() {
        const pct = Math.max(0, (this.player.hp / this.player.maxHp) * 100);
        this.healthBar.style.width = pct + '%';
        if (pct < 30) {
            this.healthBar.style.boxShadow = '0 0 15px #ff0055';
            this.healthBar.style.background = '#ff0055';
        } else {
            this.healthBar.style.boxShadow = '0 0 15px #00ff88';
            this.healthBar.style.background = 'linear-gradient(90deg, #00f3ff, #00ff88)';
        }
    }

    draw() {
        this.renderBackground();

        if (!this.isPlaying) return;

        this.player.draw(this.ctx);

        this.projectiles.forEach(p => p.draw(this.ctx));
        this.enemies.forEach(e => e.draw(this.ctx));
        this.particles.forEach(p => p.draw(this.ctx));
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
}
