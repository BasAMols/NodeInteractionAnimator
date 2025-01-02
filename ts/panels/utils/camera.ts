import { Panel } from '../../interface/panel';
import { DomElement } from '../../lib/dom/domElement';
import { Util } from '../../lib/utilities/utils';
import { v2, Vector2 } from '../../lib/utilities/vector2';

export class Camera extends DomElement<'div'> {
    private position: Vector2 = v2();
    private scale: number = 1;

    private mover: DomElement<"div">;
    public content: DomElement<"div">;
    
    private draggerKey: string;
    private scrollKey: string;
    constructor(private parent: Panel, private contentSize?: Vector2, private clamp: boolean = true) {
        super('div', {
            className: 'panelCamera'
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

        this.draggerKey = $.mouse.registerDrag($.unique, {
            element: this,
            cursor: 'grab',
            move: (e) => {
                this.move(e.delta);
            },
        });

        this.scrollKey = $.mouse.registerScroll($.unique, {
            element: this,
            reference: this.content,
            scroll: (e) => {
                const newScale = Util.clamp(this.scale + this.scale * (e.delta / 100) * -0.1, 0.1, 5);
                const oldScale = this.scale / newScale;
                this.move(e.relative.scale(1-oldScale).scale(-1))

                this.scale = newScale;
                this.resize();
            },
        });

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