import { Panel } from '../interface/panel';
import { DomElementProperties, DomElement } from '../lib/dom/domElement';
import { Vector2 } from '../lib/utilities/vector2';
import { Camera } from './utils/camera';

export abstract class CameraPanel extends Panel {
    private camera: Camera;
    constructor(id: string, name: string, cameraSize: Vector2) {
        super(id,name);
        this.camera = this.content.append(new Camera(this, cameraSize, false)) as Camera;
    }
    public childCamera<T3 extends keyof HTMLElementTagNameMap>(type: T3, properties?: DomElementProperties): DomElement<T3> {
        return this.appendCamera(new DomElement(type,properties))
    }
    public appendCamera<T2 extends keyof HTMLElementTagNameMap>(d: DomElement<T2>): DomElement<T2> {
        return this.camera.content.append(d)
    }
    public resize(): void {
        super.resize();
        this.camera?.resize();
    }
}