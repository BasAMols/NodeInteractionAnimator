import { v2, Vector2 } from '../../../lib/utilities/vector2';
import { PropsInputBoolean } from '../../../panels/properties/propsInputBoolean';
import { PropsInputSelect } from '../../../panels/properties/propsInputSelect';
import { PropsInputString } from '../../../panels/properties/propsInputString';
import { PropsInputVector } from '../../../panels/properties/propsInputVector';
import { SceneObject } from '../../sceneobject';
import { VisualTypeData, SceneObjectComponentVisual } from '../sceneobjectComponentVisual';
import { Mover } from './mover';
import { Sizer } from './sizer';
import { Visual } from './visualBase';

export type VisualTypeDataImage = {
    position?: Vector2;
    size?: Vector2;
    url?: string;
    repeat?: boolean,
    backgroundSize?: 'auto' | 'contain' | 'cover' | 'stretch' | 'custom',
    backgroundSizeCustom?: Vector2,
    backgroundPosition?: 'bottom' | 'center' | 'left' | 'right' | 'top' | 'custom' | 'auto',
    backgroundPositionCustom?: Vector2,
};
export class VisualImage extends Visual<'image'> {
    public data = {
        position: v2(),
        size: v2(),
        url: 'https://upload.wikimedia.org/wikipedia/commons/d/de/TestScreen_square.svg',
        repeat: false,
        backgroundSize: 'contain',
        backgroundSizeCustom: v2(),
        backgroundPosition: 'center',
        backgroundPositionCustom: v2(),
    } as VisualTypeData['image'];

    private positionInput: PropsInputVector;
    private sizeInput: PropsInputVector;

    private url: PropsInputString;
    private bgsizeInput: PropsInputSelect<string>;
    private bgsizeInputCustom: PropsInputVector;
    private positionCustom: PropsInputSelect<string>;
    private positionInputCustom: PropsInputVector;
    private repeat: PropsInputBoolean;
    mover: Mover;
    sizer: Sizer;

    public constructor(data: VisualTypeData['image'] = {}, sceneObject: SceneObject, component: SceneObjectComponentVisual) {
        super('image', sceneObject, component);

        this.positionInput = this.sceneObject.defineProperty($.unique, {
            input: new PropsInputVector({
                onChange: (v) => {
                    this.set({
                        position: v.c()
                    });
                }
            }),
            name: 'Position'
        }) as PropsInputVector;

        this.sizeInput = this.sceneObject.defineProperty($.unique, {
            input: new PropsInputVector({
                onChange: (v) => {
                    this.set({
                        size: v.c()
                    });
                }
            }),
            name: 'Size'
        }) as PropsInputVector;

        this.repeat = this.sceneObject.defineProperty($.unique, {
            input: new PropsInputBoolean({
                onChange: (v) => {
                    this.set({
                        repeat: v
                    });
                }
            }),
            name: 'Repeat'
        }) as PropsInputBoolean;
        this.url = this.sceneObject.defineProperty($.unique, {
            input: new PropsInputString({
                onChange: (v) => {
                    this.set({
                        url: v
                    });
                }
            }),
            name: 'URL'
        }) as PropsInputString;

        this.bgsizeInput = this.sceneObject.defineProperty($.unique, {
            input: new PropsInputSelect<typeof this['data']['backgroundSize']>({
                onChange: (v) => {
                    this.set({
                        backgroundSize: v
                    });
                },
                options: [['auto', 'Auto'], ['contain', 'Contain'], ['cover', 'Cover'], ['stretch', 'Stretch'], ['custom', 'Custom']],
                initialValue: 'auto'
            }),
            name: 'Background-size',
        }) as PropsInputSelect;

        this.bgsizeInputCustom = this.sceneObject.defineProperty($.unique, {
            input: new PropsInputVector({
                onChange: (v) => {
                    this.set({
                        backgroundSizeCustom: v.c()
                    });
                }
            }),
        }) as PropsInputVector;

        this.positionCustom = this.sceneObject.defineProperty($.unique, {
            input: new PropsInputSelect<typeof this['data']['backgroundPosition']>({
                onChange: (v) => {
                    this.set({
                        backgroundPosition: v
                    });
                },
                options: [['left', 'Left'], ['top', 'Top'], ['right', 'Right'], ['bottom', 'Bottom'], ['center', 'Center'], ['custom', 'Custom']],
                initialValue: 'auto'
            }),
            name: 'Background-position',
        }) as PropsInputSelect;

        this.positionInputCustom = this.sceneObject.defineProperty($.unique, {
            input: new PropsInputVector({
                onChange: (v) => {
                    this.set({
                        backgroundPositionCustom: v.c()
                    });
                }
            }),
        }) as PropsInputVector;


        this.mover = this.append(new Mover(this.component.panel, (v) => {
            this.set({
                position: v
            });
        }) as Mover);

        this.sizer = this.append(new Sizer({
                graphic: this.component.panel, reference: this, onChange: (v) => {
                    this.set({
                        size: v
                    });
                }
            }) as Sizer);

        this.set(data);
    }
    public set(data?: VisualTypeData['image']) {
        super.set(data);

        this.setStyle('left', `${this.data.position[0]}px`);
        this.setStyle('top', `${this.data.position[1]}px`);

        this.visual.setStyle('width', `${this.data.size.x}px`);
        this.visual.setStyle('height', `${this.data.size.y}px`);
        this.visual.setStyle('background-repeat', this.data.repeat ? 'repeat' : 'no-repeat');
        if (this.data.url) {
            this.class(false, 'empty');
            this.visual.setStyle('background-image', `url(${this.data.url})`);

            switch (this.data.backgroundSize) {
                case 'stretch':
                    this.visual.setStyle('background-size', '100% 100%');
                    break;
                case 'custom':
                    this.visual.setStyle('background-size', this.data.backgroundSizeCustom.join('px ') + 'px');
                    break;
                default:
                    this.visual.setStyle('background-size', this.data.backgroundSize);
                    break;
            }

            switch (this.data.backgroundPosition) {
                case 'custom':
                    this.visual.setStyle('background-position', this.data.backgroundPositionCustom.join('px ') + 'px');
                    break;
                default:
                    this.visual.setStyle('background-position', this.data.backgroundPosition);
                    break;
            }
        } else {
            this.class(true, 'empty');
            this.visual.setStyle('background-image', undefined);
            this.visual.setStyle('background-size', undefined);
            this.visual.setStyle('background-repeat', undefined);
            this.visual.setStyle('background-position', undefined);
        }
        this.positionInput.silent(this.data.position);
        this.sizeInput?.silent(this.data.size);
        this.url?.silent(this.data.url);
    }
}