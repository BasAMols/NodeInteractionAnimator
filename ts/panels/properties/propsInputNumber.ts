import { DomInput } from '../../lib/dom/domInput';
import { PropsInput } from './propsInput';

export class PropsInputNumber extends PropsInput<number> {
    input: DomInput<'input'>;
    constructor(onChange: (v: number) => void, def?: number) {
        super({
            onChange,
            classList: 'number'
        });

        this.input = this.append(new DomInput('input', {
            attr: {
                'type': 'number',
            },
            onChange: () => {
                this.value = Number(this.input.domElement.value);
            },
            value: def ? String(def) : '0'
        })) as DomInput<'input'>;
    }
    public silent(v: number) {
        super.silent(v);
        this.input.value = String(v);
    }
}