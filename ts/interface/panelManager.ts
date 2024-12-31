import { Select } from './select';
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
        if (!n ) return;
        const d = this.get(typeof n === 'string' ? n : n.id);
        
        if (!d ) return;
        if(d.section) this.unassign(d.section);

        d.section = section;
        d.section.contentWrap.append(d.panel);
    }
    public getSelectObject() {
        return new Select({
            icon: {name: 'dashboard', weight:200},
            options:
                Object.fromEntries([['empty', '...'], ...Object.entries(this.list).map(([k, v]) => {
                    return [k, v.panel.name];
                })])
        });
    }
}