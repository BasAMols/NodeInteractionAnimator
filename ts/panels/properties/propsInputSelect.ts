import { DomSelect } from '../../lib/dom/domSelect';
import { PropsAttr, PropsInput } from './propsInput';

export interface PropsSelectAttr<T> extends PropsAttr<T> {
    options: [T, string][]; 
    onChange: (v: T) => void;
}

export class PropsInputSelect<T extends string = string> extends PropsInput<T> {
    input: DomSelect;
    constructor({ onChange, options, initialValue, classList = '' }: PropsSelectAttr<T>) {
        super({
            onChange,
            classList: classList+' vector',
        });

        this.input = this.append(new DomSelect({
            attr: {
                'type': 'number',
            },
            onKeyUp: () => this.value =this.input.domElement.value as T, 
            onChange: () => this.value =this.input.domElement.value as T, 
            options
        })) as DomSelect;

        this.silent(initialValue || '')
    }
    silent(v: string) {
        this.input.value = v;
    }
}