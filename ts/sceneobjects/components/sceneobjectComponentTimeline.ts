import { SceneObjectComponentAttr, SceneObjectComponent } from './sceneobjectComponent';

export interface SceneObjectComponentTimelineAttr extends SceneObjectComponentAttr {

}
export class SceneObjectComponentTimeline extends SceneObjectComponent<'timeline'> {
    constructor(attr: SceneObjectComponentTimelineAttr) {
        super('timeline', attr);
    }
}