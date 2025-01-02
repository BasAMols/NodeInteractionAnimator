import { DomElement } from '../../lib/dom/domElement';
import { v2, Vector2 } from '../../lib/utilities/vector2';

export interface DragReturnType {
    delta: Vector2,
    absolute: Vector2,
    relative: Vector2,
    offset: Vector2,
    total: Vector2,
    factor: Vector2,
    e: MouseEvent;
}
export interface DragRegisterType {
    element: DomElement,
    reference?: DomElement,
    cursor?: string,
    move?: (e: DragReturnType) => void,
    start?: () => void,
    end?: () => void,
}
export interface DragStorageType extends DragRegisterType {
    startOffset?: Vector2;
    elementStart?: Vector2;
    enabled: boolean;
}

export class DragManager extends DomElement<'div'> {
    private _dragging: boolean = false;
    public get dragging(): boolean {
        return this._dragging;
    }
    public set dragging(value: boolean) {
        this._dragging = value;
        this.domElement.classList[value ? 'add' : 'remove']('dragging');
    }
    private listeners: Record<string, DragStorageType> = {};
    private current: DragStorageType | undefined;
    public constructor() {
        super('div', { className: 'dragOverlay' });
        this.domElement.addEventListener('mousemove', (e) => {
            if (this.dragging) this.move(e);
        });
        this.domElement.addEventListener('mouseup', this.end.bind(this));
        // this.domElement.addEventListener('mouseout', this.end.bind(this));
    }
    public register(key: string, reg: DragRegisterType) {
        this.listeners[key] = { ...reg, ...{ enabled: true } };
        reg.element.domElement.addEventListener('mousedown', (e: MouseEvent) => {
            if (this.listeners[key].enabled) {
                this.start(key, e);
            }
        });
        reg.element.class(true, `cursor_${reg.cursor ?? 'grab'}`, 'draggable');
        return key;
    }
    public able(key: string, b: boolean, c?: string) {
        if (!this.listeners[key]) return;
        this.listeners[key].enabled = b;
        this.listeners[key].element.domElement.classList[b ? 'add' : 'remove']('draggable');
        if (c) {
            this.listeners[key].element.class(false, `cursor_${this.listeners[key].cursor ?? 'grab'}`);
            this.listeners[key].cursor = c;
            this.listeners[key].element.class(true, `cursor_${this.listeners[key].cursor ?? 'grab'}`);
        }
    }
    public cursor(key: string, c: string) {
        if (!key || !this.listeners[key]) return;
        this.listeners[key].element.class(false, `cursor_${this.listeners[key].cursor ?? 'grab'}`);
        this.listeners[key].cursor = c;
        this.listeners[key].element.class(true, `cursor_${this.listeners[key].cursor ?? 'grab'}`);
    }
    public calcOffsets(key: string, e: MouseEvent) {
        if (!this.listeners[key]) return;
        let elementStart = v2(this.listeners[key].element.domElement.getBoundingClientRect());
        let mouseStart = v2(e.x, e.y);
        this.listeners[key].elementStart = elementStart;
        this.listeners[key].startOffset = elementStart.subtract(mouseStart);
    }
    private start(key: string, e: MouseEvent) {
        if (!this.dragging) {
            this.current = this.listeners[key];
            this.dragging = true;
            this.calcOffsets(key, e);
            this.current.start?.();
        }
    }
    private move(e: MouseEvent) {
        if (this.dragging && this.current.move) {
            const absolute = v2(e.clientX, e.clientY);
            let relative: Vector2, factor: Vector2 = v2();
            if (this.current.reference) {
                const ref = this.current.reference.domElement.getBoundingClientRect();
                relative = absolute.subtract(v2(ref));
                factor = relative.divideComponents(v2(ref.width, ref.height));
            } else {
                relative = absolute;
            }

            this.current.move({
                relative: relative,
                absolute: absolute,
                offset: this.current.startOffset,
                delta: v2(e.movementX, e.movementY),
                total: absolute.add(this.current.startOffset).subtract(this.current.elementStart),
                factor: factor,
                e,
            });
        }
    }
    private end() {
        if (this.dragging) {
            this.current.end?.();
            this.current = undefined;
            this.dragging = false;
        }
    }
}