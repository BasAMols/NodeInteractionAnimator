import { GraphicPanel } from '../panels/graphic/graphicPanel';
import { SceneObjectComponent, SceneObjectComponentDict } from './components/sceneobjectComponent';
import { SceneObjectComponentOutline } from './components/sceneobjectComponentOutline';

export interface SceneObjectAttr {
    key: string,
    components?: SceneObjectComponent[];
}
export class SceneObject {
    active: boolean = true;
    private _selected: boolean = false;
    public get selected(): boolean {
        return this._selected;
    }
    public set selected(value: boolean) {
        if (this._selected !== value) {
            this._selected = value;
            this.components.forEach((c) => c.selected = value);
        }
    }
    key: string;
    components: SceneObjectComponent[] = [new SceneObjectComponentOutline({key: $.unique})];
    public visualPanel: GraphicPanel;

    constructor({ key, components = [] }: SceneObjectAttr) {
        this.key = key;
        this.assign(components);
    }

    getComponentsByType<T extends keyof SceneObjectComponentDict>(type: T): SceneObjectComponentDict[T][] {
        return this.components.filter((c) => c.type === type) as (SceneObjectComponentDict[T])[];
    }

    assign(components: SceneObjectComponent[]) {
        components.forEach((c) => {
            this.components.push(c);
            c.sceneObject = this;
            c.selected = this.selected;
        });
    }
    resize() {
        this.components.forEach((c) => {
            c.resize();
        });
    }
    clear() {
        this.components.forEach((c) => {
            if (c.type !== 'outline') c.delete();
        });
        this.components = [];
    }
    delete() {
        this.clear();
    }
    focus() {
        $.scene.focus(this);
    }
    build() {
        this.components.forEach((c) => {
            c.sceneObject = this;
            c.build();
        });
    }
}
