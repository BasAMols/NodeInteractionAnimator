import { DomElement } from '../../lib/dom/domElement';
import { Icon } from '../../lib/dom/icon';
import { v2, Vector2 } from '../../lib/utilities/vector2';
import { GraphicPanel } from '../../panels/graphic/graphicPanel';
import { PropsNumberInput } from '../../panels/properties/propsNumberInput';
import { PropsStringInput } from '../../panels/properties/propsStringInput';
import { SceneObject } from '../sceneobject';
import { SceneObjectComponentAttr, SceneObjectComponent } from './sceneobjectComponent';
import { PropsInput } from 'c:/Users/basm/Documents/Development/NodeInteractionAnimator/ts/panels/properties/propsInput';

export abstract class VisualAsset<T extends keyof SceneObjectComponentVisual['dict'] = any> extends DomElement<'div'> {
    data: {
        visualType: T;
    };
    sceneObject: SceneObject;
    constructor(data: VisualAsset['data']) {
        super('div', {
            className: `visual visual_${data.visualType}`,
        });
        this.data = data;
    }
    build(s: SceneObject) {
        this.sceneObject = s;
    }
    set() {

    }
}
export class VisualImage extends VisualAsset<'image'> {
    data: {
        visualType: 'image';
        size: Vector2;
        url?: string;
    };
    width: PropsNumberInput;
    height: PropsNumberInput;
    url: PropsStringInput;
    constructor(data: VisualImage['data']) {
        super(data);
        Object.assign(this.data, data);
        this.set(data);
    }

    build(s: SceneObject): void {
        super.build(s);
        this.width = this.sceneObject.defineProperty($.unique, {
            input: new PropsNumberInput((v) => {
                this.set({
                    size: v2(
                        v,
                        this.data.size.y,
                    )
                });
            }),
            name: 'width'
        }) as PropsNumberInput;

        this.height = this.sceneObject.defineProperty($.unique, {
            input: new PropsNumberInput((v) => {
                this.set({
                    size: v2(
                        this.data.size.x,
                        v,
                    )
                });
            }),
            name: 'height'
        }) as PropsNumberInput;
        
        this.url = this.sceneObject.defineProperty($.unique, {
            input: new PropsStringInput((v) => {
                this.set({
                    url: v
                });
            }, 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Test.svg'),
            name: 'image'
        }) as PropsStringInput;
        this.set({url: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Test.svg'});
    }

    set(d?: VisualImage['data'] | {}) {
        Object.assign(this.data, d);
        this.setStyle('width', `${this.data.size.x}px`);
        this.setStyle('height', `${this.data.size.y}px`);
        if (this.data.url) {
            this.class(false, 'empty');
            this.setStyle('background-image', `url(${this.data.url})`);
        } else {
            this.class(true, 'empty');
            this.setStyle('background-image', undefined);
        }
        this.width?.silent(this.data.size.x)
        this.height?.silent(this.data.size.y)
        this.url?.silent(this.data.url)

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
    panel: GraphicPanel;
    attr: SceneObjectComponentVisualAttr;
    x: PropsInput<string | number | Vector2>;
    y: PropsInput<string | number | Vector2>;

    protected updateState() {
        super.updateState();
        this.element.class(this.selected, 'selected');
    }

    constructor(attr: SceneObjectComponentVisualAttr) {
        super('visual', attr);

        this.element = new DomElement('div', {
            className: 'SceneObjectVisual',
        });

        this.attr = attr;

        this.visualType = attr.asset.visualType;


    }

    build(): void {
        super.build();
        this.panel = $.panels.getPanel('graphic') as GraphicPanel;

        this.x = this.sceneObject.defineProperty($.unique, {
            input: new PropsNumberInput((v) => {
                this.setPosition(v2(
                    v,
                    this.attr.position.y,
                ));
            }),
            name: 'x'
        });

        this.y = this.sceneObject.defineProperty($.unique, {
            input: new PropsNumberInput((v) => {
                this.setPosition(v2(
                    this.attr.position.x,
                    v,
                ));
            }),
            name: 'y'
        });

        this.visual = new (this.dict[this.visualType])(this.attr.asset);
        this.visual.build(this.sceneObject);

        this.element.append(this.visual);
        this.setPosition(this.attr.position.floor());

        $.mouse.registerDrag($.unique, {
            element: this.element,
            cursor: 'move',
            reference: this.panel.graphic,
            initialTolerance: 400,
            start: () => {
                this.sceneObject.focus();
            },
            move: (e) => {
                if (e.e.ctrlKey && e.e.shiftKey) {
                    this.attr.position = e.relative.add(e.offset).scale((1 / this.panel.camera.scale)).scale(0.04).floor().scale(25);
                } else if (e.e.ctrlKey) {
                    this.attr.position = e.relative.add(e.offset).scale((1 / this.panel.camera.scale)).scale(0.1).floor().scale(10);
                } else if (e.e.shiftKey) {
                    this.attr.position = e.relative.add(e.offset).scale((1 / this.panel.camera.scale)).scale(0.2).floor().scale(5);
                } else {
                    this.attr.position = e.relative.add(e.offset).scale((1 / this.panel.camera.scale)).floor();
                }
                this.setPosition(this.attr.position);
            }
        });

        this.resizerKey = $.mouse.registerDrag($.unique, {
            element: this.resizer = this.element.child('span', {
                className: `window_resizer`
            }),
            reference: this.element,
            initialTolerance: 400,
            cursor: 'nw-resize',
            start: () => {
                this.sceneObject.focus();
            },
            move: (e) => {
                if (e.e.ctrlKey && e.e.shiftKey) {
                    this.visual.set({
                        size: e.relative.scale(1 / (this.panel.camera.scale)).scale(0.04).floor().scale(25)
                    });
                } else if (e.e.ctrlKey) {
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
    add(parent: DomElement) {
        this.delete();
        parent.append(this.element);
    }
    delete(): void {
        super.delete();
        if (this.element.domElement.parentElement) {
            this.element.domElement.parentElement.removeChild(this.element.domElement);
        }
    }
    setPosition(v: Vector2) {
        this.attr.position = v;
        this.element.setStyle('left', `${this.attr.position[0]}px`);
        this.element.setStyle('top', `${this.attr.position[1]}px`);
        this.x?.silent(v[0]);
        this.y?.silent(v[1]);
    }
}