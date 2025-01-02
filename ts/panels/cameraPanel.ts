import { Panel, PanelAttr } from '../interface/panel';
import { DomElementProperties, DomElement } from '../lib/dom/domElement';
import { Icon } from '../lib/dom/icon';
import { Camera, CameraProps } from './utils/camera';

export interface CameraPanelAttr extends PanelAttr {
    camera?: CameraProps,
}
export abstract class CameraPanel extends Panel {
    protected camera: Camera;
    constructor(id: string, name: string, attr: CameraPanelAttr = {}) {
        super(id, name, {
            ...attr,
            ...{buttons: [{
                className: 'panelMenu',
                key: 'graphic_center',
                type: 'Action',
                design: 'icon',
                icon: Icon.make('recenter'),
                onClick: () => {
                    this.camera.center();
                },
            }, ...attr.buttons || []]}
        });
        this.camera = this.content.append(new Camera(this, attr.camera || {})) as Camera;
    }
    public childCamera<T3 extends keyof HTMLElementTagNameMap>(type: T3, properties?: DomElementProperties): DomElement<T3> {
        return this.appendCamera(new DomElement(type, properties));
    }
    public appendCamera<T2 extends keyof HTMLElementTagNameMap>(d: DomElement<T2>): DomElement<T2> {
        return this.camera.content.append(d);
    }
    public resize(): void {
        super.resize();
        this.camera?.resize();
    }
    build() {
        this.camera.center();
    }
}