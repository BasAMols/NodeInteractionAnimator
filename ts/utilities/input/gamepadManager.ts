import { Pad } from './gamepad';

export class PadManager {
    private pads: Record<string, Pad> = {};
    constructor() {
        window.addEventListener("gamepadconnected", this.connect.bind(this));
        window.addEventListener("gamepaddisconnected", this.disconnect.bind(this));
    }
    connect(e: GamepadEvent) {
        this.pads[e.gamepad.id] = new Pad(e.gamepad);
    }
    disconnect(e: GamepadEvent) {
        delete this.pads[e.gamepad.id];
    }
    tick() {
        // console.log(this.pads);
        
        Object.values(this.pads).forEach((pad)=>{
            pad.tick();
        });
    }
}