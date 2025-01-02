import { Panel } from '../interface/panel';
import { IconProperties, Icon } from '../lib/dom/icon';

export class OutlinerPanel extends Panel {
        public icon: IconProperties = Icon.make('summarize');
    
    constructor() {
        super('outliner', 'Outliner');
    }
}