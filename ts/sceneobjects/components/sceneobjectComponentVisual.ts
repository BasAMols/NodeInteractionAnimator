import { DomElement } from '../../lib/dom/domElement';
import { GraphicPanel } from '../../panels/graphic/graphicPanel';
import { SceneObjectComponent } from './sceneobjectComponent';
import { VisualArrow, VisualTypeDataArrow } from './visual/visualArrow';
import { VisualCallout, VisualTypeDataCallout } from './visual/visualCallout';
import { VisualImage, VisualTypeDataImage } from './visual/visualImage';
import { VisualText, VisualTypeDataText } from './visual/visualText';

export type VisualTypeData = {
    'text': VisualTypeDataText,
    'image': VisualTypeDataImage;
    'callout': VisualTypeDataCallout;
    'arrow': VisualTypeDataArrow;
};

export type VisualTypeKeys = keyof VisualTypeData;
export type VisualType = VisualTypeData[VisualTypeKeys];

export const VisualTypeDictionary = {
    image: VisualImage,
    text: VisualText,
    callout: VisualCallout,
    arrow: VisualArrow,
};

export class SceneObjectComponentVisual<T extends VisualTypeKeys = VisualTypeKeys> extends SceneObjectComponent<'visual'> {
    private element: InstanceType<typeof VisualTypeDictionary[T]>;
    public panel: GraphicPanel;
    private parent: DomElement<keyof HTMLElementTagNameMap>;
    private toBuild: [VisualTypeData[T], typeof VisualTypeDictionary[T]];

    protected updateState() {
        super.updateState();
        this.element.class(this.selected, 'selected');
    }

    constructor(type: T, data: VisualTypeData[T]) {
        super('visual');
        this.toBuild = [data, VisualTypeDictionary[type]];
    }

    build(): void {
        super.build();
        if (!this.toBuild) return;
        this.panel = $.panels.getPanel('graphic') as GraphicPanel;
        this.element = new (this.toBuild[1] as typeof VisualTypeDictionary[T])(this.toBuild[0], this.sceneObject, this) as InstanceType<typeof VisualTypeDictionary[T]>;
        this.toBuild = undefined;
    }
    add(parent: DomElement) {
        this.delete();
        this.parent = parent;
        this.parent.append(this.element);
    }
    delete(): void {
        super.delete();
        if (this.parent) {
            this.parent.remove(this.element);
        }
    }
    update() {
        this.element.set();
    }
}