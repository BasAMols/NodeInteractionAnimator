import { DomElement, DomElementProperties } from './domElement';
import { Icon, IconProperties } from './icon';

export type ButtonProperties = DomElementProperties & {
    enabled?: boolean,
    icon?: IconProperties
}
export class Button extends DomElement<'button'> {
    private _enabled: boolean = true;
    public get enabled (){
        return this._enabled;
    }
    public set enabled (b: boolean){
        this._enabled = b;
        this.domElement.classList[b?'remove':'add']('disabled');
    }

    private _active: boolean = false;
    public get active (){
        return this._active;
    }
    public set active (b: boolean){
        this._active = b;
        this.domElement.classList[b?'add':'remove']('active');
    }

    public constructor(properties: ButtonProperties = {}) {
        super('button', {...properties, ...{
            text: undefined,
            className: (properties.className ?? '') + ' button'
        }});
        if (properties.icon) this.append(new Icon(properties.icon));
        this.child('span', {
            text: properties.text
        })
        if (properties.enabled) this.enabled = properties.enabled;
    }
}