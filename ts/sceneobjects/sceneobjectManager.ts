import { GraphicPanel } from '../panels/graphic/graphicPanel';
import { NodeEditorPanel } from '../panels/node/nodePanel';
import { OutlinerPanel } from '../panels/outliner';
import { PropertiesPanel } from '../panels/properties';
import { TimelinePanel } from '../panels/timeline';
import { SceneObjectComponentDict, SceneObjectComponent } from './components/sceneobjectComponent';
import { SceneObject } from './sceneobject';


export interface SceneObjectManagerPanels { 
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
    constructor(private panels: SceneObjectManagerPanels) {

    }
    /** 
     * Adds a `SceneObject` to the scene 
     * @return Returns the `SceneObject`
    */
    public add(n: SceneObject) {
        this.sceneObjects[n.key] = n;
        n.build();
        return n;
    }

    /** 
     * Removes a `SceneObject` to the scene 
     * @remarks This method will call the {@link SceneObject.delete() `delete()`} method on the sceneobject to ensure neat deletion. 
    */
    public remove(n: SceneObject) {
        if (!this.sceneObjects[n.key]) return;
        n.delete();
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
     * Bulk add multple {@link SceneObject `sceneObjects`} to the scene.
     * @remarks Often used for importing an entire scene
     * @param clear Should the {@link SceneObjectManager.clear() `clear()`} method be run to empty the scene? 
    */
    public bulk(clear: boolean) {
        if (clear) this.clear();
        Object.values(this.sceneObjects).forEach((n) => {
            this.remove(n);
        });
    }

    public getComponentsByType<T extends keyof SceneObjectComponentDict>(type: T): SceneObjectComponent<T>[] {
        return Object.values(this.sceneObjects).map((so)=>so.getComponentsByType(type)).flat(1)
    }

    public update<T extends keyof SceneObjectComponentDict>(type: T) {
        if (type === 'visual') this.panels.graphic.update(this.getComponentsByType(type as 'visual'));
    }
}
