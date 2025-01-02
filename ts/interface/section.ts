import { DomElement } from '../lib/dom/domElement';
import { Util } from '../lib/utilities/utils';
import { Panel } from './panel';
import { Menu, MenuS } from './menu';

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
    resizerKey: string;
    resizer: DomElement<"span">;
    static getEmpty(): sectionContentEmpty {
        return {
            type: 'empty',
        };
    }
    static getPanel(n: string): sectionContentPanel {
        return {
            type: 'panel',
            panel: $.panels.getPanel(n)
        };
    }
    static getSplit(c: [SectionContent, SectionContent], d: 'v' | 'h' = 'h', p: number = 50): sectionContentSplit {
        return {
            type: 'split',
            direction: d,
            sections: c,
            percentage: p,
        };
    }
    protected parent: Section | undefined;
    public contentWrap: DomElement<"div">;
    protected mode: 'split' | 'panel';
    private panelSwitch: MenuS;
    protected panel: Panel | undefined;
    protected sections: [Section, Section] | undefined;
    private _direction: 'v' | 'h' | undefined;
    private sectionMenu: Menu;
    protected get direction(): 'v' | 'h' | undefined {
        return this._direction;
    }
    protected set direction(value: 'v' | 'h' | undefined) {
        this._direction = value;
        this.class(false, 'v' , 'h');
        this.class(true, this.direction)
        $.mouse.able(this.resizerKey, true, value === 'h'?'col-resize':'row-resize')
    }

    private _percentage: number | undefined;
    protected get percentage(): number | undefined {
        return this._percentage;
    }
    protected set percentage(value: number | undefined) {
        this._percentage = Util.clamp(value, 5, 95);
        if (this.sections) {
            this.sections[0].setStyle(this.direction === 'h' ? 'width' : 'height', `calc(${this._percentage}% - 3px)`);
            this.sections[1].setStyle(this.direction === 'h' ? 'width' : 'height', `calc(${100 - this._percentage}% - 3px)`);
            this.sections[0].setStyle(this.direction === 'h' ? 'height' : 'width', `100%`);
            this.sections[1].setStyle(this.direction === 'h' ? 'height' : 'width', `100%`);

            this.resizer.setStyle('left', this.direction === 'h' ? `calc(${this._percentage}% - 3px)` : '4px');
            this.resizer.setStyle('top', this.direction === 'v' ? `calc(${this._percentage}% - 3px)` : '4px');
        }
        this.resize();
    }

    public resize() {
        if (this.mode === 'panel' && this.panel) this.panel.resize();
        if (this.mode === 'split') this.sections?.forEach((s) => s.resize());
    }

    public get activePanel() {
        return this.panel;
    }

    public setPanel(panel: string | undefined | Panel = 'empty'): Panel {
        this.fill({
            type: 'panel',
            panel: panel instanceof Panel ? panel : $.panels.getPanel(panel)
        });
        return this.panel;
    }
    public setSplit(direction: typeof this.direction, percentage: number = 50, data?: [SectionContent, SectionContent]) {
        this.fill({
            type: 'split',
            sections: data ? data : [
                Section.getEmpty(),
                Section.getEmpty()
            ],
            percentage,
            direction
        });
        return this.sections;
    }

    public removePanel() {
        if (this.panel) {
            this.contentWrap.remove(this.panel);
            this.panel = undefined;
            this.class(true, 'empty')
        }
        this.panelSwitch.silentValue('empty');
    }

    public empty(del: boolean = false) {
        $.panels.unassign(this);
        this.removePanel();
        this.direction = undefined;
        this.sections?.forEach((s) => s.empty(true));
        this.sections = undefined;
        this.percentage = undefined;
        this.class(true, 'empty')

        if (del) {
            this.parent?.contentWrap.remove(this);
        }
    }

    public fill(content?: SectionContent): void {
        this.empty();
        if (content && content.type !== 'empty') {
            this.mode = content.type;
            if (content.type === 'panel') {
                this.class(false, 's_split')
                this.class(true, 's_panel')

                this.panel = content.panel;
                $.panels.assign(this.panel, this);
                this.panelSwitch.silentValue(this.panel?.id);

                this.class(!Boolean(this.panel), 'empty')

                this.resizer.visible = false;
            } else {
                this.class(true, 's_split')
                this.class(false, 's_panel')

                this.sections = content.sections.map((d) => new Section(this, d)) as typeof this.sections;
                this.direction = content.direction || (this.parent.direction === 'v' ? 'h' : 'v');
                this.percentage = content.percentage || 50;

                this.resizer.visible = true;
            }
        } else {
            this.setPanel();
        }
        this.resize();
    }
    constructor(parent?: Section, content?: SectionContent) {
        super('div', {
            className: 'section empty'
        });
        if (parent) {
            this.parent = parent;
            this.parent.contentWrap.append(this);
        }
        this.build();
        this.fill(content as unknown as Parameters<Section["fill"]>[0]);

    }

    public getData(): sectionContentPanel | sectionContentSplit {
        if (this.mode === 'panel') {
            return {
                type: 'panel',
                panel: this.panel
            };
        } else {
            return {
                type: 'split',
                sections: this.sections.map((s) => s.getData()) as [sectionContentPanel | sectionContentSplit, sectionContentPanel | sectionContentSplit],
                percentage: this.percentage,
                direction: this.direction
            };


        }
    }

    private build() {
        this.contentWrap = this.child('div', { className: 'section_content' });
        this.child('div', {
            className: 'section_outline'
        });
        this.resizerKey = $.mouse.registerDrag($.unique, {
            element: this.resizer = this.child('span', {
                className: `section_dragger`
            }),
            reference: this,
            cursor: this.direction === 'h'?'col-resize':'row-resize',
            move: (e) => {
                if (this.direction === 'v'){
                    this.percentage = e.factor.y*100;
                }
                if (this.direction === 'h'){
                    this.percentage = e.factor.x*100;
                }
            }
        });

        this.sectionMenu = this.append(new Menu([
            ...$.panels.getSelectObject(
                'panel',
                (v: string) => {
                    this.setPanel(v);
                },
                this.parent ? () => {
                    if (this.parent) {
                        const other = this.parent.sections.find((s) => s !== this);
                        const data = other.getData();
                        if (data.type === 'panel') {
                            this.parent.setPanel(other.panel);
                        } else {
                            this.parent.setSplit(other.direction, other.percentage, (other.getData() as sectionContentSplit)?.sections);
                        }
                    }
                } : undefined,
                () => {
                    this.setSplit('v', 50, [
                        { type: 'panel', panel: this.panel },
                        Section.getEmpty()
                    ]);
                },
                () => {
                    this.setSplit('h', 50, [
                        { type: 'panel', panel: this.panel },
                        Section.getEmpty()
                    ]);
                }
            ),

        ])) as Menu;


        this.panelSwitch = this.sectionMenu.getButton('panel').panel as MenuS;
    }
}