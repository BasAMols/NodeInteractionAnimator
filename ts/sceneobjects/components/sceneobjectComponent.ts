import { SceneObject } from '../sceneobject';
import { SceneObjectComponentNodeAttr } from './sceneobjectComponentNode';
import { SceneObjectComponentPropertiesAttr } from './sceneobjectComponentProperties';
import { SceneObjectComponentTimelineAttr } from './sceneobjectComponentTimeline';
import { SceneObjectComponentVisualAttr } from './sceneobjectComponentVisual';

export interface SceneObjectComponentDict {
    timeline: SceneObjectComponentTimelineAttr;
    sceneObject: SceneObjectComponentNodeAttr;
    properties: SceneObjectComponentPropertiesAttr;
    visual: SceneObjectComponentVisualAttr;
}
export interface SceneObjectComponentAttr {
    key: string;
}

export class SceneObjectComponent<T extends keyof SceneObjectComponentDict = keyof SceneObjectComponentDict> {
    sceneObject: SceneObject;
    key: string;
    type: T;

    constructor(type: T, { key }: SceneObjectComponentDict[T]) {
        this.type = type;
        this.key = key;
    }

    build() {

    }
    resize() {
        //void
    }
    delete() {
    }
}
