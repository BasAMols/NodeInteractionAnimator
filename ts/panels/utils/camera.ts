import { Panel } from '../../interface/panel';
import { DomElement } from '../../lib/dom/domElement';
import { Util } from '../../lib/utilities/utils';
import { v2, Vector2 } from '../../lib/utilities/vector2';

export class Camera extends DomElement<'div'> {
    private _dragging: boolean = false;
    public get dragging(): boolean {
        return this._dragging;
    }
    public set dragging(value: boolean) {
        this._dragging = value;
        this.domElement.classList[value ? 'add' : 'remove']('grabbing');
    }
    private position: Vector2 = v2();
    private scale: number = 1;

    private mover: DomElement<"div">;
    public content: DomElement<"div">;
    constructor(private parent: Panel, private contentSize?: Vector2, private clamp: boolean = true) {
        super('div', {
            className: 'panelCamera draggable'
        });
        this.mover = this.child('div', {
            className: 'panelCameraMover grid'
        });
        this.content = this.child('div', {
            className: 'panelCameraContent',
            style: {
                width: `${this.contentSize[0]}px`,
                height: `${this.contentSize[1]}px`,
            }

        });
        this.domElement.addEventListener('wheel', (e) => {
            this.scale = Util.clamp(this.scale + this.scale * (e.deltaY / 100) * -0.1, 0.1, 5);
            this.resize();
        });
        this.domElement.addEventListener('mouseleave', () => {
            this.dragging = false;
        });
        this.domElement.addEventListener('mousedown', () => {
            this.dragging = true;
        });
        this.domElement.addEventListener('mouseup', () => {
            this.dragging = false;
        });
        this.domElement.addEventListener('mousemove', this.mouseMove.bind(this));
    }
    mouseMove(e: MouseEvent) {
        if (this.dragging) {
            this.move(v2(e.movementX, e.movementY));
        }
    }
    move(v: Vector2) {
        this.setPosition(v2(this.position[0] + (v[0]), this.position[1] + (v[1])));
    }
    resize() {
        [0, 1].forEach((i) => {
            this.mover.setStyle(['width', 'height'][i], `${((this.parent.size[i] + (80 * this.scale)) * (1 / this.scale))}px`);
        });
        this.setPosition(this.position);
    }
    setPosition(v: Vector2) {
        [0, 1].forEach((i) => {
            this.position[i] = v[i];
        });
        this.mover.setStyle('transform', `translate(${this.position.map((p) => {
            return (p % (40*this.scale) - (40*this.scale));
        }).join('px,')}px) scale(${this.scale})`);
        this.content.setStyle('transform', `translate(${this.position.map((p) => {
            return p;
        }).join('px,')}px) scale(${this.scale})`);

    }
}