import { DomElement } from '../../lib/dom/domElement';
import { Icon } from '../../lib/dom/icon';
import { SceneObject, SceneObjectAttr } from '../../sceneobjects/sceneobject';

export interface LibraryItemAttr {
    key: string,
    name: string,
    image: string|Icon,
    content: SceneObjectAttr[]
}
export class LibraryItem extends DomElement<'div'>{
    constructor(attr: LibraryItemAttr) {
        super('div', {
            className: 'library_item',
            onClick: ()=> {
                attr.content.forEach((s)=>{
                    const attr:SceneObjectAttr = {...s, 
                        key: $.scene.keyExists(s.key)?$.unique:s.key
                    }
                    $.scene.add(new SceneObject(attr));
                })
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