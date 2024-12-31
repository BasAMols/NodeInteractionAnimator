import { Button } from '../lib/dom/button';
import { DomElement } from '../lib/dom/domElement';
import { IconProperties } from '../lib/dom/icon';


export interface MenuPanel {
    name: string;
    columns: MenuColumn[],
    element: DomElement<'div'>;
    button: Button;
    open: boolean;
    icon?: IconProperties
}
export interface MenuColumn {
    element: DomElement<'div'>;
    label?: string,
    options: Record<string, MenuOption | MenuSpacer>;
}
export interface MenuSpacer {
    type: 'spacer',
    text: string,
    element: DomElement<'span'>;
}
export interface MenuOption {
    type: 'option',
    name: string,
    element: Button;
    onClick: () => void;
    icon?: IconProperties
}

export class Menu extends DomElement<'div'> {
    panels: Record<string, MenuPanel> = {};
    private iterator: number = 0;
    constructor(d?: [
        [string,string],
        [string?, string?, IconProperties?][]
    ][]) {
        super('div', { className: 'menu' });

        if (d) d.forEach(([panel, options])=>{
            this.registerPanel(panel[0], panel[1], ['']);
            options.forEach((o)=>{
                if(o.length === 0){
                    this.registerSpacer({
                        panelKey: panel[0],
                        columnIndex: 0,
                    });
                } else {
                    this.registerOption({
                        panelKey: panel[0],
                        columnIndex: 0,
                        key: o[0],
                        name: o[1],
                        onClick: () => { },
                        icon: o[2]
                    });
                }
            })
        })
    }
    registerPanel(key: string, name: string, columns?: string[], icon?: IconProperties) {
        const menuWrap = this.child('div', { className: 'menu_wrap' });
        const panel = menuWrap.child('div', { className: 'menu_panel', visible: false, });
        this.panels[key] = {
            name,
            open: false,
            element: panel,
            columns: columns.map((label) => {
                const column = panel.child('div', { className: 'menu_column' });
                column.child('span', { text: label });
                return {
                    element: column,
                    label,
                    options: {}
                };
            }),
            button: menuWrap.append(new Button({
                className: 'menu_button',
                text: name,
                icon,
                onClick: () => {
                    this.togglePanel(key);
                }
            })) as Button
        };

    }
    getOption({ panelKey, columnIndex = 0, key }: { panelKey: string; columnIndex: number; key?: string; }): [MenuPanel, MenuColumn, (MenuOption | MenuSpacer)?] | undefined {
        if (!this.panels[panelKey]) return undefined;
        const panel = this.panels[panelKey];

        if (panel.columns.length < columnIndex) return undefined;

        const column = panel.columns[columnIndex];

        if (!key) return [panel, column];
        if (!column.options[key]) return undefined;

        return [panel, column, column.options[key]];
    }
    registerSpacer({ panelKey, columnIndex = 0, key = String(this.iterator++), name: text }: { panelKey: string; columnIndex: number; key?: string; name?: string; }) {
        const o = this.getOption({ panelKey, columnIndex });
        if (!o) return;
        const [panel, column] = o;

        const element = column.element.child('span', { className: 'spacer', text: text });
        if (column.options[key]) this.removeOption({ panelKey, columnIndex, key });
        column.options[key] = {
            type: 'spacer',
            element,
            text,
        };
    }
    registerOption({ panelKey, columnIndex = 0, key = String(this.iterator++), name, onClick, icon }: { icon?: IconProperties, panelKey: string; columnIndex?: number; key: string; name: string; onClick: () => void; }) {
        const o = this.getOption({ panelKey, columnIndex });
        if (!o) return;
        const [panel, column] = o;
        const click = () => {
            onClick();
            this.closePanels();
        };

        const element = column.element.append(new Button({ text: name, onClick: click, unstyle: true, icon })) as Button;
        if (column.options[key]) this.removeOption({ panelKey, columnIndex, key });
        column.options[key] = {
            type: 'option',
            element,
            name,
            onClick: click,
        };
        if (icon){
            column.element.domElement.classList.add('icons')
        }
        return column.options[key]
    }
    removeOption({ panelKey, columnIndex = 0, key }: { panelKey: string; columnIndex: number; key: string; }) {
        const o = this.getOption({ panelKey, columnIndex, key });
        if (!o) return;
        const [panel, column, button] = o;
        column.element.remove(button.element);
        delete column.options[key];
    }

    togglePanel(k: string, b: boolean = !this.panels[k].open) {
        this.closePanels();
        this.panels[k].element.visible = b;
        this.panels[k].button.active = b;
        this.panels[k].open = b;
    }
    closePanels() {
        Object.values(this.panels).forEach((p) => {
            p.element.visible = false;
            p.button.active = false;
            p.open = false;
        });
    }
}