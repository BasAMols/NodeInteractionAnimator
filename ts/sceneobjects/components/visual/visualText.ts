import { DomInput } from '../../../lib/dom/domInput';
import { Vector2 } from '../../../lib/utilities/vector2';
import { PropsInputBoolean } from '../../../panels/properties/propsInputBoolean';
import { PropsInputNumber } from '../../../panels/properties/propsInputNumber';
import { PropsInputSelect } from '../../../panels/properties/propsInputSelect';
import { PropsInputString } from '../../../panels/properties/propsInputString';
import { PropsInputVector } from '../../../panels/properties/propsInputVector';
import { SceneObject } from '../../sceneobject';
import { VisualTypeData, SceneObjectComponentVisual } from '../sceneobjectComponentVisual';
import { Mover } from './mover';
import { Sizer } from './sizer';
import { Visual } from './visualBase';

export type VisualTypeDataText = {
    position?: Vector2,
    text?: string,
    bold?: boolean,
    italic?: boolean,
    alignment?: 'center' | 'left' | 'right',
    width?: number,
};

export class VisualText extends Visual<'text'> {
    public data = {
        text: '',
        bold: false,
        italic: false,
        alignment: 'left',
        width: 0,
    } as VisualTypeData['text'];
    positionInput: PropsInputVector;
    text: PropsInputString;
    input: DomInput<'textarea'>;
    mover: import("c:/Users/basm/Documents/Development/NodeInteractionAnimator/ts/lib/dom/domElement").DomElement<keyof HTMLElementTagNameMap>;
    sizer: import("c:/Users/basm/Documents/Development/NodeInteractionAnimator/ts/lib/dom/domElement").DomElement<keyof HTMLElementTagNameMap>;
    constructor(data: VisualTypeData['text'] = {}, sceneObject: SceneObject, component: SceneObjectComponentVisual) {
        super('text', sceneObject, component);

        this.positionInput = this.sceneObject.defineProperty($.unique, {
            input: new PropsInputVector({
                onChange: (v) => {
                    this.set({
                        position: v.c()
                    });
                }, initialValue: data.position
            }),
            name: 'Position'
        }) as PropsInputVector;

        this.sceneObject.defineProperty($.unique, {
            input: new PropsInputBoolean({
                onChange: (v) => {
                    this.set({
                        bold: v
                    });
                }, initialValue: data.bold
            }),
            name: 'Bold'
        }) as PropsInputBoolean;

        this.sceneObject.defineProperty($.unique, {
            input: new PropsInputBoolean({
                onChange: (v) => {
                    this.set({
                        italic: v
                    });
                }, initialValue: data.italic
            }),
            name: 'Italic'
        }) as PropsInputBoolean;

        this.sceneObject.defineProperty($.unique, {
            input: this.text = new PropsInputString({
                onChange: (v) => {
                    this.set({
                        text: v
                    });
                }, initialValue: data.text
            }),
            name: 'Text',
        }) as PropsInputString;

        this.sceneObject.defineProperty($.unique, {
            input: new PropsInputSelect<"center" | "left" | "right">({
                onChange: (v) => {
                    this.set({
                        alignment: v
                    });
                },
                options: [['center', 'Center'], ['left', 'Left'], ['right', 'Right']],
                initialValue: data.alignment || 'left'
            }),
            name: 'Alignment',
        }) as PropsInputSelect;

        this.sceneObject.defineProperty($.unique, {
            input: new PropsInputNumber({
                onChange: (v) => {
                    this.set({
                        width: v
                    });
                }, initialValue: data.width
            }),
            name: 'Width'
        }) as PropsInputNumber;

        this.mover = this.append(new Mover(this.component.panel, (v) => {
            this.set({
                position: v
            });
        }) as Mover);

        this.sizer = this.append(new Sizer({
                graphic: this.component.panel, reference: this, direction: 'x', onChange: (v) => {
                    this.set({
                        width: v.x
                    });
                }
            }) as Sizer);


        this.set(data);
    }
    public set(data?: VisualTypeData['text']) {
        super.set(data);

        this.setStyle('left', `${this.data.position[0]}px`);
        this.setStyle('top', `${this.data.position[1]}px`);
        this.visual.setStyle('width', `${this.data.width}px`);
        this.visual.setStyle('text-align', this.data.alignment);
        this.visual.setStyle('font-weight', this.data.bold ? `bold` : undefined);
        this.visual.setStyle('font-style', this.data.italic ? `italic` : undefined);

        this.visual.setText(this.data.text);

        this.positionInput.silent(this.data.position);

    }
}