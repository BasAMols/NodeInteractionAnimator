import { Menu, MenuOption } from './menu';
import { DomElement } from '../lib/dom/domElement';
import { IconProperties } from '../lib/dom/icon';

export interface SelectProp {
    options?: Record<string, string>;
    onChange?: (s: string) => void;
    icon?: IconProperties
}

export class Select extends DomElement<'div'> {
    private menu: Menu;
    private options: Record<string, {
        option: MenuOption,
        active: boolean,
        label: string,
    }> = {};
    public onChange: (s: string) => void;
    public constructor(props: SelectProp = {}) {
        super('div', { className: 'input select' });
        this.menu = this.append(new Menu()) as Menu;
        this.menu.registerPanel('panel', 'Panel', [''], props.icon)

        this.onChange = props.onChange;
        if (props.options) Object.entries(props.options).forEach(([k, v]) => {
            this.addOption(k, v);
        });
    }

    setName(n: string) {
        this.menu.panels['panel'].button.setText(n);
    }

    value(v: string) {
        if (!v) return;

        let found
        Object.entries(this.options).forEach(([k, value])=>{
            value.option.element.active = k === v;
            value.active = k===v;
            if (k===v) found = k; 
        })
        if (found) this.setName(this.options[found].label);
    }

    change(v: string) {
        this.onChange?.(v);
        this.value(v);
    }

    addOption(k: string, v: string) {
        this.options[k] = {
            active: false,
            label: v,
            option: this.menu.registerOption({
                panelKey: 'panel',
                key: k,
                name: v,
                onClick: () => {
                    this.change(k);
                },
            }) as MenuOption,
        }
    }

}