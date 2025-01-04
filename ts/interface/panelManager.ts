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
    public forEach(f: (value: [string, Panel], index: number, array: [string, Panel][]) => void) {
        Object.entries(this.list).map(([k,d])=>[k,d.panel]).forEach(f)
    };

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


        if (switchPanel) {
            let d: (string | {
                key: string;
                name: string;
                icon?: IconProperties;
            })[][] = [[{ key: 'empty', name: '', icon: Icon.make('more_horiz')}]];
            let lastMenu = 0
            for (let i = 0; i < Object.entries(this.list).length; i++) {
                const [k, v] = Object.entries(this.list)[i];
                if (d[lastMenu].length > Math.ceil(Math.sqrt(Object.entries(this.list).length + 1))) lastMenu = d.push([]) -1;
                d[lastMenu].push({ key: k, name: v.panel.name, icon: v.panel.icon });
            }

            buttons.push({
                key: key,
                name: 'Panel',
                type: 'Select',
                onChange: switchPanel,
                icon: Icon.make('grid_view'),
                data: d
            });

            buttons.push('|');
        }

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


        return buttons;
    }
}