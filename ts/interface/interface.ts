import { Button } from '../dom/button';
import { DomElement } from '../dom/domElement';
import { Section, SectionContent } from './section';

export type WorkspacePresetEmpty = [0];
export type WorkspacePresetSplit = [1, 'v' | 'h', number, WorkspacePresetData?, WorkspacePresetData?];
export type WorkspacePresetPanel = [2, string];
export type WorkspacePresetData = WorkspacePresetEmpty | WorkspacePresetSplit | WorkspacePresetPanel;

export interface WorkspacePreset {
    name: string,
    data: WorkspacePresetData;
}
export type WorkspacePresetStorage = WorkspacePreset & {
    button: Button,
};

export class WorkSpace extends DomElement<'div'> {
    private mainSection: Section;
    private presets: Record<string, {
        button: Button,
        name: string,
        data: WorkspacePresetData;
    }>;
    header: DomElement<"header">;
    public constructor(presets?: Record<string, WorkspacePreset>) {
        super('div', {
            className: 'content'
        });

        this.buildToolbar(presets);

        this.mainSection = this.append(new Section()) as Section;
        this.setPreset(presets ? Object.keys(presets)[0] : 'empty');
    }
    private buildToolbar(presets?: Record<string, WorkspacePreset>) {
        const p = { empty: { name: 'Empty', data: [0] } };
        if (presets) Object.assign(p, presets);

        this.header = this.child('header', {
            id: 'toolbar',
        });

        this.presets = Object.fromEntries(Object.entries(p).map(([k, v]) => {
            return [k,
                {
                    ...v,
                    button: this.header.append(new Button({
                        text: v.name,
                        onClick: () => this.setPreset(k),
                        icon: { name: 'dashboard', weight: 200 }
                    })) as Button
                } as WorkspacePresetStorage
            ]
        }));
    }

    public setPreset(n: string) {
        if (!this.presets[n]) return
        this.mainSection.fill(this.presetMap(this.presets[n].data));
    }
    private presetMap(d: WorkspacePresetData): SectionContent {
        if (!d) return Section.getEmpty();

        return [
            Section.getEmpty(),
            Section.getSplit(
                [this.presetMap(d[3]) || Section.getEmpty(), this.presetMap(d[4]) || Section.getEmpty()],
                d[1] as 'v' | 'h',
                d[2]
            ),
            Section.getPanel(
                d[1]
            )][d[0]];
    }
}
