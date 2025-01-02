import { Util } from './utils';

export function v2(x?: { x: number, y: number; }): Vector2;
export function v2(x?: [number, number]): Vector2;
export function v2(x?: number, y?: number): Vector2;
export function v2(x?: number | [number, number] | { x: number, y: number; }, y?: number): Vector2 {
    if (x === undefined) return new Vector2(0, 0);
    if (typeof x === 'number') return new Vector2(x, y ?? x);
    if (Array.isArray(x)) return new Vector2(x[0], x[1]);
    if (x.x !== undefined && x.y !== undefined) return new Vector2(x.x, x.y);
    return new Vector2(0, 0);
}

export class Vector2 extends Array<number> {
    public get x() {
        return this[0];
    }
    public get y() {
        return this[1];
    }
    constructor(x: number, y: number) {
        super(x, y);
    }

    //Methods
    public add(v: Vector2): Vector2 {
        return new Vector2(this[0] + v[0], this[1] + v[1]);
    }
    public subtract(v: Vector2): Vector2 {
        return new Vector2(this[0] - v[0], this[1] - v[1]);
    }
    public scale(n: number): Vector2 {
        return new Vector2(this[0] * n, this[1] * n);
    }
    public clampComponents(min:number = 0, max:number = 1) {
        return new Vector2(
            Util.clamp(this[0], min, max), 
            Util.clamp(this[1], min, max), 
        )
    }
    public divideComponents(v: Vector2): Vector2 {
        if (v.every((n)=>n!==0)){
            return new Vector2(this[0] / v[0], this[1] / v[1]);
        }
        return new Vector2(0,0)
    }
    public c() {
        return new Vector2(this[0], this[1])
    }
}