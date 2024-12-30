import { DomElement } from '../dom/domElement';

export class Panel extends DomElement<'div'> {
    constructor(public readonly id: string, public readonly name: string) {
        super('div', {
            className: `panel`,
            id
        })
        this.child('div', {
            text: name,
            style: {
                'font-size': '20px',
                'color': 'white'
            }
        })
    }
}