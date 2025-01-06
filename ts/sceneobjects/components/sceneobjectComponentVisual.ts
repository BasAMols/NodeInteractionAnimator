import { DomElement } from '../../lib/dom/domElement';
import { v2, Vector2 } from '../../lib/utilities/vector2';
import { GraphicPanel } from '../../panels/graphic/graphicPanel';
import { PropsInputSelect } from '../../panels/properties/propsInputSelect';
import { PropsInputString } from '../../panels/properties/propsInputString';
import { PropsInputVector } from '../../panels/properties/propsInputVector';
import { SceneObject } from '../sceneobject';
import { SceneObjectComponentAttr, SceneObjectComponent } from './sceneobjectComponent';

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
        backgroundSize?: 'auto' | 'contain' | 'cover' | 'stretch' | 'custom',
        backgroundSizeCustom?: Vector2,
        backgroundPosition?: 'bottom' | 'center' | 'left' | 'right' | 'top' | 'custom',
        backgroundPositionCustom?: Vector2,
    } = {
            visualType: 'image',
            size: v2(),
            url: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Test.svg',
            // url: '',
            backgroundSize: 'auto' ,
            backgroundSizeCustom: v2(),
            backgroundPosition: 'left' ,
            backgroundPositionCustom: v2(),
        };
    url: PropsInputString;
    sizeInput: PropsInputVector;
    backgroundSize: PropsInputSelect;
    backgroundSizeCustom: PropsInputVector;
    backgroundPosition: PropsInputSelect<string>;
    backgroundPositionCustom: PropsInputVector;
    constructor(data: VisualImage['data']) {
        super(data);
        Object.assign(this.data, data);
        this.set(data);
    }

    build(s: SceneObject): void {
        super.build(s);

        this.sizeInput = this.sceneObject.defineProperty($.unique, {
            input: new PropsInputVector((v) => {
                this.set({
                    size: v.c()
                });
            }),
            name: 'Size'
        }) as PropsInputVector;

        this.url = this.sceneObject.defineProperty($.unique, {
            input: new PropsInputString((v) => {
                this.set({
                    url: v
                });
            }),
            name: 'URL'
        }) as PropsInputString;

        this.backgroundSize = this.sceneObject.defineProperty($.unique, {
            input: new PropsInputSelect((v) => {
                this.set({
                    backgroundSize: v
                });
            }, [['auto', 'Auto'], ['contain', 'Contain'], ['cover', 'Cover'], ['stretch', 'Stretch'], ['custom', 'Custom']], 'auto'),
            name: 'Background-size',
        }) as PropsInputSelect;

        this.backgroundSizeCustom = this.sceneObject.defineProperty($.unique, {
            input: new PropsInputVector((v) => {
                console.log(v);
                
                this.set({
                    backgroundSizeCustom: v.c()
                });
            }),
        }) as PropsInputVector;

        this.backgroundPosition = this.sceneObject.defineProperty($.unique, {
            input: new PropsInputSelect((v) => {
                this.set({
                    backgroundPosition: v
                });
            }, [['left', 'Left'], ['top', 'Top'], ['right', 'Right'], ['bottom', 'Bottom'], ['center', 'Center'], ['custom', 'Custom']], 'auto'),
            name: 'Background-position',
        }) as PropsInputSelect;

        this.backgroundPositionCustom = this.sceneObject.defineProperty($.unique, {
            input: new PropsInputVector((v) => {
                this.set({
                    backgroundPositionCustom: v.c()
                });
            }),
        }) as PropsInputVector;
        this.set();
    }

    set(d?: VisualImage['data'] | {}) {
        Object.assign(this.data, d);
        this.setStyle('width', `${this.data.size.x}px`);
        this.setStyle('height', `${this.data.size.y}px`);
        if (this.data.url) {
            this.class(false, 'empty');
            this.setStyle('background-image', `url(${this.data.url})`);

            switch (this.data.backgroundSize) {
                case 'stretch':
                    this.setStyle('background-size', '100% 100%');
                    break;
                case 'custom':
                    this.setStyle('background-size', this.data.backgroundSizeCustom.join('px ')+'px');
                    break;
                default:
                    this.setStyle('background-size', this.data.backgroundSize);
                    break;
            }
            
            switch (this.data.backgroundPosition) {
                case 'custom':
                    this.setStyle('background-position', this.data.backgroundPositionCustom.join('px ')+'px');
                    break;
                default:
                    this.setStyle('background-position', this.data.backgroundPosition);
                    break;
            }
        } else {
            this.class(true, 'empty');
            this.setStyle('background-image', undefined);
            this.setStyle('background-size', undefined);
            this.setStyle('background-position', undefined);
        }
        this.sizeInput?.silent(this.data.size);
        this.url?.silent(this.data.url);

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
    parent: DomElement<keyof HTMLElementTagNameMap>;
    positionInput: PropsInputVector;

    protected updateState() {
        super.updateState();
        this.element.class(this.selected, 'selected');
    }

    constructor(attr: SceneObjectComponentVisualAttr) {
        super('visual', attr);

        this.element = new DomElement('div', {
            className: 'SceneObjectVisual',
        });

        this.attr = { ...attr };
        this.visualType = attr.asset.visualType;
    }

    build(): void {
        super.build();
        this.panel = $.panels.getPanel('graphic') as GraphicPanel;

        this.positionInput = this.sceneObject.defineProperty($.unique, {
            input: new PropsInputVector((v) => {
                this.setPosition(v.c());
            }),
            name: 'Position'
        }) as PropsInputVector;

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
                className: `resizer`
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


    }
    add(parent: DomElement) {
        this.delete();
        this.parent = parent;
        this.parent.append(this.element);
    }
    delete(): void {
        super.delete();
        if (this.parent) {
            this.parent.remove(this.element);
        }
    }
    update() {
        this.setPosition();
        this.visual.set();
    }
    setPosition(v?: Vector2) {
        if (v) this.attr.position = v;
        this.element.setStyle('left', `${this.attr.position[0]}px`);
        this.element.setStyle('top', `${this.attr.position[1]}px`);
        this.positionInput?.silent(this.attr.position);
    }
}