import { DomInput } from '../../lib/dom/domInput';
import { PropsAttr, PropsInput } from './propsInput';

export interface PropsStringAttr extends PropsAttr<string> {

}

export class PropsInputString extends PropsInput<string> {
    input: DomInput<"input">;
    constructor({ onChange, initialValue, classList  = ''}: PropsStringAttr) {
        
        super({
            onChange,
            classList: classList+' string',
        });
        this.input = this.append(new DomInput('input', {
            attr: {
                'type': 'string',
            },
            onKeyUp: () => this.value = (this.input.domElement.value),
            onChange: () => this.value = (this.input.domElement.value),
            value: initialValue?initialValue:''
        })) as DomInput<'input'>;
    }
    public silent(v: string) {
        super.silent(v);
        this.input.value = String(v);
    }
}