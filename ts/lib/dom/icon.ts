import { DomElement } from './domElement';

export type IconProperties = {
    name: string,
    weight?: number,
}
export class Icon extends DomElement<'span'> {
    public constructor(properties: IconProperties) {
        super('span', {
            text: properties.name,
            className: 'icon material-symbols-outlined',
            style: {
                "font-weight": String(properties.weight ?? 400)
            }
        });
    }
    public static make(n?:string, w?:number) {
        return {
            name: n || '',
            weight: w || 200
        } as IconProperties
    }
}