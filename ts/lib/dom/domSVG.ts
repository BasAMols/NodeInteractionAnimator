import { Vector2 } from '../utilities/vector2';

export interface DomSvgProperties {
    style?: Record<string, string | [string, boolean]>;
    className?: string;
    id?: string;
    attr?: Record<string, string>;
    onClick?: (e: MouseEvent) => void;
    visible?: boolean,
}
export class DomSVGElement<T extends keyof SVGElementTagNameMap = keyof SVGElementTagNameMap> {
    public domElement: SVGElementTagNameMap[T];
    public class(b: boolean = undefined, ...d: string[]): void {
        this.domElement.classList[b ? 'add' : 'remove'](...d);
    };
    private _onClick?: (e: MouseEvent) => void;
    public get onClick(): (e: MouseEvent) => void {
        return this._onClick;
    }
    public set onClick(func: (e: MouseEvent) => void | undefined) {
        if (this._onClick) {
            this.domElement.removeEventListener('mousedown', this._onClick.bind(this));
            this._onClick = undefined;
        }
        if (func) {
            this._onClick = func;
            this.domElement.addEventListener('mousedown', this._onClick.bind(this));
        }
    }
    protected props: DomSvgProperties;

    public set visible(b: boolean) {
        this.setStyle('display', b ? undefined : 'none', true);
    }

    public constructor(protected type: T, properties: DomSvgProperties = {}) {
        this.props = {
            ...{
                style: {},
                attr: {},
            }, ...properties
        };
        this.domElement = document.createElementNS("http://www.w3.org/2000/svg", type);
        this.domElement.setAttribute('draggable', 'false');

        if (this.props.onClick) this.onClick = this.props.onClick.bind(this);
        if (this.props.style) Object.entries(this.props?.style).forEach(([k, v]) => {
            this.setStyle(
                k,
                typeof v === 'string' ? v : v[0],
                typeof v === 'string' ? false : v[1]
            );
        });
        if (this.props.attr) Object.entries(this.props?.attr).forEach(([k, v]) => {
            this.domElement.setAttribute(k, v);
        });
        
        if (this.props.className) this.domElement.classList.add(...this.props.className.split(' ').map((e) => e.trim()).filter(str => /\w+/.test(str)));
        if (this.props.id) this.domElement.id = this.props.id;
        if (this.props.visible !== undefined) this.visible = this.props.visible;
    }

    public setStyle(k: string, v: string | undefined, i: boolean = false) {
        if (v) {
            this.domElement.style.setProperty(k, v, i ? 'important' : '');
            this.props.style[k] = [v, i];
        } else {
            this.domElement.style.removeProperty(k);
            delete this.props.style[k];
        }
    }
    public setPositionStyle(v:Vector2, unit: 'px'|'%' = 'px') {
        this.setStyle('left', v?`${v.x}${unit}`:undefined);
        this.setStyle('top', v?`${v.y}${unit}`:undefined);
    }
    public setSizeStyle(v:Vector2, unit: 'px'|'%' = 'px') {
        this.setStyle('width', v?`${v.x}${unit}`:undefined);
        this.setStyle('height', v?`${v.y}${unit}`:undefined);
    }
    public setAttribute(k: string, v: string) {
        this.domElement.setAttribute(k, v);
        this.props.attr[k] = v;
    }
    public append<T2 extends keyof SVGElementTagNameMap>(d: DomSVGElement<T2>): typeof d {
        this.domElement.appendChild(d.domElement);
        return d;
    }

    public child<T3 extends keyof SVGElementTagNameMap>(type: T3, properties: DomSvgProperties = {}): DomSVGElement<T3> {
        return this.append(new DomSVGElement(type, properties)) as DomSVGElement<T3>;
    }

    private click(e: MouseEvent) {
        this.onClick?.(e);
    }

    public remove(d: DomSVGElement<any>) {
        try {
            this.domElement.removeChild(d.domElement);
        } catch (error) { }
    }

    public clone() {
        return new DomSVGElement(this.type, { ...this.props });
    }
}