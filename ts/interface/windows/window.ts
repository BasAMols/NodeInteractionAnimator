import { DomElement } from '../../lib/dom/domElement';
import { Icon } from '../../lib/dom/icon';
import { Util } from '../../lib/utilities/utils';
import { v2, Vector2 } from '../../lib/utilities/vector2';
import { Menu } from '../menu';

export class WindowPanel extends DomElement<'div'> {
    private _fullscreen: boolean = false;
    resizer: DomElement;
    resizerKey: string;
    public get fullscreen(): boolean {
        return this._fullscreen;
    }
    public set fullscreen(value: boolean) {
        if (this._fullscreen === value) return;
        this._fullscreen = value;
        this.domElement.classList[this.fullscreen ? 'add' : 'remove']('fullscreen');
        if (this.fullscreen) {
            this.preFullscreen = [this.size.c(), this.position.c()];
            this.setSize();
            this.setPosition(v2());
        } else {
            this.setSize(this.preFullscreen[0]);
            this.setPosition(this.preFullscreen[1]);
        }
        $.drag.able(`window_${this.id}`, !this.fullscreen);

    }

    protected content: DomElement<"div">;
    protected header: DomElement<"div">;
    public preFullscreen: [Vector2, Vector2] = [v2(), v2()];
    public size: Vector2 = v2();
    public position: Vector2 = v2(10, 10);
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
        this.setStyle('z-index', String(value));
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
        $.drag.register(`window_${id}`, {
            element: this.header.child('span', {
                text: name,
                className: 'title'
            }),
            move: (e) => {
                this.setPosition(e.relative.add(e.offset));
            },
            start: () => {
                this.focus();
            }
        });

        this.resizerKey = $.drag.register($.unique, {
            element: this.resizer = this.child('span', {
                className: `window_resizer`
            }),
            reference: this,
            cursor: 'nw-resize',
            move: (e) => {
                this.setSize(e.relative)
            },
            start: ()=>{
                this.focus();
            }
        });
        this.resizer.append(new Icon({name: 'aspect_ratio', weight: 200}))

        
        this.header.append(new Menu([
            {
                key: 'max',
                name: '',
                className: 'max-button',
                type: 'Action',
                design: 'inline',
                icon: Icon.make('check_box_outline_blank'),
                onClick: () => {
                    this.fullscreen = true;
                }
            },
            {
                key: 'min',
                name: '',
                className: 'min-button',
                type: 'Action',
                design: 'inline',
                icon: Icon.make('filter_none'),
                onClick: () => {
                    this.fullscreen = false;
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

    }
    public focus() {
        // The top most window always has an even order, so if this is uneven I dont have to reorder the list. 
        if (this.order % 2 === 0) {
            this.order = 100;
            $.windows.reorder();
        }
    }

    public resize() {
        if (this.fullscreen) {
            this.setSize($.windowSize);
            this.setPosition(v2());
        }
        this.setSize();
        this.setPosition();
    }
    public setSize(s: Vector2 = this.size) {
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
    public setPosition(v: Vector2 = this.position) {
        this.position = v;
        this.setStyle('transform', `translate(${this.position.map((p, i) => {
            return Util.clamp(p, 0, $.windowSize[i] - this.size[i]);
        }).join('px,')}px)`);
    }
}