import { DomElement } from '../../lib/dom/domElement';
import { Vector2 } from '../../lib/utilities/vector2';
import { SceneObjectComponentAttr, SceneObjectComponent } from './sceneobjectComponent';

export interface SceneObjectComponentVisualAttr extends SceneObjectComponentAttr {
    position: Vector2;
}
export class SceneObjectComponentVisual extends SceneObjectComponent<'visual'> {
    public element: DomElement<"span">;
    constructor(attr: SceneObjectComponentVisualAttr) {
        super('visual', attr);

        this.element = new DomElement('span', {
            className: 'SceneObjectVisual'
        })

        this.setPosition(attr.position);
    }
    build(): void {
        super.build();
    }
    delete(): void {
        if (this.element.domElement.parentElement){
            this.element.domElement.parentElement.removeChild(this.element.domElement)
        }
    }
    setPosition(v: Vector2){
        this.element.setStyle('left', `${v[0]}px`);
        this.element.setStyle('top', `${v[1]}px`);
    }
}