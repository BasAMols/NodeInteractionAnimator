import { GraphicPanel } from '../panels/graphic/graphicPanel';
import { SceneObjectComponent, SceneObjectComponentDict } from './components/sceneobjectComponent';

export interface SceneObjectAttr {
    key: string,
    components?: SceneObjectComponent[];
}
export class SceneObject {
    active: boolean = true;
    selected: boolean = false;
    key: string;
    components: SceneObjectComponent[] = [];
    public visualPanel: GraphicPanel;

    constructor({ key, components = [] }: SceneObjectAttr) {
        this.key = key;
        this.assign(components);
    }

    getComponentsByType<T extends keyof SceneObjectComponentDict>(type: T): SceneObjectComponentDict[T][] {
        return this.components.filter((c)=>c.type === type) as (SceneObjectComponentDict[T])[]
    } 

    assign(components: SceneObjectComponent[]) {
        components.forEach((c) => {
            this.components.push(c);
            c.sceneObject = this;
        });
    }
    resize() {
        this.components.forEach((c) => {
            c.resize();
        });
    }
    clear() {
        this.components.forEach((c) => {
            c.delete();
        });
        this.components = [];
    }
    delete() {
        this.clear();
    }
    build() {
        this.components.forEach((c) => {
            c.sceneObject = this;
            c.build();
        });
    }
}
