export default class Projectile {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 4;
        this.height = 15;
        this.speed = 15;
        this.markedForDeletion = false;
        this.color = '#ffff00'; // Initial color
    }

    update() {
        this.y -= this.speed;
        if (this.y < 0) this.markedForDeletion = true;
    }

    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        // Glowing laser look
        ctx.fillStyle = '#ccff00';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ccff00';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fill();
        ctx.restore();
    }
}
