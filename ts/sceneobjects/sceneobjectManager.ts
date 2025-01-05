import { GraphicPanel } from '../panels/graphic/graphicPanel';
import { ViewerPanel } from '../panels/graphic/viewerPanel';
import { NodeEditorPanel } from '../panels/node/nodePanel';
import { OutlinerPanel } from '../panels/outliner';
import { PropertiesPanel } from '../panels/properties/propertiesPanel';
import { TimelinePanel } from '../panels/timeline';
import { SceneObjectComponentDict } from './components/sceneobjectComponent';
import { SceneObjectComponentProperties } from './components/sceneobjectComponentProperties';
import { SceneObject, SceneObjectAttr } from './sceneobject';


export interface SceneObjectManagerPanels {
    viewer: ViewerPanel,
    graphic: GraphicPanel,
    properties: PropertiesPanel,
    node: NodeEditorPanel,
    timeline: TimelinePanel,
    outliner: OutlinerPanel,
}
/**
 * Manages all sceneObjects that are used across the interface.
 * @access This class is globally accesible using `$.scene`.
 */
export class SceneObjectManager {

    private sceneObjects: Record<string, SceneObject> = {};
    public selected: SceneObject;
    constructor(private panels: SceneObjectManagerPanels) {

    }
    /** 
     * Adds a `SceneObject` to the scene 
     * @return Returns the `SceneObject`
    */
    public add(n: SceneObjectAttr) {
        if (!n) return;
        const d = new SceneObject(n);
        this.sceneObjects[n.key] = d;
        d.build();

        return n;
    }

    /** 
     * Removes a `SceneObject` to the scene 
     * @remarks This method will call the {@link SceneObject.delete() `delete()`} method on the sceneobject to ensure neat deletion. 
    */
    public remove(n: SceneObject) {
        if (!n || !this.sceneObjects[n.key]) return;
        n.delete();
        if (n === this.selected) this.focus();
        delete this.sceneObjects[n.key];
    }

    /** 
     * Handle a resizing window.
     * @remarks This method will call the {@link SceneObject.resize() `resize()`} method on all {@link SceneObject `sceneObjects`} in the scene. 
    */
    public resize() {
        Object.values(this.sceneObjects).forEach((n) => {
            n.resize();
        });
    }

    /** 
     * Empty all {@link SceneObject `sceneObjects`} from the scene.
     * @remarks This method will call the {@link SceneObjectManager.remove() `remove()`} method on all {@link SceneObject sceneObjects} in the scene. 
    */
    public clear() {
        Object.values(this.sceneObjects).forEach((n) => {
            this.remove(n);
        });
    }

    /** 
     * Bulk creates and adds multple {@link SceneObject `sceneObjects`} to the scene.
     * @remarks Often used for importing an entire scene
     * @param clear Should the {@link SceneObjectManager.clear() `clear()`} method be run to empty the scene? 
    */
    public bulk(v: SceneObjectAttr[], clear: boolean = false) {
        if (clear) this.clear();
        v.forEach((n) => {
            this.add(n);
        });
    }

    public focus(s?: SceneObject) {
        this.selected = undefined;
        Object.values(this.sceneObjects).forEach((n) => {
            n.selected = n === s;
            if (n.selected) this.selected = n;
        });
        $.state[this.selected ? 'set' : 'unset']('selected');
    }

    public getComponentsByType<T extends keyof SceneObject['components']>(type: T): SceneObject['components'][T][] {
        return Object.values(this.sceneObjects).map((so) => so.components[type]);
    }

    public update<T extends keyof SceneObjectComponentDict>(type: T | 'all' = 'all') {
        this.panels.outliner.update(Object.values(this.sceneObjects));
        if (type === 'visual' || type === 'all') {
            this.panels.viewer.update(this.getComponentsByType('visual'));
            this.panels.graphic.update(this.getComponentsByType('visual'));
        }
        if (type === 'properties' || type === 'all') {
            this.panels.properties.update(this.getComponentsByType('properties')[0] as SceneObjectComponentProperties);
        }
    }
    public keyExists(n: string) {
        return Boolean(this.sceneObjects[n]);
    }
}
