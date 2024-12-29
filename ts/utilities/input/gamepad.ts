export class Pad {
    recentPad: Gamepad;
    constructor(public gamepad:Gamepad) {
        
    }

    tick() {
        this.recentPad = navigator.getGamepads().find((g)=>g.id === this.gamepad.id);
        // console.log(this.recentPad.buttons[7]);
        
    }
}