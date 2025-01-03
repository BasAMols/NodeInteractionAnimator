import { SceneObjectComponentAttr, SceneObjectComponent } from './sceneobjectComponent';

export interface SceneObjectComponentNodeAttr extends SceneObjectComponentAttr {

}
export class SceneObjectComponentNode extends SceneObjectComponent<'node'> {
    constructor(attr: SceneObjectComponentNodeAttr) {
        super('node', attr);
    }
}