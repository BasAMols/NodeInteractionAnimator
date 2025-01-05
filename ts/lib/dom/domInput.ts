import { DomElement, DomElementProperties } from './domElement';

export interface DomInputProperties extends DomElementProperties {
    onKeyUp?: (e: Event)=>void;
    onChange?: (e: Event)=>void;
    value?: string;
}
export class DomInput<T extends 'textarea'|'input' = 'textarea'|'input'> extends DomElement {
    protected props: DomInputProperties;
    public domElement: HTMLElementTagNameMap[T];

    public get value(): string {
        return this.domElement.value;
    }
    public set value(value: string) {
        this.domElement.value = value;
    }
    private _onChange?: (e: Event) => void;
    public get onChange(): (e: Event) => void {
        return this._onChange;
    }
    public set onChange(func: (e: Event) => void | undefined) {
        if (this._onChange) {
            this.domElement.removeEventListener('change', this._onChange.bind(this));
            this._onChange = undefined;
        }
        if (func) {
            this._onChange = func;
            this.domElement.addEventListener('change', this._onChange.bind(this));
        }
    }
    private _onKeyUp?: (e: Event) => void;
    public get onKeyUp(): (e: Event) => void {
        return this._onKeyUp;
    }
    public set onKeyUp(func: (e: Event) => void | undefined) {
        if (this._onKeyUp) {
            this.domElement.removeEventListener('change', this._onKeyUp.bind(this));
            this._onKeyUp = undefined;
        }
        if (func) {
            this._onKeyUp = func;
            this.domElement.addEventListener('change', this._onKeyUp.bind(this));
        }
    }
    public constructor(protected type: T, properties: DomInputProperties = {}) {
        super(type, properties);
        if (this.props.onChange) this.onChange = this.props.onChange.bind(this);
        if (this.props.onKeyUp) this.onKeyUp = this.props.onKeyUp.bind(this);
        if (this.props.value) this.value = this.props.value;
    }
}