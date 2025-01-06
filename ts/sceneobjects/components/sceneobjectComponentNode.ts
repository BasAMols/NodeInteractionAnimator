import { SceneObjectComponent } from './sceneobjectComponent';

export class SceneObjectComponentNode extends SceneObjectComponent<'node'> {
    constructor() {
        super('node');
    }
}