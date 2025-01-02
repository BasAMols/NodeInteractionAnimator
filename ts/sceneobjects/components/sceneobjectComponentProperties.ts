import { SceneObjectComponentAttr, SceneObjectComponent } from './sceneobjectComponent';

export interface SceneObjectComponentPropertiesAttr extends SceneObjectComponentAttr {

}
export class SceneObjectComponentProperties extends SceneObjectComponent<'properties'> {
    constructor(attr: SceneObjectComponentPropertiesAttr) {
        super('properties', attr);
    }
}