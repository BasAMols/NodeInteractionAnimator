import { DomElement } from '../lib/dom/domElement';
import { IconProperties } from '../lib/dom/icon';
import { Menu } from './menu';

export class Panel extends DomElement<'div'> {
    protected content: DomElement<"div">;
    protected header: DomElement<"div">;
    public size: [number, number] = [0, 0];
    public icon: IconProperties|undefined;
    protected menu: Menu;
    constructor(public readonly id: string, public readonly name: string) {
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
        this.menu = this.header.append(new Menu()) as Menu;
    }
    public resize() {
        const { width, height } = this.content.domElement.getBoundingClientRect();
        this.size = [width, height];
    }
}