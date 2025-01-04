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
    initialTolerance?: number,
    move?: (e: DragReturnType) => void,
    start?: () => void,
    end?: () => void,
}
export interface DragStorageType extends DragRegisterType {
    startOffset?: Vector2;
    elementStart?: Vector2;
    enabled: boolean;
    brokeTolerance: boolean
}
export interface ScrollReturnType {
    delta: number,
    absolute: Vector2,
    relative: Vector2,
    factor: Vector2,
    e: WheelEvent;
}
export interface ScrollRegisterType {
    element: DomElement,
    reference?: DomElement,
    scroll?: (e: ScrollReturnType) => void,
}
export interface ScrollStorageType extends ScrollRegisterType {
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
        $.state[value?'set':'unset']('dragging');
    }
    private dragListeners: Record<string, DragStorageType> = {};
    private scrollListeners: Record<string, ScrollStorageType> = {};
    private current: DragStorageType | undefined;
    public constructor() {
        super('div', { className: 'dragOverlay' });
        this.domElement.addEventListener('mousemove', (e) => {
            if (this.dragging) this.move(e);
        });
        this.domElement.addEventListener('mouseup', this.end.bind(this));
    }
    public registerDrag(key: string, reg: DragRegisterType) {
        this.dragListeners[key] = { ...reg, ...{ enabled: true, brokeTolerance: false } };
        reg.element.domElement.addEventListener('mousedown', (e: MouseEvent) => {
            if (this.dragListeners[key].enabled) {
                this.start(key, e);
            }
        });
        reg.element.class(true, `cursor_${reg.cursor ?? 'grab'}`, 'draggable');
        return key;
    }

    public registerScroll(key: string, reg: ScrollRegisterType) {
        this.scrollListeners[key] = { ...reg, ...{ enabled: true } };
        reg.element.domElement.addEventListener('wheel', (e: WheelEvent) => {
            if (this.scrollListeners[key].enabled) {
                this.scroll(key, e);
            }
        });
        reg.element.class(true, 'scrollable');
        return key;
    }

    public able(key: string, b: boolean, c?: string) {
        if (this.dragListeners[key]) {
            this.dragListeners[key].enabled = b;
            this.dragListeners[key].element.domElement.classList[b ? 'add' : 'remove']('draggable');
            if (c) {
                this.dragListeners[key].element.class(false, `cursor_${this.dragListeners[key].cursor ?? 'grab'}`);
                this.dragListeners[key].cursor = c;
                this.dragListeners[key].element.class(true, `cursor_${this.dragListeners[key].cursor ?? 'grab'}`);
            }
        }
        if (this.scrollListeners[key]) {
            this.scrollListeners[key].enabled = b;
            this.scrollListeners[key].element.domElement.classList[b ? 'add' : 'remove']('scrollable');
        }

    }
    public cursor(key: string, c: string) {
        if (!key || !this.dragListeners[key]) return;
        this.dragListeners[key].element.class(false, `cursor_${this.dragListeners[key].cursor ?? 'grab'}`);
        this.dragListeners[key].cursor = c;
        this.dragListeners[key].element.class(true, `cursor_${this.dragListeners[key].cursor ?? 'grab'}`);
    }
    public calcOffsets(key: string, e: MouseEvent) {
        if (!this.dragListeners[key]) return;
        let elementStart = v2(this.dragListeners[key].element.domElement.getBoundingClientRect());
        let mouseStart = v2(e.x, e.y);
        this.dragListeners[key].elementStart = elementStart;
        this.dragListeners[key].startOffset = elementStart.subtract(mouseStart);
    }
    private start(key: string, e: MouseEvent) {
        if (!this.dragging) {
            this.current = this.dragListeners[key];
            this.dragging = true;
            this.calcOffsets(key, e);
            this.current.start?.();
            this.current.brokeTolerance = !this.current.initialTolerance;
        }
    }
    private move(e: MouseEvent) {
        if (this.dragging && this.current.move) {
            const absolute = v2(e.clientX, e.clientY);

            if (!this.current.brokeTolerance) {
                if (this.current.elementStart.subtract(this.current.startOffset).subtract(absolute).magnitude() > this.current.initialTolerance) {
                    this.current.brokeTolerance = true;
                } else {
                    return
                }
            }

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
    private scroll(key: string, e: WheelEvent) {
        if (key && this.scrollListeners[key] && this.scrollListeners[key].enabled) {
            const target = this.scrollListeners[key];
            
            const absolute = v2(e.clientX, e.clientY);
            let relative: Vector2, factor: Vector2 = v2();
            if (target.reference) {
                const ref = target.reference.domElement.getBoundingClientRect();
                relative = absolute.subtract(v2(ref));
                factor = relative.divideComponents(v2(ref.width, ref.height));
            } else {
                relative = absolute;
            }

            target.scroll({
                relative: relative,
                absolute: absolute,
                delta: e.deltaY,
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