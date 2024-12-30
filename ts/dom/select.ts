import { DomElement } from './domElement';

export interface SelectProp {
    options?: Record<string, string>
    default?: string,
    onChange?: (s: string)=>void
}

export class Select extends DomElement<'div'> {
    private select: DomElement<"select">;
    public onChange: (s: string) => void;
    public constructor(props: SelectProp = {}) {
        super('div', {className: 'input select'});
        this.select = this.append(new DomElement('select'));
        this.onChange = props.onChange;
        if (props.options)Object.entries(props.options).forEach(([k,v])=>{
            this.addOption(k,v,props.default === k)
        }) 
        this.select.domElement.addEventListener('change', ()=>{
            this.change(this.select.domElement.value)
        })
    }

    value(v:string) {
        this.select.domElement.value = v;
    }

    change(v:string) {
        this.onChange?.(v)
    }

    addOption(k:string,v:string,d:boolean = false) {
        this.select.append(new DomElement('option', {
            attr: {
                value: k,
                selected: d?'':undefined
            },
            text: v
        })); 
    }

}