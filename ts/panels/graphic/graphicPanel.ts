import { DomElement } from '../../lib/dom/domElement';
import { Icon, IconProperties } from '../../lib/dom/icon';
import { v2 } from '../../lib/utilities/vector2';
import { SceneObjectComponentVisual } from '../../sceneobjects/components/sceneobjectComponentVisual';
import { CameraPanel } from '../cameraPanel';

export class GraphicPanel extends CameraPanel {
    public icon: IconProperties = Icon.make('animation');
    public graphic: DomElement<"div">;


    private _light: boolean = false;
    public get light(): boolean {
        return this._light;
    }
    public set light(value: boolean) {
        this._light = value;
        this.class(value, 'light');
        this.menu.getButton('graphic_light').button.active = value;

    }


    private _preview: boolean = false;
    public get preview(): boolean {
        return this._preview;
    }
    public set preview(value: boolean) {
        this._preview = value;
        this.class(value, 'preview');
        this.menu.getButton('graphic_preview').button.active = value;
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
            },
            {
                key: 'graphic_preview',
                type: 'Action',
                design: 'icon',
                icon: Icon.make('view_in_ar'),
                onClick: () => {
                    this.preview = !this.preview;
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