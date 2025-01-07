import { DomElement } from '../../../lib/dom/domElement';
import { PropsInput } from '../../../panels/properties/propsInput';
import { SceneObject } from '../../sceneobject';
import { VisualTypeKeys, VisualTypeData, SceneObjectComponentVisual } from '../sceneobjectComponentVisual';

export class Visual<T extends VisualTypeKeys> extends DomElement<'div'> {
    protected visual: DomElement<'div'>;

    public visualType: T;
    public data: VisualTypeData[T];
    protected sceneObject: SceneObject;
    protected component: SceneObjectComponentVisual;
    constructor(type: T, sceneObject: SceneObject, component: SceneObjectComponentVisual, settings?: {
        key?: string;
        name?: string,
        input: PropsInput,
    }[]) {
        super('div', {
            className: 'SceneObjectVisual editorUi',
            onClick: () => { this.sceneObject.focus(); }
        });
        this.visual = this.child('div', {
            className: `visual visual_${type}`,
        });
        this.component = component;
        this.sceneObject = sceneObject;
        if (settings) this.sceneObject.defineProperties(settings)
    }
    public set(data?: VisualTypeData[T]) {
        Object.assign(this.data, data);
    }
}