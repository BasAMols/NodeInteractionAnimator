import { DomInput } from '../../lib/dom/domInput';
import { PropsAttr, PropsInput } from './propsInput';

export interface PropsNumberAttr extends PropsAttr<number> {

}

export class PropsInputNumber extends PropsInput<number> {
    input: DomInput<'input'>;
    constructor({ onChange, initialValue, classList  = ''}: PropsNumberAttr) {
        super({
            onChange,
            classList: classList+' number'
        });

        

        this.input = this.append(new DomInput('input', {
            attr: {
                'type': 'number',
            },
            onKeyUp: () => {
                this.value = Number(this.input.domElement.value);
            },
            onChange: () => {
                this.value = Number(this.input.domElement.value);
            },
            value: initialValue ? String(initialValue) : '0'
        })) as DomInput<'input'>;
    }
    public silent(v: number) {
        super.silent(v);
        this.input.value = String(v);
    }
}