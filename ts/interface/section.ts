import { DomElement } from '../dom/domElement';
import { Select } from '../dom/select';
import { glob } from '../main';
import { Util } from '../utilities/utils';
import { Panel } from './panel';

export class Section extends DomElement<'div'> {
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
        this.dragger.setStyleProperty('pointerEvents', value ? 'none' : 'auto');
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
            this.sections[0].setStyleProperty(this.direction === 'h' ? 'width' : 'height', `calc(${this._percentage}% - 3px)`);
            this.sections[1].setStyleProperty(this.direction === 'h' ? 'width' : 'height', `calc(${100 - this._percentage}% - 3px)`);
            this.sections[0].setStyleProperty(this.direction === 'h' ? 'height' : 'width', `100%`);
            this.sections[1].setStyleProperty(this.direction === 'h' ? 'height' : 'width', `100%`);

            this.dragger.setStyleProperty('left', this.direction === 'h' ? `calc(${this._percentage}% - 3px)` : '4px');
            this.dragger.setStyleProperty('top', this.direction === 'v' ? `calc(${this._percentage}% - 3px)` : '4px');
        }
    }

    public get activePanel() {
        return this.panel;
    }

    public setMode(m: 'panel', a: string | undefined): Panel;
    public setMode(m: 'split', a: typeof this.direction, b: number): [Section, Section];
    public setMode(m: typeof this.mode, a: string | undefined | typeof this.direction, b?: number): [Section, Section] | Panel {
        const oldPanel = this.panel;
        this.empty();
        this.mode = m;

        if (this.mode === 'panel') {
            this.domElement.classList.remove('s_split');
            this.domElement.classList.add('s_panel');

            this.panel = glob.panels.getPanel(a);
            glob.panels.assign(this.panel, this);

            this.panelSwitch.value(this.panel?.id);
            this.dragger.visible = false;
            return this.panel;
        } else {
            this.domElement.classList.remove('s_panel');
            this.domElement.classList.add('s_split');

            this.sections = [
                new Section(this),
                new Section(this)
            ];
            this.sections[0].setMode('panel', oldPanel?.name);
            this.direction = a as typeof this.direction;
            this.percentage = b;
            this.dragger.visible = true;
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
            this.parent?.remove(this);
        }
    }

    constructor(parent?: Section) {
        super('div', {
            className: 'section'
        });
        if (parent) {
            this.parent = parent;
            this.parent.contentWrap.append(this);
        }
        this.build();
        this.setMode('panel', undefined);
    }

    private build() {
        this.contentWrap = this.append(new DomElement('div', { className: 'section_content' }));
        this.append(new DomElement('div', {
            className: 'section_outline'
        })) as Select;
        this.dragger = this.append(new DomElement('span', {
            className: 'section_dragger'
        }));
        this.dragger.append(new DomElement('div', {
            className: 'section_dragger_collapse'
        }));


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