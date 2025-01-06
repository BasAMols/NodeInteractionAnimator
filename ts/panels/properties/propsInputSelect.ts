import { DomSelect } from '../../lib/dom/domSelect';
import { PropsInput } from './propsInput';

export class PropsInputSelect<T extends string = string> extends PropsInput<string> {
    input: DomSelect;
    constructor(onChange: (v: T) => void, options: [T, string][], def?: string) {
        super({
            onChange,
            classList: 'vector',
        });
        this.input = this.append(new DomSelect({
            attr: {
                'type': 'number',
            },
            onKeyUp: () => this.value =this.input.domElement.value, 
            onChange: () => this.value =this.input.domElement.value, 
            value: def ? String(def[0]) : '',
            options
        })) as DomSelect;
    }
    silent(v: string) {
        this.input.value = this.value;
    }
}