export default class Enemy {
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

        // Bounce off side walls
        if (this.x < 0 || this.x > this.game.width - this.width) {
            this.speedX *= -1;
        }

        if (this.y > this.game.height) {
            this.markedForDeletion = true;
            // Optionally punish player for missing enemies? Nah, just score
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

        // Draw Hexagon shape
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            ctx.lineTo(this.width / 2 * Math.cos(i * 2 * Math.PI / 6), this.width / 2 * Math.sin(i * 2 * Math.PI / 6));
        }
        ctx.closePath();
        ctx.stroke();

        // Inner core
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.3;
        ctx.fill();

        ctx.restore();
    }
}
