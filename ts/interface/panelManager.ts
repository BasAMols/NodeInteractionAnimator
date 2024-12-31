import { Icon, IconProperties } from '../lib/dom/icon';
import { MenuButton } from './menu';
import { Panel } from './panel';
import { Section } from './section';

export interface PanelData {
    id: string,
    panel: Panel,
    section: Section | undefined;
}

export class PanelManager {
    private list: Record<string, PanelData> = {};
    public constructor(panels: Panel[]) {
        panels?.forEach((p) => {
            this.list[p.id] = {
                id: p.id,
                panel: p,
                section: undefined
            };
        });
    }

    public get(n: string): PanelData {
        return this.list[n];
    }
    public getPanel(n: string): Panel {
        return this.get(n)?.panel;
    }

    public unassign(n: string | Panel | Section) {
        if (!n) return;
        let p, s;
        if (n instanceof Section) {
            s = n;
            p = n.activePanel;
            if (!p) return;
        } else {
            const d = this.get(typeof n === 'string' ? n : n.name);
            if (!d || !d.panel || !d.section) return;
            s = d.section;
            p = d.panel;
        }
        s.removePanel();
        this.get(p.id).section = undefined;

    }
    public assign(n: string | Panel, section: Section) {
        if (!n) return;
        const d = this.get(typeof n === 'string' ? n : n.id);

        if (!d) return;
        if (d.section) this.unassign(d.section);

        d.section = section;
        d.section.contentWrap.append(d.panel);
    }
    public getSelectObject(
        key: string = 'panel',
        switchPanel?: (v: string) => void,
        close?: () => void,
        splitH?: () => void,
        splitV?: () => void,
    ): MenuButton[] {
        let buttons: MenuButton[] = [];
        let subMenu: {
            key: string,
            name: string,
            onClick: () => void,
            icon: IconProperties;
        }[] = [];

                
        if (switchPanel) buttons.push({
            key: key,
            name: 'Panel',
            type: 'Select',
            onChange: switchPanel,
            icon: Icon.make('grid_view'),
            data: [[{ key: 'empty', name: '' }, ...Object.entries(this.list).map(([k, v]) => {
                return { key: k, name: v.panel.name };
            })]]
        });

        if (splitV) buttons.push({
            type: 'Action',
            key: 'splitV',
            icon: { name: 'splitscreen_vertical_add', weight: 200 },
            design: 'icon',
            onClick: splitV,
        });
        if (splitH) buttons.push({
            type: 'Action',
            key: 'splitH',
            icon: { name: 'splitscreen_add', weight: 200 },
            design: 'icon',
            onClick: splitH,
        });
        if (close) buttons.push({
            type: 'Action',
            key: 'close',
            icon: { name: 'close', weight: 200 },
            design: 'icon',
            onClick: close,
        });

        // if (splitV) subMenu.push({
        //     key: 'splitV',
        //     name: 'Split Horizontal',
        //     icon: { name: 'splitscreen_vertical_add', weight: 200 },
        //     onClick: splitV,
        // });
        // if (splitH) subMenu.push({
        //     key: 'splitH',
        //     name: 'Split Vertical',
        //     icon: { name: 'splitscreen_add', weight: 200 },
        //     onClick: splitH,
        // });
        // if (close) subMenu.push({
        //     key: 'close',
        //     name: 'Close Section',
        //     icon: { name: 'close', weight: 200 },
        //     onClick: close,
        // });

        // if (subMenu.length > 0) buttons.push({
        //     key: 'sub',
        //     name: '',
        //     type: 'Panel',
        //     data: [subMenu],
        //     icon: Icon.make('more_vert', 300),
        //     design: 'icon'
        // });


        return buttons;
    }
}