import { DomInput } from '../../lib/dom/domInput';
import { PropsInput } from './propsInput';

export class PropsInputString extends PropsInput<string> {
    input: DomInput<"input">;
    constructor(onChange: (v: string) => void, def?: string) {
        super({
            onChange,
            classList: 'string',
        });
        this.input = this.append(new DomInput('input', {
            attr: {
                'type': 'string',
            },
            onKeyUp: () => this.value = (this.input.domElement.value),
            onChange: () => this.value = (this.input.domElement.value),
            value: def?def:''
        })) as DomInput<'input'>;
    }
    public silent(v: string) {
        super.silent(v);
        this.input.value = String(v);
    }
}