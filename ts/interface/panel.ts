import { DomElement } from '../lib/dom/domElement';

export class Panel extends DomElement<'div'> {
    protected content: DomElement<"div">;
    protected header: DomElement<"div">;
    public size: [number,number] = [0,0]
    constructor(public readonly id: string, public readonly name: string) {
        super('div', {
            className: `panel`,
            id
        })
        this.header = this.child('div', {
            className: 'panelHeader'
        });
        this.content = this.child('div', {
            className: 'panelContent'
        });
    }
    public resize() {
        const {width, height} = this.content.domElement.getBoundingClientRect();
        this.size = [width, height];
    }
}