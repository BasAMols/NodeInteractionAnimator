import { DomElement } from '../../lib/dom/domElement';
import { PropsInput } from '../../panels/properties/propsInput';
import { SceneObjectComponentAttr, SceneObjectComponent } from './sceneobjectComponent';

export interface SceneObjectComponentPropertiesAttr extends SceneObjectComponentAttr {

}
export class SceneObjectComponentProperties extends SceneObjectComponent<'properties'> {
    public element: DomElement<'div'>;
    public data: Record<string, {
        name?: string,
        input: PropsInput,
        element: DomElement<'div'>;
    }> = {};

    constructor(attr: SceneObjectComponentPropertiesAttr) {
        super('properties', attr);

        this.element = new DomElement('div', {
            className: 'props'
        });
    }

    add(key: string, data: {
        name?: string,
        input: PropsInput,
    }): typeof data['input'] {
        if (this.data[key]) return; 
        const el = new DomElement('div', {className: 'prop'});
        this.element.append(el);
        if (data.name) el.child('label', {
            text: data.name,
            className: 'props_label'
        })
        el.append(data.input)
        this.data[key] = {
            ...data,
            ...{
                element: el
            }
        };
        return data.input
    }

    remove(key: string) {
        if (this.data[key]) {
            this.element.remove(this.data[key].element);
            delete this.data[key]
        }
    }

    update(key: string, obj: {
        name?: string,
        value?: string,
    }) {
        Object.assign(this.data[key], obj);
        this.updateValue(key);
    }

    delete(): void {
        super.delete();
        Object.keys(this.data).forEach((d)=>{
            this.remove(d)
        }) 
    }

    updateValue(key: string) {

    }

}