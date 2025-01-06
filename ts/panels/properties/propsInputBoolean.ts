import { DomElement } from '../../lib/dom/domElement';
import { DomInput } from '../../lib/dom/domInput';
import { Icon } from '../../lib/dom/icon';
import { PropsInput } from './propsInput';

export class PropsInputBoolean extends PropsInput<boolean> {
    input1: DomInput<"input">;
    input2: DomInput<"input">;
    _value: boolean = false;
    trueButton: DomElement<"div">;
    falseButton: DomElement<"div">;
    constructor(onChange: (v: boolean) => void, def?: boolean) {
        super({
            onChange,
            classList: 'vector',
        });
        this.trueButton = this.child('div', {
            onClick: ()=>{
                this.value = true;
                this.falseButton.visible = true;
                this.trueButton.visible = false;
            }
        })
        this.trueButton.append(new Icon({name: 'check_box_outline_blank'}))
        this.falseButton = this.child('div', {
            onClick: ()=>{
                this.value = false;
                this.falseButton.visible = false;
                this.trueButton.visible = true;
            }
        })
        this.falseButton.append(new Icon({name: 'check_box'}));
        this.silent(def||false)
    }
    silent(v: boolean) {
        super.silent(v);
        this.falseButton.visible = v;
        this.trueButton.visible = !v;
    }
}