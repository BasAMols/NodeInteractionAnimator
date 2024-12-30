import { DomElement } from '../dom/domElement';
import { Select } from '../dom/select';
import { glob } from '../main';
import { Util } from '../utilities/utils';
import { Panel } from './panel';

export interface sectionContentEmpty {
    type: 'empty',
}
export interface sectionContentPanel {
    type: 'panel',
    panel: Panel,
}
export interface sectionContentSplit {
    type: 'split',
    percentage?: number,
    direction?: typeof this.direction,
    sections: [SectionContent, SectionContent];
}
export type SectionContent = sectionContentEmpty | sectionContentPanel | sectionContentSplit;


export class Section extends DomElement<'div'> {
    static getEmpty(): sectionContentEmpty {
        return {
            type: 'empty',
        };
    }
    static getPanel(n: string): sectionContentPanel {
        return {
            type: 'panel',
            panel: glob.panels.getPanel(n)
        };
    }
    static getSplit(c: [SectionContent,SectionContent],d: 'v'|'h' = 'h',p: number = 50): sectionContentSplit {
        return {
            type: 'split',
            direction: d,
            sections: c,
            percentage: p,
        };
    }
    protected parent: Section | undefined;
    public contentWrap: DomElement<"div">;
    protected dragger: DomElement<"span">;
    protected mode: 'split' | 'panel';
    protected panel: Panel | undefined;
    protected sections: [Section, Section] | undefined;
    private _direction: 'v' | 'h' | undefined;
    private panelSwitch: Select;
    private _dragging: boolean;
    public get dragging(): boolean {
        return this._dragging;
    }
    public set dragging(value: boolean) {
        this._dragging = value;
        this.dragger.setStyle('pointerEvents', value ? 'none' : 'auto');
        this.dragger.domElement.classList[value ? 'add' : 'remove']('dragging');
    }
    protected get direction(): 'v' | 'h' | undefined {
        return this._direction;
    }
    protected set direction(value: 'v' | 'h' | undefined) {
        this._direction = value;
        this.domElement.classList[this.direction === 'h' ? 'add' : 'remove']('h');
        this.domElement.classList[this.direction === 'v' ? 'add' : 'remove']('v');
    }

    private _percentage: number | undefined;
    protected get percentage(): number | undefined {
        return this._percentage;
    }
    protected set percentage(value: number | undefined) {
        this._percentage = Util.clamp(value, 5, 95);
        if (this.sections && this.direction) {
            this.sections[0].setStyle(this.direction === 'h' ? 'width' : 'height', `calc(${this._percentage}% - 3px)`);
            this.sections[1].setStyle(this.direction === 'h' ? 'width' : 'height', `calc(${100 - this._percentage}% - 3px)`);
            this.sections[0].setStyle(this.direction === 'h' ? 'height' : 'width', `100%`);
            this.sections[1].setStyle(this.direction === 'h' ? 'height' : 'width', `100%`);

            this.dragger.setStyle('left', this.direction === 'h' ? `calc(${this._percentage}% - 3px)` : '4px');
            this.dragger.setStyle('top', this.direction === 'v' ? `calc(${this._percentage}% - 3px)` : '4px');
        }
    }

    public get activePanel() {
        return this.panel;
    }

    public setMode(m: 'panel', a: string | undefined): Panel;
    public setMode(m: 'split', a: typeof this.direction, b: number): [Section, Section];
    public setMode(m: typeof this.mode, a: string | undefined | typeof this.direction, b?: number): [Section, Section] | Panel {
        const oldPanel = this.panel;

        if (m === 'panel') {
            this.fill({
                type: 'panel',
                panel: glob.panels.getPanel(a)
            });
            return this.panel;
        } else {
            this.fill({
                type: 'split',
                sections: [
                    {
                        type: 'panel',
                        panel: oldPanel
                    },
                    Section.getEmpty()
                ],
                percentage: b,
                direction: a
            });
            return this.sections;
        }
    }

    public removePanel() {
        if (this.panel) {
            this.contentWrap.remove(this.panel);
            this.panel = undefined;
        }
        this.panelSwitch.value('empty');
    }

    public empty(del: boolean = false) {
        glob.panels.unassign(this);
        this.removePanel();
        this.direction = undefined;
        this.sections?.forEach((s) => s.empty(true));
        this.sections = undefined;
        this.percentage = undefined;

        if (del) {
            this.parent?.contentWrap.remove(this);
        }
    }

    public fill(content?: SectionContent): void {
        this.empty();
        if (content && content.type !== 'empty') {
            this.mode = content.type;
            if (content.type === 'panel') {
                this.domElement.classList.remove('s_split');
                this.domElement.classList.add('s_panel');

                this.panel = content.panel;
                glob.panels.assign(this.panel, this);
                this.panelSwitch.value(this.panel?.id);

                this.dragger.visible = false;
            } else {
                this.domElement.classList.remove('s_panel');
                this.domElement.classList.add('s_split');

                this.sections = content.sections.map((d) => new Section(this, d)) as typeof this.sections;
                this.direction = content.direction || (this.parent.direction === 'v' ? 'h' : 'v');
                this.percentage = content.percentage || 50;

                this.dragger.visible = true;
            }
        } else {
            this.setMode('panel', 'empty');
        }
    }
    constructor(parent?: Section, content?: SectionContent) {
        super('div', {
            className: 'section'
        });
        if (parent) {
            this.parent = parent;
            this.parent.contentWrap.append(this);
        }
        this.build();
        this.fill(content as unknown as Parameters<Section["fill"]>[0]);

    }

    private build() {
        this.contentWrap = this.child('div', { className: 'section_content' });
        this.child('div', {
            className: 'section_outline'
        });
        this.dragger = this.child('span', {
            className: 'section_dragger'
        });
        this.dragger.child('div', {
            className: 'section_dragger_collapse'
        });


        this.domElement.addEventListener('mousemove', this.resize.bind(this));
        this.dragger.domElement.addEventListener('mousedown', () => this.dragging = true);
        this.dragger.domElement.addEventListener('mouseup', () => this.dragging = false);
        this.domElement.addEventListener('mouseup', () => this.dragging = false);

        this.panelSwitch = this.append(glob.panels.getSelectObject()) as Select;
        this.panelSwitch.onChange = (v) => {
            this.setMode('panel', v);
        };
    }
    private resize(e: MouseEvent) {
        if (this.dragging) {
            let v;
            if (this.direction === 'v') {
                v = (e.y - this.domElement.offsetTop) / this.domElement.offsetHeight * 100;
            } else {
                v = (e.x - this.domElement.offsetLeft) / this.domElement.offsetWidth * 100;
            }
            if (v !== 0) this.percentage = Util.clamp(v, 0, 100);
        }
    }

}