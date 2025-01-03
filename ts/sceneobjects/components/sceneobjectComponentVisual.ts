import { DomElement } from '../../lib/dom/domElement';
import { Icon } from '../../lib/dom/icon';
import { Vector2 } from '../../lib/utilities/vector2';
import { GraphicPanel } from '../../panels/graphic/graphicPanel';
import { SceneObjectComponentAttr, SceneObjectComponent } from './sceneobjectComponent';

export abstract class VisualAsset<T extends keyof SceneObjectComponentVisual['dict'] = any> extends DomElement<'div'> {
    data: {
        visualType: T;
    };
    constructor(data: VisualAsset['data']) {
        super('div', {
            className: `visual visual_${data.visualType}`,
        });
        this.data = data;
    }
}
export class VisualImage extends VisualAsset<'image'> {
    data: {
        visualType: 'image';
        size: Vector2;
        url?: string;
    };
    constructor(data: VisualImage['data']) {
        super(data);
        this.set(data);
    }

    set(d: VisualImage['data'] | {} = this.data) {
        Object.assign(this.data, d);
        this.setStyle('width', `${this.data.size.x}px`);
        this.setStyle('height', `${this.data.size.y}px`);
        if (this.data.url) {
            this.setStyle('background-image', `url(${this.data.url})`);
        } else {
            this.setStyle('background-color', `#dbdbdb`);
            this.setStyle('background-image', undefined);
        }
    }
}

export interface SceneObjectComponentVisualAttr extends SceneObjectComponentAttr {
    position: Vector2;
    asset: VisualImage['data'];
}
export type VisualTypes = 'image';
export class SceneObjectComponentVisual extends SceneObjectComponent<'visual'> {
    private dict: {
        'image': typeof VisualImage;
    } = {
            image: VisualImage
        };

    public element: DomElement<"div">;
    public readonly visualType: SceneObjectComponentVisualAttr['asset']['visualType'];
    visual: VisualImage;
    resizerKey: string;
    resizer: any;
    panel: GraphicPanel = $.panels.getPanel('graphic') as GraphicPanel;

    protected updateState() {
        super.updateState();
        this.element.class(this.selected, 'selected');
    }

    constructor(attr: SceneObjectComponentVisualAttr) {
        super('visual', attr);

        this.element = new DomElement('div', {
            className: 'SceneObjectVisual',
        });

        this.visualType = attr.asset.visualType;
        this.visual = new (this.dict[this.visualType])(attr.asset);
        this.element.append(this.visual);

        this.setPosition(attr.position.floor());

        $.mouse.registerDrag($.unique, {
            element: this.element,
            cursor: 'move',
            reference: this.panel.graphic,
            start: () => {
                this.sceneObject.focus();
            },
            move: (e) => {
                if (e.e.ctrlKey && e.e.shiftKey) {
                    attr.position = e.relative.add(e.offset).scale((1 / this.panel.camera.scale)).scale(0.04).floor().scale(25);
                } else if (e.e.ctrlKey) {
                    attr.position = e.relative.add(e.offset).scale((1 / this.panel.camera.scale)).scale(0.1).floor().scale(10);
                } else if (e.e.shiftKey) {
                    attr.position = e.relative.add(e.offset).scale((1 / this.panel.camera.scale)).scale(0.2).floor().scale(5);
                } else {
                    attr.position = e.relative.add(e.offset).scale((1 / this.panel.camera.scale)).floor();
                }
                this.setPosition(attr.position);
            }
        });

        this.resizerKey = $.mouse.registerDrag($.unique, {
            element: this.resizer = this.element.child('span', {
                className: `window_resizer`
            }),
            reference: this.element,
            cursor: 'nw-resize',
            start: () => {
                this.sceneObject.focus();
            },
            move: (e) => {
                if (e.e.ctrlKey && e.e.shiftKey) {
                    this.visual.set({
                        size: e.relative.scale(1 / (this.panel.camera.scale)).scale(0.04).floor().scale(25)
                    });
                }else if (e.e.ctrlKey) {
                    this.visual.set({
                        size: e.relative.scale(1 / (this.panel.camera.scale)).scale(0.1).floor().scale(10)
                    });
                } else if (e.e.shiftKey) {
                    this.visual.set({
                        size: e.relative.scale(1 / (this.panel.camera.scale)).scale(0.2).floor().scale(5)
                    });
                } else {
                    this.visual.set({
                        size: e.relative.scale(1 / (this.panel.camera.scale)).floor()
                    });
                }
            },
        });
        this.resizer.append(new Icon({ name: 'aspect_ratio', weight: 200 }));

    }

    build(): void {
        super.build();
    }
    add(parent: DomElement) {
        this.delete();
        parent.append(this.element);
    }
    delete(): void {
        if (this.element.domElement.parentElement) {
            this.element.domElement.parentElement.removeChild(this.element.domElement);
        }
    }
    setPosition(v: Vector2) {
        this.element.setStyle('left', `${v[0]}px`);
        this.element.setStyle('top', `${v[1]}px`);
    }
}