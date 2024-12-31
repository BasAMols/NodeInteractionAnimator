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
        if (switchPanel) buttons.push({
            key: key,
            label: 'Panel',
            icon: { name: 'dashboard', weight: 200 },
            type: 'Select',
            onChange: switchPanel,
            data: [[{ key: 'empty', name: 'Empty' }, ...Object.entries(this.list).map(([k, v]) => {
                return { key: k, name: v.panel.name };
            })]]
        });
        if (splitH) buttons.push({
            key: 'splitH',
            label: '',
            icon: { name: 'splitscreen_add', weight: 200 },
            type: 'Action',
            onClick: splitH,
        });
        if (splitV) buttons.push({
            key: 'splitV',
            label: '',
            icon: { name: 'splitscreen_vertical_add', weight: 200 },
            type: 'Action',
            onClick: splitV,
        });
        if (close) buttons.push({
            key: 'close',
            label: '',
            icon: { name: 'close', weight: 200 },
            type: 'Action',
            onClick: close,
        });
        

        return buttons;
    }
}