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
export type MenuButton = {
    key: string,
    label: string,
    icon?: IconProperties;
} & (MenuButtonAction | MenuButtonSelect | MenuButtonPanel);

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
    }
    public toggle() {
        this.open = !this.open;
    }
    protected columns: DomElement<'div'>[] = [];
    protected options: Record<string, {
        column: DomElement<'div'>,
        button: Button,
        hasIcon: boolean,
    }> = {};
    constructor(protected button: Button, d: ({
        key: string,
        name: string,
        onClick: () => void,
        icon?: IconProperties;
    } | string)[][]) {
        super('div', { className: 'menu_panel' });
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
        icon?: IconProperties;
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
                onClick: ()=>{
                    a.onClick();
                    this.open = false;
                },
                icon: a.icon,
                unstyle: true,
            })) as Button,
            hasIcon: Boolean(a.icon),
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
        this.button.domElement.classList[value?'add':'remove']('open')
    }
    constructor(button: Button, c: (v: string) => void, d: ({
        key: string,
        name: string,
        icon?: IconProperties;
    } | string)[][]) {
        super(button, d.map((c) => c.map((v) => {
            if (typeof v === 'string') return v;
            return {
                key: v.key,
                name: v.name,
                onClick: () => this.value(v.key),
                icon: v.icon,
            };
        })));
        this.onChange = c;
    }
    public value(key: string) {
        this.silentValue(key);
        this.onChange(key);
    }
    public silentValue(key: string) {
        this.open = false;
        Object.entries(this.options).forEach(([k, v]) => {
            v.button.active = k === key;
        });
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
        const menuWrap = this.child('div', { className: 'menu_wrap' });

        let button: Button, panel: MenuP | MenuS;
        if (data.type === 'Action') {
            button = menuWrap.append(new Button({
                onClick: data.onClick,
                icon: data.icon,
                text: data.label,
            })) as Button;
        }
        if (data.type === 'Select') {
            button = menuWrap.append(new Button({
                icon: data.icon,
                text: data.label + '...',
                onClick:()=>{
                    panel.toggle();
                }
            })) as Button;
            panel = menuWrap.append(new MenuS(button, data.onChange, data.data)) as MenuS;
        }
        if (data.type === 'Panel') {
            button = menuWrap.append(new Button({
                icon: data.icon,
                text: data.label + '...',
                onClick:()=>{
                    panel.toggle();
                }
            })) as Button;
            panel = menuWrap.append(new MenuP(button, data.data)) as MenuP;
        }

        this.buttons[data.key] = {
            button,
            panel
        };

    }
    getButton(key: string) {
        return this.buttons[key];
    }
}