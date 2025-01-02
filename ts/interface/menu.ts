import { Button } from '../lib/dom/button';
import { DomElement } from '../lib/dom/domElement';
import { IconProperties } from '../lib/dom/icon';


export interface MenuButtonAction {
    type: 'Action';
    onClick: () => void;
}
export interface MenuButtonSelect {
    type: 'Select';
    onChange: (v: string) => void;
    data: ({
        key: string,
        name: string,
        icon?: IconProperties;
    } | string)[][];
}
export interface MenuButtonPanel {
    type: 'Panel';
    data: ({
        key: string,
        name: string,
        onClick: () => void,
        icon?: IconProperties;
    } | string)[][];
}
export type MenuButton = ({
    key: string,
    name?: string,
    icon?: IconProperties;
    className?: string,
    design?: 'unset' | 'icon' | 'inline' | 'default';
} & (MenuButtonAction | MenuButtonSelect | MenuButtonPanel)) | string;

export interface MenuOption {
    type: 'option',
    name: string,
    element: Button;
    onClick: () => void;
    icon?: IconProperties;
}

export class MenuP extends DomElement<'div'> {
    private _open: boolean = false;
    public get open(): boolean {
        return this._open;
    }
    public set open(value: boolean) {
        this._open = value;
        this.domElement.classList[value ? 'add' : 'remove']('open');
        this.button.active = value;
    }
    public toggle(b = !this.open) {
        this.open = b;
    }
    protected columns: DomElement<'div'>[] = [];
    protected options: Record<string, {
        column: DomElement<'div'>,
        button: Button,
        hasIcon: boolean,
        label: string,
    }> = {};
    constructor(protected button: Button, d: ({
        key: string,
        name: string,
        onClick: () => void,
        icon?: IconProperties,
        classList?: string,
        design?: 'unset' | 'icon' | 'inline';
    } | string)[][], prop: { classList?: string; } = {}) {
        super('div', { className: 'menu_panel ' + (prop.classList || '') });

        d.forEach((c) => {
            const column = this.child('div', { className: 'menu_column' });
            const index = this.columns.push(column) - 1;
            c.forEach((a) => {
                this.addOption(a, index);
            });
        });
        this.open = false;
    }
    addOption(a: ({
        key: string,
        name: string,
        onClick: () => void,
        className?: string,
        icon?: IconProperties;
        design?: 'unset' | 'icon' | 'inline';
    } | string), i: number) {
        const column = this.columns[i];
        if (typeof a === 'string') {
            column.child('span', {
                className: 'spacer',
                text: a,
            });
            return;
        }

        this.removeOption(a.key);
        this.options[a.key] = {
            column: column,
            button: column.append(new Button({
                text: a.name,
                onClick: () => {
                    a.onClick();
                    this.open = false;
                },
                icon: a.icon,
                design: a.design || 'inline',
                className: a.className,
            })) as Button,
            hasIcon: Boolean(a.icon),
            label: a.name,
        };
        if (a.icon) column.domElement.classList.add('icons');
    }
    removeOption(key: string) {
        const option = this.options[key];
        if (!option) return;
        option.column.remove(option.button);
        delete this.options[key];
    }
}

export class MenuS extends MenuP {
    onChange: (v: string) => void;
    public get open(): boolean {
        return super.open;
    }
    public set open(value: boolean) {
        super.open = value;
        this.button.domElement.classList[value ? 'add' : 'remove']('open');
    }
    constructor(button: Button, c: (v: string) => void, d: ({
        key: string,
        name: string,
        icon?: IconProperties;
    } | string)[][], prop: { classList?: string; } = {}) {
        super(button, d.map((c) => c.map((v) => {
            if (typeof v === 'string') return v;
            return {
                key: v.key,
                name: v.name,
                onClick: () => this.value(v.key),
                icon: v.icon,
            };
        })), prop);
        this.domElement.classList.add('select');
        this.onChange = c;
    }
    public value(key: string) {
        this.silentValue(key);
        this.onChange(key);
    }
    public silentValue(key: string) {
        this.open = false;
        let foundText = '';
        Object.entries(this.options).forEach(([k, v]) => {
            v.button.active = k === key;
            if (k === key) foundText = v.label;
        });
        this.button.setText(foundText);
    }
}

export class Menu extends DomElement<'div'> {
    // panels: Record<string, MenuPanel> = {};
    private buttons: Record<string, {
        button: Button;
        panel?: MenuP;
    }> = {};
    // private iterator: number = 0;
    constructor(d?: MenuButton[]) {
        super('div', { className: 'menu' });
        if (d) d.forEach((v) => this.addButton(v));
    }
    public addButton(data: MenuButton) {
        if (typeof data === 'string') {
            this.child('div', { className: `menu_space`, text: data})
        } else {

            const menuWrap = this.child('div', { className: `menu_wrap menu_type_${data.type.toLowerCase()} ${data.className || ''}` });
            let button: Button, panel: MenuP | MenuS;
            if (data.type === 'Action') {
                button = menuWrap.append(new Button({
                    onClick: data.onClick,
                    icon: data.icon,
                    text: data.name,
                    design: data.design || 'default'
                })) as Button;
            }
            if (data.type === 'Select') {
                button = menuWrap.append(new Button({
                    icon: data.icon,
                    text: data.name,
                    className: 'opens',
                    onClick: () => {
                        const b = panel.open;
                        this.closeAll();
                        panel.toggle(!b);
                    },
                    design: data.design || 'default'
                })) as Button;
                panel = menuWrap.append(new MenuS(button, data.onChange, data.data)) as MenuS;
                // button.append(new Icon({name: 'more_vert', weight: 200, offset: [0,0.5]}))
            }
            if (data.type === 'Panel') {
                button = menuWrap.append(new Button({
                    icon: data.icon,
                    text: data.name,
                    className: 'opens',
                    onClick: () => {
                        const b = panel.open;
                        this.closeAll();
                        panel.toggle(!b);
                    },
                    design: data.design || 'default'
                })) as Button;
                panel = menuWrap.append(new MenuP(button, data.data)) as MenuP;
                // button.append(new Icon({name: 'more_vert', weight: 200, offset: [0,0.5]}))
            }

            this.buttons[data.key] = {
                button,
                panel
            };
        }


    }
    getButton(key: string) {
        return this.buttons[key];
    }
    closeAll() {
        Object.values(this.buttons).forEach((b) => {
            if (b.panel) b.panel.toggle(false);
        });
    }
}