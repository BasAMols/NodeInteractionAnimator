import { DomElement } from '../../lib/dom/domElement';
import { WindowPanel } from './window';

export interface WindowData {
    id: string,
    window: WindowPanel,
}

export class WindowManager extends DomElement<'div'> {
    private list: Record<string, WindowData> = {};
    public constructor(windows: WindowPanel[]) {
        super('div', { className: 'windows' });
        windows?.forEach((p, i) => {
            this.list[p.id] = {
                id: p.id,
                window: p,
            };
            this.append(p);
            this.close(p.id);
        });
    }
    public resize() {
        Object.values(this.list).forEach((w) => {
            w.window.resize();
        });
    }
    public open(k: string) {
        this.list[k].window.open = true;
        this.list[k].window.order = -1;
        this.reorder();
    }
    public close(k: string) {
        this.list[k].window.open = false;
    }
    public closeAll() {
        Object.keys(this.list).forEach(this.close);
    }
    public reorder() {
        Object.values(this.list).sort((a, b) => a.window.order - b.window.order).forEach((w, i, a) => {
            w.window.order = i * 2 + (i === (a.length-1) ? 1 : 0);
        });
    }
}