import { DomElement } from '../../../lib/dom/domElement';
import { DomSVGElement } from '../../../lib/dom/domSVG';
import { v2, Vector2 } from '../../../lib/utilities/vector2';
import { PropsInputSelect } from '../../../panels/properties/propsInputSelect';
import { PropsInputVector } from '../../../panels/properties/propsInputVector';
import { SceneObject } from '../../sceneobject';
import { VisualTypeData, SceneObjectComponentVisual } from '../sceneobjectComponentVisual';
import { Mover } from './mover';
import { Visual } from './visualBase';

export type VisualTypeDataArrow = {
    position?: Vector2;
    position2?: Vector2;
    position3?: Vector2;
    type?: 'straight' | 'curved' | 'corner';
    color?: 'black' | 'blue' | 'red';
    style?: 'solid' | 'dashed';
};
export class VisualArrow extends Visual<'arrow'> {
    public data = {
        type: 'straight',
        position: v2(),
        position2: v2(),
        position3: v2(),
        color: 'black',
        style: 'solid',
    } as VisualTypeData['arrow'];

    private positionInput: PropsInputVector;
    private position2Input: PropsInputVector;
    private position3Input: PropsInputVector;
    
    private tailControlPoint: DomElement<"div">;
    private headControlPoint: DomElement<"div">;
    private midControlPoint: DomElement<"div">;
    
    private head: DomElement<"div">;
    private svg: DomSVGElement;
    private svgArrow: DomSVGElement<"path">;

    public constructor(data: VisualTypeData['arrow'] = {}, sceneObject: SceneObject, component: SceneObjectComponentVisual) {
        super('arrow', sceneObject, component);

        this.head = this.visual.child('div', { className: 'head' });

        this.svg = this.visual.appendSvg(new DomSVGElement('svg', {
            className: 'arrowSVG',
        })) as DomSVGElement;

        this.svgArrow = this.svg.child('path', {
            className: 'arrowPath',
        });

        this.tailControlPoint = this.child('div');
        this.headControlPoint = this.child('div');
        this.midControlPoint = this.child('div');

        this.positionInput = this.sceneObject.defineProperty($.unique, {
            input: new PropsInputVector({
                onChange: (v) => {
                    this.set({
                        position: v.c()
                    });
                },
                initialValue: data.position
            }),
            name: 'Tail position'
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
            name: 'Head position'
        }) as PropsInputVector;
        
        this.sceneObject.defineProperty($.unique, {
            input: new PropsInputSelect<typeof this['data']['type']>({
                onChange: (v) => {
                    this.set({
                        type: v
                    });
                },
                options: [['straight', 'Straight'], ['curved', 'Curved'], ['corner', 'Corner']],
                initialValue: 'straight'
            }),
            name: 'Type',
        }) as PropsInputSelect;

        this.position3Input = this.sceneObject.defineProperty('controlPoint', {
            input: new PropsInputVector({
                onChange: (v) => {
                    this.set({
                        position3: v.c()
                    });
                },
                initialValue: data.position3
            }),
            name: 'Control position'
        }) as PropsInputVector;

        this.sceneObject.defineProperty($.unique, {
            input: new PropsInputSelect<typeof this['data']['style']>({
                onChange: (v) => {
                    this.set({
                        style: v
                    });
                },
                options: [['solid', 'Solid'], ['dashed', 'Dashed']],
                initialValue: 'solid'
            }),
            name: 'Line style',
        }) as PropsInputSelect;

        this.sceneObject.defineProperty($.unique, {
            input: new PropsInputSelect<typeof this['data']['color']>({
                onChange: (v) => {
                    this.set({
                        color: v
                    });
                },
                options: [['black', 'Black'], ['blue', 'Blue'], ['red', 'Red']],
                initialValue: 'black'
            }),
            name: 'Color',
        }) as PropsInputSelect;

        this.tailControlPoint.append(new Mover(this.component.panel, (v) => {
            this.set({
                position: v
            });
        }, 'circle') as Mover);

        this.headControlPoint.append(new Mover(this.component.panel, (v) => {
            this.set({
                position2: v
            });
        }, 'circle') as Mover);
        this.set(data);

        this.midControlPoint.append(new Mover(this.component.panel, (v) => {
            this.set({
                position3: v
            });
        }, 'circle') as Mover);
        
        this.set(data);
    }
    public set(data?: VisualTypeData['arrow']) {
        super.set(data);

        const min = this.data.position.min(this.data.position2);
        const max = this.data.position.max(this.data.position2);
        const size = max.subtract(min);

        this.setPositionStyle(min);
        this.setSizeStyle(size);

        this.svg.setSizeStyle(size);
        this.svg.class(false, 'dashed', 'solid', 'red', 'black', 'blue');
        this.svg.class(true, this.data.color, this.data.style);

        let headAngle;
        if (this.data.type === 'curved') {
            this.svgArrow.setAttribute('d', `M${this.data.position.subtract(min).join(' ')} Q ${this.data.position3.subtract(min).join(' ')}, ${this.data.position2.subtract(min).join(' ')}`);
            headAngle =  this.data.position2.subtract(this.data.position3).angleDegrees()
        } else if (this.data.type === 'corner') {
            this.svgArrow.setAttribute('d', `M${this.data.position.subtract(min).join(' ')} L ${this.data.position3.subtract(min).join(' ')} L${this.data.position2.subtract(min).join(' ')}`);
            headAngle =  this.data.position2.subtract(this.data.position3).angleDegrees()
        } else {
            this.svgArrow.setAttribute('d', `M${this.data.position.subtract(min).join(' ')} L${this.data.position2.subtract(min).join(' ')}`);
            headAngle =  this.data.position2.subtract(this.data.position).angleDegrees()
        }

        this.sceneObject.updatePropertyVisibility('controlPoint',this.data.type !== 'straight' )

        this.tailControlPoint.setPositionStyle(this.data.position.subtract(min));
        this.headControlPoint.setPositionStyle(this.data.position2.subtract(min));
        this.midControlPoint.setPositionStyle(this.data.position3.subtract(min));
        this.midControlPoint.visible = this.data.type !== 'straight';

        this.positionInput.silent(this.data.position);
        this.position2Input.silent(this.data.position2);
        this.position3Input.silent(this.data.position3);
        this.head.setPositionStyle(this.data.position2.subtract(min))
        this.head.setStyle('transform', `rotate(${headAngle - 45}deg)`);
    }
}