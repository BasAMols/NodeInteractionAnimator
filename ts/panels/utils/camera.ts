import { Panel } from '../../interface/panel';
import { DomElement } from '../../lib/dom/domElement';
import { Util } from '../../lib/utilities/utils';

export class Camera extends DomElement<'div'> {
    private draggable: [boolean, boolean] = [false, false];
    private _dragging: boolean = false;
    public get dragging(): boolean {
        return this._dragging;
    }
    public set dragging(value: boolean) {
        this._dragging = value;
        this.domElement.classList[value ? 'add' : 'remove']('grabbing');
    }
    private position: [number, number] = [0, 0];
    private area: [number, number] = [0, 0];

    private mover: DomElement<"div">;
    public content: DomElement<"div">;
    constructor(private parent: Panel, private contentSize: [number, number]) {
        super('div', {
            className: 'panelCamera'
        });
        this.mover = this.child('div', {
            className: 'panelCameraMover grid'
        });
        this.content = this.mover.child('div', {
            className: 'panelCameraContent',
            style: {
                width: `${this.contentSize[0]}px`,
                height: `${this.contentSize[1]}px`,
            }

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
        if (this.dragging && this.draggable.find((axis) => axis)) {
            this.move([e.movementX, e.movementY]);
        }
    }
    move(v: [number, number]) {
        this.setPosition([
            this.position[0] + v[0],
            this.position[1] + v[1],
        ]);
    }
    resize() {
        [0, 1].forEach((i) => {
            this.draggable[i] = this.parent.size[i] < (this.contentSize[i]);
            this.area[i] = this.draggable[i] ? this.contentSize[i] : this.parent.size[i];
            this.mover.setStyle(['width', 'height'][i], `${Math.max(this.area[i], this.parent.size[i])}px`);
        });
        this.domElement.classList[this.draggable.find((axis) => axis)?'add':'remove']('draggable')
        this.setPosition(this.position);
    }
    setPosition(v: [number, number]) {
        [0, 1].forEach((i) => {
            if (this.draggable[i]) {
                console.log([i], this.contentSize[i] - this.area[i]);
                
                this.position[i] = Util.clamp(v[i], this.parent.size[i] - this.contentSize[i], 0);
            } else {
                this.position[i] = (this.area[i] - this.contentSize[i]) / 2;
            }
        });

        this.mover.setStyle('transform', `translate(${this.position.join('px,')}px)`);
    }
}