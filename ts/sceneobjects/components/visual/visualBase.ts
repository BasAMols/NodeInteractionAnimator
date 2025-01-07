import { DomElement } from '../../../lib/dom/domElement';
import { SceneObject } from '../../sceneobject';
import { VisualTypeKeys, VisualTypeData, SceneObjectComponentVisual } from '../sceneobjectComponentVisual';

export class Visual<T extends VisualTypeKeys> extends DomElement<'div'> {
    protected visual: DomElement<'div'>;

    public visualType: T;
    public data: VisualTypeData[T];
    protected sceneObject: SceneObject;
    protected component: SceneObjectComponentVisual;
    constructor(type: T, sceneObject: SceneObject, component: SceneObjectComponentVisual) {
        super('div', {
            className: 'SceneObjectVisual',
            onClick: ()=>{this.sceneObject.focus()}
        });
        this.visual = this.child('div', {
            className: `visual visual_${type}`,
        });
        this.component = component;
        this.sceneObject = sceneObject;
    }
    public set(data?: VisualTypeData[T]) {
        Object.assign(this.data, data);
    }
}