import { DomElement } from '../../lib/dom/domElement';
import { PropsInput } from '../../panels/properties/propsInput';
import { SceneObjectComponent } from './sceneobjectComponent';

export class SceneObjectComponentProperties extends SceneObjectComponent<'properties'> {
    public element: DomElement<'div'>;
    public data: Record<string, {
        name?: string,
        input: PropsInput,
        element: DomElement<'div'>;
    }> = {};

    constructor() {
        super('properties',);

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

    addMultiple(list: {
        key?: string
        name?: string,
        input: PropsInput,
    }[]) {

        list.forEach((data)=>{
            data.key = data.key||$.unique
            if (this.data[data.key]) return; 
            const el = new DomElement('div', {className: 'prop'});
            this.element.append(el);
            if (data.name) el.child('label', {
                text: data.name,
                className: 'props_label'
            })
            el.append(data.input)
            this.data[data.key] = {
                ...data,
                ...{
                    element: el
                }
            };
        })
    }

    visible(key: string,b:boolean) {
        if(this.data[key]) this.data[key].element.visible = b;
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