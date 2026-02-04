import Projectile from './Projectile.js';

export default class Player {
    constructor(game) {
        this.game = game;
        this.width = 60;
        this.height = 60;
        this.x = this.game.width * 0.5 - this.width * 0.5;
        this.y = this.game.height - 100;
        this.speedOfMovement = 8;
        this.color = '#00f3ff'; // Neon Cyan

        // Shooting
        this.shootTimer = 0;
        this.shootInterval = 150; // ms between shots

        this.hp = 100;
        this.maxHp = 100;
    }

    reset() {
        this.x = this.game.width * 0.5 - this.width * 0.5;
        this.y = this.game.height - 100;
        this.hp = 100;
        this.game.healthBar.style.width = '100%';
    }

    update(inputCmds, deltaTime) {
        // Movement
        if (inputCmds.includes('KeyA') || inputCmds.includes('ArrowLeft')) {
            this.x -= this.speedOfMovement;
        }
        if (inputCmds.includes('KeyD') || inputCmds.includes('ArrowRight')) {
            this.x += this.speedOfMovement;
        }
        if (inputCmds.includes('KeyW') || inputCmds.includes('ArrowUp')) {
            this.y -= this.speedOfMovement;
        }
        if (inputCmds.includes('KeyS') || inputCmds.includes('ArrowDown')) {
            this.y += this.speedOfMovement;
        }

        // Boundaries
        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;
        if (this.y < 0) this.y = 0;
        if (this.y > this.game.height - this.height) this.y = this.game.height - this.height;

        // Shooting
        if (inputCmds.includes('Space')) {
            if (this.shootTimer > this.shootInterval) {
                this.shoot();
                this.shootTimer = 0;
            }
        }
        this.shootTimer += deltaTime;
    }

    shoot() {
        // Create 2 projectiles (dual guns)
        this.game.projectiles.push(new Projectile(this.game, this.x + 5, this.y));
        this.game.projectiles.push(new Projectile(this.game, this.x + this.width - 5, this.y));
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

        // Glow Effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;

        // Draw Ship Body (Triangle-ish)
        ctx.beginPath();
        ctx.moveTo(0, -this.height / 2); // Nose
        ctx.lineTo(this.width / 2, this.height / 2); // Right wing
        ctx.lineTo(0, this.height / 2 - 15); // Engine
        ctx.lineTo(-this.width / 2, this.height / 2); // Left wing
        ctx.closePath();

        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Fill opacity
        ctx.fillStyle = 'rgba(0, 243, 255, 0.1)';
        ctx.fill();

        // Engine Flame
        ctx.beginPath();
        ctx.moveTo(-10, this.height / 2 - 10);
        ctx.lineTo(0, this.height / 2 + Math.random() * 20 + 10);
        ctx.lineTo(10, this.height / 2 - 10);
        ctx.closePath();
        ctx.fillStyle = '#ff0055';
        ctx.shadowColor = '#ff0055';
        ctx.fill();

        ctx.restore();
    }
}
