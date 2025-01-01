import { Button } from '../lib/dom/button';
import { DomElement } from '../lib/dom/domElement';
import { Icon } from '../lib/dom/icon';
import { Menu } from './menu';
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

        window.addEventListener('resize', ()=>{
            this.resize();
        })
        this.resize();

    }
    public resize() {
        this.mainSection.resize();
    }
    private buildToolbar(presets?: Record<string, WorkspacePreset>) {


        const p = { empty: { name: 'Empty', data: [0] } };
        if (presets) Object.assign(p, presets);

        this.header = this.child('header', {
            id: 'toolbar',
        });
        this.header.append(new Menu([
            {
                key: 'file',
                name: 'File',
                type: 'Panel',
                design: 'inline',
                data: [[
                    { key: 'new', name: 'New', icon: Icon.make('library_add'), onClick: () => { } },
                    { key: 'open', name: 'Open...', icon: Icon.make('folder_open'), onClick: () => { } },
                    { key: 'recover', name: 'Recover', icon: Icon.make('restore_page'), onClick: () => { } },
                    '',
                    { key: 'save', name: 'Save', icon: Icon.make('save'), onClick: () => { } },
                    { key: 'saveas', name: 'Save As...', onClick: () => { } },
                    { key: 'import', name: 'Import...', icon: Icon.make('file_open'), onClick: () => { } },
                    { key: 'export', name: 'Export', icon: Icon.make('file_export'), onClick: () => { } },
                    '',
                    { key: 'reset', name: 'Reset', icon: Icon.make('reset_image'), onClick: () => { } },
                ]]
            }, {
                key: 'edit',
                name: 'Edit',
                type: 'Panel',
                design: 'inline',
                data: [[
                    { key: 'undo', name: 'Undo', icon: Icon.make('undo'), onClick: () => { } },
                    { key: 'redo', name: 'Redo...', icon: Icon.make('redo'), onClick: () => { } },
                    { key: 'options', name: 'Options...', icon: Icon.make('settings'), onClick: () => { } },
                ]]
            },
            {
                key: 'workspace',
                name: 'Workspace',
                design: 'inline',
                icon: { name: 'dashboard', weight: 200 },
                type: 'Select',
                onChange: (k) => this.setPreset(k),
                data: [Object.entries(p).map(([k, v]) => {
                    return { key: k, name: v.name };
                })]
            }
        ]));

        this.presets = Object.fromEntries(Object.entries(p).map(([k, v]) => {
            return [k,
                {
                    ...v,
                } as WorkspacePresetStorage
            ];
        }));
    }

    public setPreset(n: string) {
        if (!this.presets[n]) return;
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
