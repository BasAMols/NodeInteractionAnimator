import { glob } from '../../game';
import { Vector2, v2 } from '../math/vector2';
import { InputReader } from './input';

export class KeyboardReader extends InputReader<number> {
    key: string;
    constructor(key: string) {
        super();
        glob.device.keyboard.register(
            key,
            () => { this._state = true; },
            () => { this._state = false; }
        );
    }
    private _state: boolean = false;
    get value(): number {
        return Number(this._state);
    }
}

export class KeyboardJoyStickReader extends InputReader<Vector2> {
    constructor(keys: [string, string, string, string]) {
        super();
        keys.forEach((k, i) => {
            glob.device.keyboard.register(
                k,
                () => { this._state[Math.floor(i / 2)][i % 2] = true; this.setVector(); },
                () => { this._state[Math.floor(i / 2)][i % 2] = false; this.setVector(); }
            );
        });
    }

    private setVector() {
        this._vector = v2(
            -this._state[0][0] + +this._state[0][1],
            -this._state[1][0] + +this._state[1][1]
        );
    }

    private _state: [[boolean, boolean], [boolean, boolean]] = [[false, false], [false, false]];
    private _vector: Vector2 = v2(0);
    get value(): Vector2 {
        return this._vector;
    }
}
