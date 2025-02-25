import { DomInput } from '../../lib/dom/domInput';
import { v2, Vector2 } from '../../lib/utilities/vector2';
import { PropsAttr, PropsInput } from './propsInput';

export interface PropsVectorAttr extends PropsAttr<Vector2> {

}

export class PropsInputVector extends PropsInput<Vector2> {
    input1: DomInput<"input">;
    input2: DomInput<"input">;
    _value: Vector2 = v2(0, 0);
    constructor({ onChange, initialValue, classList = '' }: PropsVectorAttr) {
        super({
            onChange,
            classList: classList+' vector',
        });
        this.input1 = this.append(new DomInput('input', {
            attr: {
                'type': 'number',
            },
            onKeyUp: () => {
                this.value = v2(
                    Number(this.input1.domElement.value),
                    this.value[1]
                );
            },
            onChange: () => {
                this.value = v2(
                    Number(this.input1.domElement.value),
                    this.value[1]
                );
            },
            value: initialValue ? String(initialValue[0]) : '0'
        })) as DomInput<'input'>;
        this.input2 = this.append(new DomInput('input', {
            attr: {
                'type': 'number',
            },
            onChange: () => this.value = v2(
                this.value[0],
                Number(this.input2.domElement.value),
            ),
            onKeyUp: () => this.value = v2(
                this.value[0],
                Number(this.input2.domElement.value),
            ),
            value: initialValue ? String(initialValue[1]) : '0'
        })) as DomInput<'input'>;
    }
    silent(v: Vector2) {
        super.silent(v.c());
        this.input1.value = String(this.value[0]);
        this.input2.value = String(this.value[1]);
    }
}