import { DomElement } from '../../../lib/dom/domElement';
import { v2, Vector2 } from '../../../lib/utilities/vector2';
import { PropsInputNumber } from '../../../panels/properties/propsInputNumber';
import { PropsInputString } from '../../../panels/properties/propsInputString';
import { PropsInputVector } from '../../../panels/properties/propsInputVector';
import { SceneObject } from '../../sceneobject';
import { VisualTypeData, SceneObjectComponentVisual } from '../sceneobjectComponentVisual';
import { Mover } from './mover';
import { Sizer } from './sizer';
import { Visual } from './visualBase';

export type VisualTypeDataCallout = {
    position?: Vector2;
    position2?: Vector2;
    size?: number;
    size2?: number;
    url?: string;
};
export class VisualCallout extends Visual<'callout'> {
    public data = {
        position: v2(),
        position2: v2(),
        size: 10,
        size2: 10,
        url: 'https://upload.wikimedia.org/wikipedia/commons/d/de/TestScreen_square.svg',
    } as VisualTypeData['callout'];

    private url: PropsInputString;

    private positionInput: PropsInputVector;
    private sizeInput: PropsInputNumber;
    private position2Input: PropsInputVector;
    private size2Input: PropsInputNumber;
    
    private circle: DomElement<"div">;
    private circle2: DomElement<"div">;
    private line: DomElement<"div">;

    public constructor(data: VisualTypeData['callout'] = {}, sceneObject: SceneObject, component: SceneObjectComponentVisual) {
        super('callout', sceneObject, component);

        this.line = this.visual.child('div', { className: 'line' });
        this.circle = this.visual.child('div', { className: 'circleBig' });
        this.circle2 = this.visual.child('div', { className: 'circleSmall' });

        this.positionInput = this.sceneObject.defineProperty($.unique, {
            input: new PropsInputVector({
                onChange: (v) => {
                    this.set({
                        position: v.c()
                    });
                },
                initialValue: data.position
            }),
            name: 'Position'
        }) as PropsInputVector;

        this.position2Input = this.sceneObject.defineProperty($.unique, {
            input: new PropsInputVector({
                onChange: (v) => {
                    this.set({
                        position2: v.c()
                    });
                },
                initialValue: data.position2
            }),
            name: 'Position 2'
        }) as PropsInputVector;

        this.sizeInput = this.sceneObject.defineProperty($.unique, {
            input: new PropsInputNumber({
                onChange: (v) => {
                    this.set({
                        size: v
                    });
                },
                initialValue: data.size2
            }),
            name: 'Size'
        }) as PropsInputNumber;

        this.size2Input = this.sceneObject.defineProperty($.unique, {
            input: new PropsInputNumber({
                onChange: (v) => {
                    this.set({
                        size2: v
                    });
                },
                initialValue: data.size2
            }),
            name: 'Size 2',
            
        }) as PropsInputNumber;

        this.url = this.sceneObject.defineProperty($.unique, {
            input: new PropsInputString({
                onChange: (v) => {
                    this.set({
                        url: v
                    });
                },
                initialValue: data.url
            }),
            name: 'URL'
        }) as PropsInputString;

        this.circle.append(new Mover(this.component.panel, (v) => {
            this.set({
                position: v
            });
        }, 'circle') as Mover);

        this.circle.append(new Sizer({
            graphic: this.component.panel, reference: this.circle, onChange: (v) => {
                this.set({
                    size: v.x
                });
            },
            shape: 'circle'
        }) as Sizer);

        this.circle2.append(new Mover(this.component.panel, (v) => {
            this.set({
                position2: v
            });
        }, 'circle') as Mover);

        this.circle2.append(new Sizer({
            graphic: this.component.panel, reference: this.circle2, onChange: (v) => {
                this.set({
                    size2: v.x
                });
            },
            shape: 'circle'
        }) as Sizer);

        this.set(data);
    }
    public set(data?: VisualTypeData['callout']) {
        super.set(data);

        this.data.size = Math.max(this.data.size, 20)
        this.data.size2 = Math.max(this.data.size2, 20)

        const min = this.data.position.min(this.data.position2);
        const max = this.data.position.add(v2(this.data.size)).max(this.data.position2.add(v2(this.data.size2)));
        const size = max.subtract(min);

        this.setStyle('left', `${min.x}px`);
        this.setStyle('top', `${min.y}px`);

        this.setStyle('width', `${size.x}px`);
        this.setStyle('height', `${size.y}px`);

        const c1 = this.data.position.add(v2(this.data.size).scale(0.5))
        const c2 = this.data.position2.add(v2(this.data.size2).scale(0.5))
        const angle = c2.subtract(c1).angleDegrees();
        const length = c1.subtract(c2).magnitude()-(this.data.size2/2);

        // line
        this.line.setStyle('left', `${c1.x - min.x}px`);
        this.line.setStyle('top', `${c1.y - min.y}px`);
        this.line.setStyle('width', `${length}px`);
        this.line.setStyle('transform', `rotate(${angle}deg)`);
        
        // bigcircle
        this.circle.setStyle('left', `${this.data.position[0] - min.x}px`);
        this.circle.setStyle('top', `${this.data.position[1] - min.y}px`);
        this.circle.setStyle('width', `${this.data.size}px`);
        this.circle.setStyle('height', `${this.data.size}px`);
        
        this.class(!this.data.url, 'empty');
        this.circle.setStyle('background-image', this.data.url?`url(${this.data.url})`:undefined);
        
        // smallcircle
        this.circle2.setStyle('left', `${this.data.position2[0]  - min.x}px`);
        this.circle2.setStyle('top', `${this.data.position2[1]  - min.y}px`);
        this.circle2.setStyle('width', `${this.data.size2}px`);
        this.circle2.setStyle('height', `${this.data.size2}px`);

        this.positionInput.silent(this.data.position);
        this.position2Input.silent(this.data.position2);
        this.sizeInput?.silent(this.data.size);
        this.size2Input?.silent(this.data.size2);
        this.url?.silent(this.data.url);
    }
}