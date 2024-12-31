import { DomElement, DomElementProperties } from './domElement';
import { Icon, IconProperties } from './icon';

export type ButtonProperties = DomElementProperties & {
    enabled?: boolean,
    icon?: IconProperties
    design?: 'default' | 'unset' | 'icon' | 'inline'
}
export class Button extends DomElement<'button'> {
    private _enabled: boolean = true;
    span: DomElement<"span">;
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
            className: ` button ${properties.className ?? ''} ${properties.design || 'default'}`
        }});
        if (properties.icon) this.append(new Icon(properties.icon));
        if (properties.text) this.span = this.child('span', {
            text: properties.text
        })
        if (properties.enabled) this.enabled = properties.enabled;
    }

    public setText(t: string): void {
        this.span.setText(t);

    }
}