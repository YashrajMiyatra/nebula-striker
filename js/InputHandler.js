export default class InputHandler {
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
