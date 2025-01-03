import { SceneObject } from '../sceneobject';

/**
 * Manages all sceneobjects that are used across the interface.
 * @access This class is globally accesible using `$.sceneobjects`.
 */
export class SceneObjectManager {

    private sceneobjects: Record<string, SceneObject>;
    constructor() {

    }
    /** 
     * Adds a `SceneObject` to the scene 
    */
    public add(n: SceneObject) {
        this.sceneobjects[n.key] = n;
        
    }

    /** 
     * Removes a `SceneObject` to the scene 
     * @remarks This method will call the {@link SceneObject.delete() `delete()`} method on the sceneobject to ensure neat deletion. 
    */
    public remove(n: SceneObject) {
        if (!this.sceneobjects[n.key]) return;
        n.delete();
        delete this.sceneobjects[n.key];
    }

    /** 
     * Handle a resizing window.
     * @remarks This method will call the {@link SceneObject.resize() `resize()`} method on all {@link SceneObject `sceneobjects`} in the scene. 
    */
    public resize() {
        Object.values(this.sceneobjects).forEach((n) => {
            n.resize();
        });
    }

    /** 
     * Empty all {@link SceneObject `sceneobjects`} from the scene.
     * @remarks This method will call the {@link SceneObjectManager.remove() `remove()`} method on all {@link SceneObject sceneobjects} in the scene. 
    */
    public clear() {
        Object.values(this.sceneobjects).forEach((n) => {
            this.remove(n);
        });
    }

    /** 
     * Bulk add multple {@link SceneObject `sceneobjects`} to the scene.
     * @remarks Often used for importing an entire scene
     * @param clear Should the {@link SceneObjectManager.clear() `clear()`} method be run to empty the scene? 
    */
    public bulk(clear: boolean, n: SceneObject[]) {
        if (clear) this.clear()
        n.forEach((s) => {
            this.add(s);
        });
    }
}
