import { Panel } from '../../interface/panel';
import { DomElement } from '../../lib/dom/domElement';
import { Util } from '../../lib/utilities/utils';
import { v2, Vector2 } from '../../lib/utilities/vector2';
export interface CameraProps {
    minZoom: number,
    maxZoom: number,
    scrollSpeed: number,
    contentSize?: Vector2,
}
export class Camera extends DomElement<'div'> {
    private position: Vector2 = v2();
    public scale: number = 1;

    private grid: DomElement<"div">;
    public content: DomElement<"div">;

    private draggerKey: string;
    private scrollKey: string;

    public attr: CameraProps = {
        scrollSpeed: 1,
        minZoom: 1,
        maxZoom: 1,
    };
    constructor(private parent: Panel, attr: CameraProps|{}) {
        super('div', {
            className: 'panelCamera'
        });
        Object.assign(this.attr, attr)
        
        this.grid = this.child('div', {
            className: 'panelCameraMover grid'
        });
        this.content = this.child('div', {
            className: 'panelCameraContent',
            style: {
                width: `${this.attr.contentSize?.[0]}px`,
                height: `${this.attr.contentSize?.[1]}px`,
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
                const newScale = Util.clamp(this.scale + this.scale * (e.delta / 100) * (-0.1*this.attr.scrollSpeed), this.attr.minZoom, this.attr.maxZoom);
                this.move(e.relative.scale(1 - newScale / this.scale));
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
            this.grid.setStyle(['width', 'height'][i], `${((this.parent.size[i] + (100 * this.scale)) * (1 / this.scale))}px`);
        });
        this.setPosition(this.position);
    }
    setPosition(v: Vector2) {
        this.position = v;
        this.grid.setStyle('transform', `translate(${this.position.map((p) => {
            return (p % (50 * this.scale) - (50 * this.scale));
        }).join('px,')}px) scale(${this.scale})`);
        this.content.setStyle('transform', `translate(${this.position.map((p) => {
            return p;
        }).join('px,')}px) scale(${this.scale})`);
    }
    center() {
        if (this.attr.contentSize){
            this.setPosition(this.parent.size.subtract(this.attr.contentSize.scale(this.scale)).scale(0.5))
        } else {
            this.setPosition(v2(0,0))
        }
    }
}