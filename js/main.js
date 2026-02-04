import Game from './Game.js';

window.addEventListener('load', () => {
    const canvas = document.getElementById('gameCanvas');
    // Set canvas to full window size immediately
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const game = new Game(canvas);
    game.start();

    // Handle Resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        game.resize(canvas.width, canvas.height);
    });
});
