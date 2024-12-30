export interface DomElementProperties {
    style?: Record<string, string|[string, boolean]>;
    text?: string;
    className?: string;
    id?: string;
    attr?: Record<string, string>;
    onClick?: ()=>void
}
export class DomElement<T extends keyof HTMLElementTagNameMap> {
    public domElement: HTMLElementTagNameMap[T];
    public onClick?: ()=>void;

    public set visible(b: boolean) {
        this.setStyleProperty('display', b?undefined: 'none', true)
    }

    public constructor(type: T, properties: DomElementProperties = {}) {
        this.domElement = document.createElement(type);
        this.domElement.setAttribute('draggable', 'false');
        this.domElement.addEventListener('click', this.click.bind(this))
        if (properties.style) Object.entries(properties?.style).forEach(([k,v])=>{
            this.setStyleProperty(
                k, 
                typeof v === 'string'?v:v[0], 
                typeof v === 'string'?false:v[1]
            )
        })
        if (properties.attr) Object.entries(properties?.attr).forEach(([k,v])=>{
            this.domElement.setAttribute(k,v)
        })
        if (properties.text) this.domElement.innerHTML = properties.text
        if (properties.className) this.domElement.className = properties.className
        if (properties.id) this.domElement.id = properties.id
    }

    public setStyleProperty(k:string,v:string|undefined,i:boolean = false) {
        if (v){
            this.domElement.style.setProperty(k,v,i?'important':'')
        } else {
            this.domElement.style.removeProperty(k)
        }
    }

    public append<T extends keyof HTMLElementTagNameMap>(d: DomElement<T>): DomElement<T> {
        this.domElement.appendChild(d.domElement);
        return d; 
    }

    private click() {
        this.onClick?.()
    }


    public remove(d: DomElement<any>) {
        try {
            this.domElement.removeChild(d.domElement)
        } catch (error) {}
    }
}