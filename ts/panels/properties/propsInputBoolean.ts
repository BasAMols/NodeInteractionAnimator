import { DomElement } from '../../lib/dom/domElement';
import { DomInput } from '../../lib/dom/domInput';
import { Icon } from '../../lib/dom/icon';
import { PropsAttr, PropsInput } from './propsInput';


export interface PropsBooleanAttr extends PropsAttr<boolean> {

}

export class PropsInputBoolean extends PropsInput<boolean> {
    input1: DomInput<"input">;
    input2: DomInput<"input">;
    _value: boolean = false;
    trueButton: DomElement<"div">;
    falseButton: DomElement<"div">;
    constructor({ onChange, initialValue, classList = '' }: PropsBooleanAttr) {
        super({
            onChange,
            classList: classList + ' vector',
        });
        this.trueButton = this.child('div', {
            onClick: () => {
                this.value = true;
                this.falseButton.visible = true;
                this.trueButton.visible = false;
            }
        });
        this.trueButton.append(new Icon({ name: 'check_box_outline_blank' }));
        this.falseButton = this.child('div', {
            onClick: () => {
                this.value = false;
                this.falseButton.visible = false;
                this.trueButton.visible = true;
            }
        });
        this.falseButton.append(new Icon({ name: 'check_box' }));
        this.silent(initialValue || false);
    }
    silent(v: boolean) {
        super.silent(v);
        this.falseButton.visible = v;
        this.trueButton.visible = !v;
    }
}