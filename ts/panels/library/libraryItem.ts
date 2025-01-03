import { DomElement } from '../../lib/dom/domElement';
import { Icon } from '../../lib/dom/icon';

export interface LibraryItemAttr {
    key: string,
    name: string,
    image: string|Icon
}
export class LibraryItem extends DomElement<'div'>{
    constructor(attr: LibraryItemAttr) {
        super('div', {
            className: 'library_item',
            onClick: ()=> {

            }
        })
        if (typeof attr.image === 'string'){
            this.child('div', {className:'library_item_image', style: {
                'background-image':`url(${attr.image})` 
            }})
        } else {
            this.append(attr.image);
        }
        this.child('div', {className:'library_item_name', text: attr.name})
    }
}