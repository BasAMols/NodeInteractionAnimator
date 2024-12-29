import { Vector2, v2 } from '../math/vector2';


export abstract class InputReader<T extends number | Vector2> {
    tick(): void {
        //void
    }
    abstract get value(): T;
}

// export class TouchReader<T extends number|Vector2> extends InputReader<T>{
//     get value(): T {
//         throw new Error('Method not implemented.');
//     }

// }

// export class ControllerReader<T extends number|Vector2> extends InputReader<T>{
//     get value(): T {
//         throw new Error('Method not implemented.');
//     }

// }

export abstract class Input<T extends number | Vector2> {
    constructor(protected readers: InputReader<T>[]) {

    }
    protected abstract _value: T;
    abstract get value(): T;
    public tick() {
        this.readers.forEach((r) => {
            r.tick();
        });
    }
}

export class JoyStick extends Input<Vector2> {
    protected _value: Vector2;
    get value(): Vector2 {
        let total = v2(0);
        this.readers.forEach((r) => {
            total = total.add(r.value);
        });
        return total;
    }
}
export class Button extends Input<number> {
    protected _value: number;
    get value(): number {
        let total = 0;
        this.readers.forEach((r) => {
            total += r.value;
        });
        return total;
    }
}

export class InputMap {
    joysticks: Record<string, JoyStick> = {};
    buttons: Record<string, Button> = {};
    constructor(
        joysticks: Record<string, InputReader<Vector2>[]> = {},
        buttons: Record<string, InputReader<number>[]> = {}
    ) {
        Object.entries(joysticks).forEach(([key, readers]) => {
            this.joysticks[key] = new JoyStick(readers);
        });
        Object.entries(buttons).forEach(([key, readers]) => {
            this.buttons[key] = new Button(readers);
        });
    }

    public tick() {
        Object.values(this.joysticks).forEach((j) => {
            j.tick();
        });
        Object.values(this.buttons).forEach((j) => {
            j.tick();
        });
    }

    public axis(key: string) {
        return this.joysticks[key].value;
    }

    public button(key: string) {
        return this.buttons[key].value;
    }
}