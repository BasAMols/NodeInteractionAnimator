import { DomInput, DomInputProperties } from './domInput';

export interface DomSelectProperties extends DomInputProperties {
    options?: [string, string][],
}
export class DomSelect extends DomInput<'select'> {
    protected props: DomSelectProperties;
    public domElement: HTMLSelectElement;

    public get value(): string {
        return super.value;;
    }
    public set value(value: string) {
        super.value = value;
    }

    public constructor(properties: DomSelectProperties = {}) {
        super('select', properties);
        if (properties.options) properties.options.forEach(([value,text]) => {
            this.child('option', {
                text: text,
                attr: {
                    'value': value,
                }
            });
        });
    }
}