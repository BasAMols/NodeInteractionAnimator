import { DomElement } from '../../lib/dom/domElement';
import { Vector2 } from '../../lib/utilities/vector2';

export class PropsInput<R = string | Vector2 | number> extends DomElement<'div'> {
    private _value: R;
    public get value(): R {
        return this._value;
    }
    public set value(value: R) {
        this._value = value;
        this.onChange(this._value);
    }
    private onChange: (v: R) => void;
    constructor({ onChange, classList = '' }: { onChange: (v: R) => void; classList?:string }) {
        super('div', {className: `props_input ${classList}`});
        this.onChange = onChange;
    }
    public silent(v: R) {
        this._value = v;
    }
}

