import { DomElement } from '../../lib/dom/domElement';
import { v2, Vector2 } from '../../lib/utilities/vector2';
import { GraphicPanel } from '../../panels/graphic/graphicPanel';
import { PropsInputBoolean } from '../../panels/properties/propsInputBoolean';
import { PropsInputSelect } from '../../panels/properties/propsInputSelect';
import { PropsInputString } from '../../panels/properties/propsInputString';
import { PropsInputVector } from '../../panels/properties/propsInputVector';
import { SceneObject } from '../sceneobject';
import { SceneObjectComponent } from './sceneobjectComponent';

export type VisualTypeData = {
    'text': {
        position?: Vector2,
        text?: string,
        bold?: boolean,
        italic?: boolean,
        alignment?: 'center' | 'left' | 'right',
        width?: number,
    },
    'image': {
        position?: Vector2;
        size?: Vector2;
        url?: string;
        repeat?: boolean,
        backgroundSize?: 'auto' | 'contain' | 'cover' | 'stretch' | 'custom',
        backgroundSizeCustom?: Vector2,
        backgroundPosition?: 'bottom' | 'center' | 'left' | 'right' | 'top' | 'custom',
        backgroundPositionCustom?: Vector2,
    };
};

export type VisualTypeKeys = keyof VisualTypeData;
export type VisualType = VisualTypeData[VisualTypeKeys];

export class Visual<T extends keyof VisualTypeData> extends DomElement<'div'> {
    public visualType: T;
    public sceneObject: SceneObject;
    public data: VisualTypeData[T];
    constructor(type: T, sceneObject: SceneObject) {
        super('div', {
            className: `visual visual_${type}`,
        });
        this.sceneObject = sceneObject;
    }
    public set(data?: VisualTypeData[T]) {
        Object.assign(this.data, data);
    }
}

export const VisualTypeDictionary = {
    image: class VImage extends Visual<'image'> {
        public data = {
            position: v2(),
            size: v2(),
            url: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Test.svg',
            repeat: false,
            backgroundSize: 'contain',
            backgroundSizeCustom: v2(),
            backgroundPosition: 'center',
            backgroundPositionCustom: v2(),
        } as VisualTypeData['image'];

        private url: PropsInputString;
        private sizeInput: PropsInputVector;
        private backgroundSize: PropsInputSelect;
        private repeat: PropsInputBoolean;
        private backgroundSizeCustom: PropsInputVector;
        private backgroundPosition: PropsInputSelect<string>;
        private backgroundPositionCustom: PropsInputVector;

        public constructor(data: VisualTypeData['image'] = {}, sceneObject: SceneObject) {
            super('image', sceneObject);

            this.sizeInput = this.sceneObject.defineProperty($.unique, {
                input: new PropsInputVector((v) => {
                    this.set({
                        size: v.c()
                    });
                }),
                name: 'Size'
            }) as PropsInputVector;

            this.repeat = this.sceneObject.defineProperty($.unique, {
                input: new PropsInputBoolean((v) => {
                    this.set({
                        repeat: v
                    });
                }),
                name: 'Repeat'
            }) as PropsInputBoolean;
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

            this.set(data);
        }
        public set(data?: VisualTypeData['image']) {
            super.set(data);
            this.setStyle('width', `${this.data.size.x}px`);
            this.setStyle('height', `${this.data.size.y}px`);
            this.setStyle('background-repeat', this.data.repeat ? 'repeat' : 'no-repeat');
            if (this.data.url) {
                this.class(false, 'empty');
                this.setStyle('background-image', `url(${this.data.url})`);

                switch (this.data.backgroundSize) {
                    case 'stretch':
                        this.setStyle('background-size', '100% 100%');
                        break;
                    case 'custom':
                        this.setStyle('background-size', this.data.backgroundSizeCustom.join('px ') + 'px');
                        break;
                    default:
                        this.setStyle('background-size', this.data.backgroundSize);
                        break;
                }

                switch (this.data.backgroundPosition) {
                    case 'custom':
                        this.setStyle('background-position', this.data.backgroundPositionCustom.join('px ') + 'px');
                        break;
                    default:
                        this.setStyle('background-position', this.data.backgroundPosition);
                        break;
                }
            } else {
                this.class(true, 'empty');
                this.setStyle('background-image', undefined);
                this.setStyle('background-size', undefined);
                this.setStyle('background-repeat', undefined);
                this.setStyle('background-position', undefined);
            }
            this.sizeInput?.silent(this.data.size);
            this.url?.silent(this.data.url);
        }
    },
    text: class VText extends Visual<'text'> {
        public data = {
            text: '',
            bold: false,
            italic: false,
            alignment: 'left',
            width: 0,
        } as VisualTypeData['text'];
        constructor(data: VisualTypeData['text'] = {}, sceneObject: SceneObject) {
            super('text', sceneObject);
            this.set(data);
        }
        public set(data?: VisualTypeData['text']) {
            super.set(data);
        }
    }
};

export class SceneObjectComponentVisual<T extends VisualTypeKeys = VisualTypeKeys> extends SceneObjectComponent<'visual'> {
    public element: DomElement<"div">;
    visual: InstanceType<typeof VisualTypeDictionary[T]>;
    resizerKey: string;
    panel: GraphicPanel;
    parent: DomElement<keyof HTMLElementTagNameMap>;
    positionInput: PropsInputVector;
    private _position: Vector2 = v2();
    public get position(): Vector2 {
        return this._position;
    }
    public set position(value: Vector2) {
        this._position = value;
        this.element.setStyle('left', `${this._position[0]}px`);
        this.element.setStyle('top', `${this._position[1]}px`);
        this.positionInput?.silent(this._position);
    }

    private toBuild: [VisualTypeData[T], typeof VisualTypeDictionary[T]];

    protected updateState() {
        super.updateState();
        this.element.class(this.selected, 'selected');
    }

    constructor(type: T, data: VisualTypeData[T]) {
        super('visual');
        this.element = new DomElement('div', {
            className: 'SceneObjectVisual',
        });

        this.toBuild = [data, VisualTypeDictionary[type]];
    }

    build(): void {
        super.build();
        this.panel = $.panels.getPanel('graphic') as GraphicPanel;

        this.positionInput = this.sceneObject.defineProperty($.unique, {
            input: new PropsInputVector((v) => {
                this.position = v.c();
            }),
            name: 'Position'
        }) as PropsInputVector;

        this.visual = new (this.toBuild[1])(this.toBuild[0], this.sceneObject) as InstanceType<typeof VisualTypeDictionary[T]>;
        this.element.append(this.visual);

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
                    this.position = e.relative.add(e.offset).scale((1 / this.panel.camera.scale)).scale(0.04).floor().scale(25);
                } else if (e.e.ctrlKey) {
                    this.position = e.relative.add(e.offset).scale((1 / this.panel.camera.scale)).scale(0.1).floor().scale(10);
                } else if (e.e.shiftKey) {
                    this.position = e.relative.add(e.offset).scale((1 / this.panel.camera.scale)).scale(0.2).floor().scale(5);
                } else {
                    this.position = e.relative.add(e.offset).scale((1 / this.panel.camera.scale)).floor();
                }
            }
        });

        this.resizerKey = $.mouse.registerDrag($.unique, {
            element: this.element.child('span', {
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
        this.position = this.position;
        this.visual.set();
    }
}