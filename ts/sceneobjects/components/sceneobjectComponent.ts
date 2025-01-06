import { SceneObject } from '../sceneobject';
import { SceneObjectComponentNode } from './sceneobjectComponentNode';
import { SceneObjectComponentOutline } from './sceneobjectComponentOutline';
import { SceneObjectComponentProperties } from './sceneobjectComponentProperties';
import { SceneObjectComponentTimeline } from './sceneobjectComponentTimeline';
import { SceneObjectComponentVisual } from './sceneobjectComponentVisual';

export interface SceneObjectComponentDict {
    timeline: SceneObjectComponentTimeline;
    node: SceneObjectComponentNode;
    properties: SceneObjectComponentProperties;
    visual: SceneObjectComponentVisual;
    outline: SceneObjectComponentOutline;
}
export class SceneObjectComponent<T extends keyof SceneObjectComponentDict = keyof SceneObjectComponentDict> {
    sceneObject: SceneObject;

    private _selected: boolean = false;
    public get selected(): boolean {
        return this._selected;
    }
    public set selected(value: boolean) {
        if (this._selected !== value) {
            this._selected = value;
            this.updateState();
        }
    }

    protected updateState() {

    }

    key: string;
    type: T;

    constructor(type: T) {
        this.type = type;
        this.key = $.unique;
    }

    build() {

    }
    resize() {
        //void
    }
    delete() {
    }
}
