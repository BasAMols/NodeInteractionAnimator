export interface DomElementProperties {
    style?: Record<string, string|[string, boolean]>;
    text?: string;
    className?: string;
    id?: string;
    attr?: Record<string, string>;
    onClick?: ()=>void;
    visible?: boolean,
}
export class DomElement<T extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap> {
    public domElement: HTMLElementTagNameMap[T];
    public class(b: boolean = undefined, ...d: string[]):void {
        this.domElement.classList[b?'add':'remove'](...d)
    };
    private _onClick?: () => void;
    public get onClick(): () => void {
        return this._onClick;
    }
    public set onClick(func: () => void|undefined) {
        this._onClick = func;
    }
    private props: DomElementProperties

    public set visible(b: boolean) {
        this.setStyle('display', b?undefined: 'none', true)
    }

    public constructor(protected type: T, properties: DomElementProperties = {}) {
        this.props = {...{
            style: {},
            attr: {},
        }, ...properties};
        this.domElement = document.createElement(type);
        this.domElement.setAttribute('draggable', 'false');
        this.domElement.addEventListener('mousedown', this.click.bind(this))
        if (this.props.style) Object.entries(this.props?.style).forEach(([k,v])=>{
            this.setStyle(
                k, 
                typeof v === 'string'?v:v[0], 
                typeof v === 'string'?false:v[1]
            )
        })
        if (this.props.attr) Object.entries(this.props?.attr).forEach(([k,v])=>{
            this.domElement.setAttribute(k,v)
        })
        if (this.props.text) this.setText(this.props.text);
        if (this.props.className) this.domElement.className = this.props.className
        if (this.props.id) this.domElement.id = this.props.id
        if (this.props.onClick) this.onClick = this.props.onClick
        if (this.props.visible !== undefined) this.visible = this.props.visible
    }

    public setStyle(k:string,v:string|undefined,i:boolean = false) {
        if (v){
            this.domElement.style.setProperty(k,v,i?'important':'')
            this.props.style[k] = [v,i]
        } else {
            this.domElement.style.removeProperty(k)
            delete this.props.style[k]
        }
    }
    public setAttribute(k:string,v:string) {
        this.domElement.setAttribute(k,v);
        this.props.attr[k] = v
    }
    public setText(t: string) {
        this.domElement.innerText = t;
    }

    public append<T2 extends keyof HTMLElementTagNameMap>(d: DomElement<T2>): typeof d {
        this.domElement.appendChild(d.domElement);
        return d; 
    }

    public child<T3 extends keyof HTMLElementTagNameMap>(type: T3, properties: DomElementProperties = {}): DomElement<T3> {
        return this.append(new DomElement(type, properties)) as DomElement<T3>
    }

    private click() {
        this.onClick?.()
    }

    public remove(d: DomElement<any>) {
        try {
            this.domElement.removeChild(d.domElement)
        } catch (error) {}
    }

    public clone() {
        return new DomElement(this.type, {...this.props})
    }
}