import { Button } from '../../lib/dom/button';
import { DomElement } from '../../lib/dom/domElement';
import { Icon } from '../../lib/dom/icon';
import { PropsInputString } from '../../panels/properties/propsInputString';
import { SceneObjectComponent } from './sceneobjectComponent';

export class SceneObjectComponentOutline extends SceneObjectComponent<'outline'> {
    public element: DomElement<'div'>;
    private _toggle: boolean = false;
    private nameElement: DomElement<"div">;
    public get toggle(): boolean {
        return this._toggle;
    }
    public set toggle(value: boolean) {
        this._toggle = value;
        this.element.class(value, 'open');
    }
    public set name(v:string) {
        this.nameElement.setText(v)
    }
    constructor() {
        super('outline');
    }

    protected updateState() {
        super.updateState();
        this.element.class(this.selected, 'selected');
    }

    build(): void {
        this.element = new DomElement('div', { className: 'sceneline' });
        const head = this.element.child('div', { className: 'sceneline_head' });
        head.append(new Button({
            className: 'sceneline_head_drag', icon: Icon.make('drag_indicator'), design: 'icon', onClick: () => {
                // this.toggle = !this.toggle;
            }
        }));
        // head.append(new Button({
        //     className: 'sceneline_head_collapse', icon: Icon.make('keyboard_arrow_down'), design: 'icon', onClick: () => {
        //         this.toggle = !this.toggle;
        //     }
        // }));
        this.nameElement = head.child('div', { className: 'sceneline_head_content', text: this.sceneObject.name || this.sceneObject.key });
        const meta = head.child('div', { className: 'sceneline_head_meta' });
        meta.append(new Button({
            className: 'sceneline_select', icon: Icon.make('arrow_selector_tool'), design: 'icon', onClick: () => {
                this.sceneObject.focus();
            }
        }));
        meta.append(new Button({ icon: Icon.make('delete_forever'), design: 'icon', onClick: ()=>{
            $.scene.remove(this.sceneObject);
        } }));
        // meta.append(new Button({ icon: Icon.make('visibility_off'), design: 'icon' }));
        const content = this.element.child('div', { className: 'sceneline_content' });
        let count = 0;
        Object.values(this.sceneObject.components).forEach((c) => {
            if (c.type !== 'outline') {
                count++;
                this.addLineChild(content, c);
            }
        });
        content.setStyle('max-height', `${count * 30}px`);

        this.sceneObject.defineProperty('name', {
            input: new PropsInputString({
                onChange: (v) => {
                    this.sceneObject.name = v;
                }, 
                initialValue: this.sceneObject.name
            }),
            name: 'Name',
        }) as PropsInputString;
    }

    addLineChild(parent: DomElement, o: SceneObjectComponent) {
        const line = parent.child('div', { className: 'sceneline' });
        const head = line.child('div', { className: 'sceneline_head' });
        head.child('div', { className: 'sceneline_head_content', text: o.type });
        const meta = head.child('div', { className: 'sceneline_head_meta' });
        meta.append(new Button({
            className: 'sceneline_select', icon: Icon.make('arrow_selector_tool'), design: 'icon', onClick: () => {
                this.sceneObject.focus();
            }
        }));
    }
    delete(): void {
        super.delete();
        if (this.element.domElement.parentElement)this.element.domElement.parentElement.removeChild(this.element.domElement)
    }
}