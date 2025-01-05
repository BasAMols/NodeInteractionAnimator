import { DomInput } from '../../lib/dom/domInput';
import { v2, Vector2 } from '../../lib/utilities/vector2';
import { PropsInput } from './propsInput';

export class PropsInputVector extends PropsInput<Vector2> {
    input1: DomInput<"input">;
    input2: DomInput<"input">;
    constructor(onChange: (v: Vector2) => void, def?: Vector2) {
        super({
            onChange,
            classList: 'vector',
        });
        this.input1 = this.append(new DomInput('input', {
            attr: {
                'type': 'number',
            },
            onChange: () => this.value = v2(
                Number(this.input1.domElement.value),
                this.value[1]
            ),
            value: def ? String(def[0]) : ''
        })) as DomInput<'input'>;
        this.input2 = this.append(new DomInput('input', {
            attr: {
                'type': 'number',
            },
            onChange: () => this.value = v2(
                this.value[0],
                Number(this.input2.domElement.value),
            ),
            value: def ? String(def[1]) : ''
        })) as DomInput<'input'>;
    }
    silent(v: Vector2) {
        super.silent(v.c());
        this.input1.value = String(this.value[0]);
        this.input2.value = String(this.value[1]);
    }
}