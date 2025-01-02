import { DomElement } from '../lib/dom/domElement';
import { IconProperties } from '../lib/dom/icon';
import { v2, Vector2 } from '../lib/utilities/vector2';
import { Menu, MenuButton } from './menu';

export interface PanelAttr {
    buttons?: MenuButton[],
}
export class Panel extends DomElement<'div'> {
    protected content: DomElement<"div">;
    protected header: DomElement<"div">;
    public size: Vector2 = v2(0);
    public icon: IconProperties|undefined;
    protected menu: Menu;
    constructor(public readonly id: string, public readonly name: string, attr: PanelAttr = {} ) {
        super('div', {
            className: `panel`,
            id
        });
        this.header = this.child('div', {
            className: 'panelHeader'
        });
        this.content = this.child('div', {
            className: 'panelContent'
        });
        this.menu = this.header.append(new Menu(attr.buttons)) as Menu;
    }
    public resize() {
        const { width, height } = this.content.domElement.getBoundingClientRect();
        this.size = v2(width, height);
    }
    public build() {
        this.resize();
    }
}