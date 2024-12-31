import { DomElement } from './domElement';

export type IconProperties = {
    name: string,
    weight?: number,
    offset?: [number,number]
}
export class Icon extends DomElement<'span'> {
    private fontVariation:{
        FILL:number|undefined,
        wght:number|undefined,
        GRAD:number|undefined,
        opsz:number|undefined,
    } = {
        FILL:0,
        wght:230,
        GRAD:30,
        opsz:20,
    } 
    public constructor(properties: IconProperties) {
        super('span', {
            text: properties.name,
            className: 'icon material-symbols-outlined',
 
        });
        if (properties.weight) this.fontVariation.wght = properties.weight
        if (properties.offset) {
            this.setStyle('transform', `translate(${properties.offset.join('px,')}px)`)
        }
        this.setVariation();
    }
    public setVariation() {
        this.setStyle('font-variation-settings', Object.entries(this.fontVariation).map(([k,v])=>`'${k}' ${v}`).join(','))
    }
    public static make(n?:string, w?:number, o?: [number,number]) {
        return {
            name: n || '',
            weight: w || 200
        } as IconProperties
    }
}