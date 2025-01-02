import { SceneObjectComponentAttr, SceneObjectComponent } from './sceneobjectComponent';

export interface SceneObjectComponentNodeAttr extends SceneObjectComponentAttr {

}
export class SceneObjectComponentNode extends SceneObjectComponent<'sceneobject'> {
    constructor(attr: SceneObjectComponentNodeAttr) {
        super('sceneobject', attr);
    }
}