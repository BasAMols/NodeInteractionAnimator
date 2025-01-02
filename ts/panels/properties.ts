import { Panel } from '../interface/panel';
import { IconProperties, Icon } from '../lib/dom/icon';

export class PropertiesPanel extends Panel {
    
    public icon: IconProperties = Icon.make('tune');

    constructor() {
        super('properties', 'Properties');
    }
}