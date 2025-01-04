import { Button } from '../lib/dom/button';
import { DomElement } from '../lib/dom/domElement';
import { Icon, IconProperties } from '../lib/dom/icon';
import { v2 } from '../lib/utilities/vector2';
import { Menu } from './menu';
import { Section, SectionContent } from './section';

export type WorkspacePresetEmpty = [0];
export type WorkspacePresetSplit = [1, 'v' | 'h', number, WorkspacePresetData?, WorkspacePresetData?];
export type WorkspacePresetPanel = [2, string];
export type WorkspacePresetData = WorkspacePresetEmpty | WorkspacePresetSplit | WorkspacePresetPanel;

export interface WorkspacePreset {
    name: string,
    data: WorkspacePresetData;
    icon?: IconProperties
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

        this.append($.windows);
        this.append($.mouse);

        this.buildToolbar(presets);

        this.mainSection = this.append(new Section()) as Section;
        this.setPreset(presets ? Object.keys(presets)[0] : 'empty');

        window.addEventListener('resize', () => {
            this.resize();
        });
        this.resize();

    }
    public resize() {
        $.windowSize = v2(window.innerWidth, window.innerHeight);
        $.windows.resize();
        this.mainSection.resize();
    }
    private buildToolbar(presets?: Record<string, WorkspacePreset>) {

        const p:Record<string, WorkspacePreset> = { empty: { name: 'Empty', data: [0], icon: Icon.make('grid_off') } };
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
                icon: { name: 'draft', weight: 200 },
                data: [[
                    { key: 'new', name: 'New', icon: Icon.make('library_add'), onClick: () => { } },
                    { key: 'open', name: 'Open...', icon: Icon.make('folder_open'), onClick: () => { } },
                    { key: 'recover', name: 'Recover', icon: Icon.make('restore_page'), onClick: () => { } },
                    '',
                    { key: 'save', name: 'Save', icon: Icon.make('save'), onClick: () => { } },
                    { key: 'saveas', name: 'Save As...', onClick: () => { } },
                    { key: 'import', name: 'Import...', icon: Icon.make('file_open'), onClick: () => {$.windows.open('import'); } },
                    { key: 'export', name: 'Export', icon: Icon.make('file_export'), onClick: () => {$.windows.open('export'); } },
                    '',
                    { key: 'reset', name: 'Reset', icon: Icon.make('reset_image'), onClick: () => {
                        if (window.confirm('This will refresh the page. Are you sure?')) window.location = window.location
                    } },
                ]]
            }, {
                key: 'edit',
                name: 'Edit',
                type: 'Panel',
                design: 'inline',
                icon: { name: 'edit_square', weight: 200 },
                data: [[
                    { key: 'undo', name: 'Undo', icon: Icon.make('undo'), onClick: () => { } },
                    { key: 'redo', name: 'Redo...', icon: Icon.make('redo'), onClick: () => { } },
                    {
                        key: 'empty', name: 'Empty scene', onClick: () => {
                            $.scene.clear();
                        }
                    },
                    '',
                    {
                        key: 'options', name: 'Options...', icon: Icon.make('settings'), onClick: () => {
                            $.windows.open('settings');
                        }
                    },
                ]]
            },
            {
                key: 'workspace',
                name: 'Layout',
                design: 'inline',
                icon: { name: 'dashboard', weight: 200 },
                type: 'Panel',
                data: [Object.entries(p).map(([k, v]) => {
                    return { key: k, icon:v.icon, name: v.name, onClick: ()=>{this.setPreset(k)}};
                })]
            },
            {
                key: 'tools',
                name: 'Tools',
                design: 'inline',
                icon: { name: 'construction', weight: 200 },
                type: 'Panel',
                data: [[
                    {
                        key: 'notes', name: 'Notes', icon: Icon.make('notes'), onClick: () => {
                            $.windows.open('notes');
                        }
                    },
                ]]
            },
            {
                key: 'select',
                name: 'Selected',
                design: 'inline',
                className:'menuSelect',
                icon: { name: 'ink_selection', weight: 200 },
                type: 'Panel',
                data: [[
                    {
                        key: 'des', name: 'Deselect', icon: Icon.make('remove_selection'), onClick: () => {
                            $.scene.focus()
                        }
                    },
                    {
                        key: 'del', name: 'Delete', icon: Icon.make('delete'), onClick: () => {
                            $.scene.remove($.scene.selected)
                        }
                    },
                ]]
            },
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
