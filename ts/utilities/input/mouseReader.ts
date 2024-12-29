import { glob } from '../../game';
import { Vector2, v2 } from '../math/vector2';
import { InputReader } from './input';


export class MouseMoveReader extends InputReader<Vector2> {
    constructor() {
        super();
        if (!glob.mobile) {
            glob.renderer.dom.addEventListener('mousemove', (e) => {
                this._delta.x += e.movementX;
                this._delta.y += e.movementY;
            });
        }
    }
    private _delta: Vector2 = v2(0);
    get value(): Vector2 {
        return this._delta;
    }
    public tick(): void {
        this._delta = v2(0);
    }
}

export class MouseScrollReader extends InputReader<number> {
    constructor() {
        super();
        if (!glob.mobile) {
            glob.renderer.dom.addEventListener('wheel', (e) => {
                this._delta += e.deltaY;
            });
        }
    }
    private _delta: number = 0;
    get value(): number {
        return this._delta;
    }
    tick(): void {
        this._delta = 0;
    }
}
