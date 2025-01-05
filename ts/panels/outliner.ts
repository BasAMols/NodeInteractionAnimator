import { Panel } from '../interface/panel';
import { IconProperties, Icon } from '../lib/dom/icon';
import { SceneObject } from '../sceneobjects/sceneobject';

export class OutlinerPanel extends Panel {
    public icon: IconProperties = Icon.make('summarize');

    constructor() {
        super('outliner', 'Outliner');
    }
    empty() {
        this.content.domElement.innerHTML = '';
    }
    addLine(o: SceneObject) {
        this.content.append(o.components.outline.element);
    }
    update(data: SceneObject[]) {
        this.empty();
        data.forEach((s)=>{
            this.addLine(s)
        })
    }
}