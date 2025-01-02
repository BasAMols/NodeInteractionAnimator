import { Icon, IconProperties } from '../../lib/dom/icon';
import { v2 } from '../../lib/utilities/vector2';
import { SceneObjectComponent } from '../../sceneobjects/components/sceneobjectComponent';
import { CameraPanel } from '../cameraPanel';

export class GraphicPanel extends CameraPanel {
    private _light: boolean = false;
    public icon: IconProperties = Icon.make('animation');
    public get light(): boolean {
        return this._light;
    }
    public set light(value: boolean) {
        this._light = value;
        this.class(value, 'light');
    }
    constructor() {
        super('graphic', 'Graphic', {
            camera: { contentSize: v2(505, 545), minZoom: 0.1, maxZoom: 5, scrollSpeed: 2 },
            buttons: [{
                className: 'panelMenu',
                key: 'graphic_light',
                type: 'Action',
                design: 'icon',
                icon: Icon.make('light_mode'),
                onClick: () => {
                    this.light = !this.light;
                },
            }]
        });
        this.childCamera('div', {
            className: '_graphic'
        });
        
    }
    update(d: SceneObjectComponent<"visual">[]) {
        console.log(d);
        
    }

}