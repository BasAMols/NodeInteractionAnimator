import { Panel } from '../../interface/panel';
import { IconProperties, Icon } from '../../lib/dom/icon';
import { SceneObjectComponentProperties } from '../../sceneobjects/components/sceneobjectComponentProperties';

export class PropertiesPanel extends Panel {
    
    public icon: IconProperties = Icon.make('tune');
    public active: SceneObjectComponentProperties

    constructor() {
        super('properties', 'Properties');
    }

    update(p?: SceneObjectComponentProperties) {
        if (this.active) {
            this.content.remove(this.active.element)
            this.active = undefined;
        }
        if (p) {
            this.content.append(p.element)
            this.active = p
        }
    }
}