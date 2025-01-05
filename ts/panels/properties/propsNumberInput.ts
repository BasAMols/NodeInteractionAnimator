import { DomElement } from '../../lib/dom/domElement';
import { PropsInput } from './propsInput';

export class PropsNumberInput extends PropsInput<number> {
    input: DomElement<"input">;
    constructor(onChange: (v: number) => void) {
        super({
            onChange,
            classList: 'number'
        });
        this.input = this.child('input', {
            attr: {'type':'number'}
        });
        this.input.domElement.addEventListener('change', () => {
            this.value = Number(this.input.domElement.value);
        });
    }
    public silent(v: number) {
        super.silent(v)
        this.input.domElement.value = String(v);
    }
}