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
}