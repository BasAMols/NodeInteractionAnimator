import { DomElement } from '../../lib/dom/domElement';
import { Vector2 } from '../../lib/utilities/vector2';
import { SceneObjectComponentAttr, SceneObjectComponent } from './sceneobjectComponent';

export abstract class VisualAsset<T extends keyof SceneObjectComponentVisual['dict'] = any> extends DomElement<'div'> {
    data: {
        visualType: T;
    };
    constructor(data: VisualAsset['data']) {
        super('div', {
            className: `visual visual_${data.visualType}`,
        });
        this.data = data;
    }
}
export class VisualImage extends VisualAsset<'image'> {
    data: {
        visualType: 'image';
        size: Vector2;
        url?: string;
    };
    constructor(data: VisualImage['data']) {
        super(data);
        this.set(data);
    }

    set(d: VisualImage['data'] = this.data) {
        this.data = d;
        this.setStyle('width', `${this.data.size.x}px`);
        this.setStyle('height', `${this.data.size.y}px`);
        this.setStyle('background-image', `url(${this.data.url ?? `https://placeholder.pics/svg/${this.data.size.x}x${this.data.size.y}/49514E-3A3247/FFFFFF-FFFFFF/%20placeholder`})`);
    }
}

export interface SceneObjectComponentVisualAttr extends SceneObjectComponentAttr {
    position: Vector2;
    asset: VisualImage['data'];
}
export type VisualTypes = 'image';
export class SceneObjectComponentVisual extends SceneObjectComponent<'visual'> {
    private dict: {
        'image': typeof VisualImage;
    } = {
        image: VisualImage
    };

    public element: DomElement<"span">;
    public readonly visualType: SceneObjectComponentVisualAttr['asset']['visualType'];
    constructor(attr: SceneObjectComponentVisualAttr) {
        super('visual', attr);

        this.element = new DomElement('span', {
            className: 'SceneObjectVisual'
        });

        this.visualType = attr.asset.visualType;
        this.element.append(new (this.dict[this.visualType])(attr.asset));

        this.setPosition(attr.position);
    }
    build(): void {
        super.build();
    }
    add(parent: DomElement) {
        this.delete();
        parent.append(this.element);
    }
    delete(): void {
        if (this.element.domElement.parentElement) {
            this.element.domElement.parentElement.removeChild(this.element.domElement);
        }
    }
    setPosition(v: Vector2) {
        this.element.setStyle('left', `${v[0]}px`);
        this.element.setStyle('top', `${v[1]}px`);
    }
}