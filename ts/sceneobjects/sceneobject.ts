import { GraphicPanel } from '../panels/graphic/graphicPanel';
import { SceneObjectComponentNode } from './components/sceneobjectComponentNode';
import { SceneObjectComponentOutline } from './components/sceneobjectComponentOutline';
import { SceneObjectComponentProperties } from './components/sceneobjectComponentProperties';
import { SceneObjectComponentTimeline } from './components/sceneobjectComponentTimeline';
import { SceneObjectComponentVisual, SceneObjectComponentVisualAttr } from './components/sceneobjectComponentVisual';

export interface SceneObjectAttr {
    key: string,
    name?: string,
    visual: SceneObjectComponentVisualAttr;
}
export class SceneObject {
    active: boolean = true;
    name: string = '';
    private _selected: boolean = false;
    public get selected(): boolean {
        return this._selected;
    }
    public set selected(value: boolean) {
        if (this._selected !== value) {
            this._selected = value;
            Object.values(this.components).forEach((c) => c.selected = value);
        }
    }
    key: string;

    public properties: Record<string, {
        name: string,
        value: string,
        type: string,
    }> = {};

    public get defineProperty(): SceneObjectComponentProperties['add'] {
        return this.components.properties.add.bind(this.components.properties);
    }
    public get undefineProperty(): SceneObjectComponentProperties['remove'] {
        return this.components.properties.remove.bind(this.components.properties);
    }
    public get updateProperty(): SceneObjectComponentProperties['update'] {
        return this.components.properties.update.bind(this.components.properties);
    }

    components: {
        visual: SceneObjectComponentVisual,
        node: SceneObjectComponentNode,
        properties: SceneObjectComponentProperties,
        outline: SceneObjectComponentOutline;
        timeline?: SceneObjectComponentTimeline;
    };

    public visualPanel: GraphicPanel;

    constructor({ key, visual, name }: SceneObjectAttr) {
        this.key = key;
        this.name = name || '';
        this.createComponents(visual);
    }

    createComponents(visual?: SceneObjectComponentVisualAttr) {

        this.components = {
            visual: new SceneObjectComponentVisual(visual),
            node: new SceneObjectComponentNode({ key: $.unique }),
            properties: new SceneObjectComponentProperties({ key: $.unique }),
            outline: new SceneObjectComponentOutline({ key: $.unique })
        };

        Object.values(this.components).forEach((c) => {
            c.sceneObject = this;
            c.selected = this.selected;
        });
    }
    resize() {
        Object.values(this.components).forEach((c) => {
            c.resize();
        });
    }
    delete() {
        Object.values(this.components).forEach((c) => {
            c.delete();
        });
    }
    focus() {
        $.scene.focus(this);
    }
    build() {
        Object.values(this.components).forEach((c) => {
            c.sceneObject = this;
        });

        this.components['outline'].build();
        this.components['properties'].build();
        this.components['visual'].build();
        this.components['node'].build();
        this.components['outline'].build();
        this.components['timeline']?.build();
    }
}
