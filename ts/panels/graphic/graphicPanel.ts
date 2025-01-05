import { DomElement } from '../../lib/dom/domElement';
import { Icon, IconProperties } from '../../lib/dom/icon';
import { v2 } from '../../lib/utilities/vector2';
import { SceneObjectComponentVisual } from '../../sceneobjects/components/sceneobjectComponentVisual';
import { CameraPanel } from '../cameraPanel';

export class GraphicPanel extends CameraPanel {
    private _light: boolean = false;
    public icon: IconProperties = Icon.make('animation');
    graphic: DomElement<"div">;
    public get light(): boolean {
        return this._light;
    }
    public set light(value: boolean) {
        this._light = value;
        this.class(value, 'light');
    }
    private components: SceneObjectComponentVisual[] = [];
    constructor() {
        super('graphic', 'Graphic', {
            camera: { contentSize: v2(505, 545), minZoom: 0.1, maxZoom: 5, scrollSpeed: 2 },
            buttons: [{
                key: 'graphic_light',
                type: 'Action',
                design: 'icon',
                icon: Icon.make('light_mode'),
                onClick: () => {
                    this.light = !this.light;
                },
            }]
        });
        this.graphic = this.childCamera('div', {
            className: '_graphic'
        });
        
    }
    clear() {
        this.components.forEach((v)=>{
            v.delete();
            this.components.splice(this.components.indexOf(v), 1)
        });
    }
    update(d: SceneObjectComponentVisual[]) {
        const rem:SceneObjectComponentVisual[] = [...this.components]
        const add:SceneObjectComponentVisual[] = []
        d.forEach((v)=>{
            if (this.components.includes(v)){
                v.update()
                rem.splice(rem.indexOf(v), 1)
            } else {
                add.push(v)
            }
        })
        if (rem.length > 0){
            rem.forEach((v)=>{
                v.delete()
                this.components.splice(this.components.indexOf(v), 1)
            })
        }
        if (add.length > 0){
            add.forEach((v)=>{
                v.add(this.graphic);
                this.components.push(v)
            })
        }
    }
}