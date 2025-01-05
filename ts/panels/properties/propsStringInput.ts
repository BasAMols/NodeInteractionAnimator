import { DomElement } from '../../lib/dom/domElement';
import { PropsInput } from './propsInput';

export class PropsStringInput extends PropsInput<string> {
    input: DomElement<"input">;
    constructor(onChange: (v: string) => void, def?: string) {
        super({
            onChange,
            classList: 'string',
        });
        this.input = this.child('input', {
            attr: {
                'type':'text',
            }
        });
        if (def) this.input.domElement.value = def
        this.input.domElement.addEventListener('change', () => {
            this.value = (this.input.domElement.value);
        });
    }
}