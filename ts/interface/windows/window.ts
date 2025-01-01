import { DomElement } from '../../lib/dom/domElement';
import { Icon } from '../../lib/dom/icon';
import { Util } from '../../lib/utilities/utils';
import { Menu } from '../menu';

export class WindowPanel extends DomElement<'div'> {
    private _fullscreen: boolean = false;
    public get fullscreen(): boolean {
        return this._fullscreen;
    }
    public set fullscreen(value: boolean) {
        if (this._fullscreen === value) return;
        this._fullscreen = value;
        this.domElement.classList[this._fullscreen ? 'add' : 'remove']('fullscreen');
        if (this._fullscreen) {
            this.preFullscreenSize = [...this.size];
            this.setSize();
            this.setPosition([0, 0]);
        } else {
            this.setSize(this.preFullscreenSize);
            this.setPosition([10, 10]);
        }

    }
    private _dragging: boolean = false;
    public get dragging(): boolean {
        return this._dragging;
    }
    public set dragging(value: boolean) {
        this._dragging = value;
        this.domElement.classList[value ? 'add' : 'remove']('grabbing');
    }

    protected content: DomElement<"div">;
    protected header: DomElement<"div">;
    public preFullscreenSize: [number, number] = [0, 0];
    public size: [number, number] = [0, 0];
    public position: [number, number] = [10, 10];
    private _open: boolean = false;
    public get open(): boolean {
        return this._open;
    }
    public set open(value: boolean) {
        this._open = value;
        this.visible = value;
    }
    private _order: number = 0;
    public get order(): number {
        return this._order;
    }
    public set order(value: number) {
        this._order = value;
        this.setStyle('order', String(value));
    }

    constructor(public readonly id: string, public readonly name: string) {
        super('div', {
            className: `window`,
            id
        });
        this.header = this.child('div', {
            className: 'windowHeader'
        });
        this.header.append(new Icon({ name: 'drag_indicator', classList: 'drag' }));
        this.header.child('span', {
            text: name,
            className: 'title'
        });
        this.header.append(new Menu([
            {
                key: 'max',
                name: '',
                type: 'Action',
                design: 'inline',
                icon: Icon.make('filter_none'),
                onClick: () => {
                    this.fullscreen = !this.fullscreen;
                }
            },
            {
                key: 'close',
                name: '',
                type: 'Action',
                design: 'inline',
                icon: Icon.make('close'),
                onClick: () => {
                    this.open = false;
                }
            }
        ]));
        this.content = this.child('div', {
            className: 'windowContent'
        });
        this.domElement.addEventListener('click', () => {
            this.focus();
        });
        this.header.domElement.addEventListener('mousedown', () => {
            this.dragging = true;
        });
        this.domElement.addEventListener('mouseup', () => {
            this.dragging = false;
        });
        this.domElement.addEventListener('mousemove', (e: MouseEvent) => {
            if (this.dragging) {
                this.move([e.movementX, e.movementY]);
            }
        });

    }
    public focus() {
        this.order = -1;
        $.windows.reorder();
    }

    public resize() {
        if (this.fullscreen) {
            this.setSize($.windowSize);
            this.setPosition([0, 0]);
        }
        this.setSize();
        this.setPosition();
    }
    public setSize(s: [number, number] = this.size) {
        this.size = s;
        [0, 1].forEach((i) => {
            if (this.fullscreen) {
                this.size[i] = $.windowSize[i];
            } else {
                this.size[i] = Util.clamp(this.size[i], 200, $.windowSize[i] - 20);
            }
            this.setStyle(['width', 'height'][i], `${this.size[i]}px`);
        });
    }
    private move(v: [number, number]) {
        if (!this.fullscreen){

        }
        this.setPosition(
            [
                this.position[0] + (v[0]),
                this.position[1] + (v[1]),
            ]);
    }
    public setPosition(v: [number, number] = this.position) {
        this.position = v;

        this.setStyle('transform', `translate(${this.position.map((p) => {
            return p;
        }).join('px,')}px)`);
    }
}