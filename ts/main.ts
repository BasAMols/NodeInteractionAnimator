import { WorkSpace } from './interface/interface';
import { PanelManager } from './interface/panelManager';
import { NodeEditorPanel } from './panels/node/nodePanel';
import { OutlinerPanel } from './panels/outliner';
import { PropertiesPanel } from './panels/properties/propertiesPanel';
import { TimelinePanel } from './panels/timeline';
import { Ticker } from './lib/utilities/ticker';
import { GraphicPanel } from './panels/graphic/graphicPanel';
import { WindowManager } from './interface/windows/windowManager';
import { SettingsPanel } from './interface/windows/settings';
import { DragManager } from './interface/dragging/dragManager';
import { NotesPanel } from './interface/windows/notes';
import { ImportPanel } from './interface/windows/import';
import { ExportPanel } from './interface/windows/export';
import { SceneObjectManager } from './sceneobjects/sceneobjectManager';
import { v2 } from './lib/utilities/vector2';
import { LibraryPanel } from './panels/library/libraryPanel';
import { Icon } from './lib/dom/icon';




export class Main {
    public ticker: Ticker;

    public constructor() {
        /*  TODO
        - Timeline for specific animation nodes
        - Properties panel that shows options for each node. 
        */

        $.main = this;
        $.mouse = new DragManager();
        $.panels = new PanelManager([
            new GraphicPanel(),
            new NodeEditorPanel(),
            new OutlinerPanel(),
            new PropertiesPanel(),
            new TimelinePanel(),
            new LibraryPanel([
                ['Elements', [{
                    image: new Icon({ name: 'text_fields' }),
                    name: 'Text',
                    key: 'text',
                    content: [
                        {
                            name: 'Text',
                            type: 'text',
                            data: {
                                text: 'text',
                                width: 50,
                                position: v2(10, 10),
                            }
                        },
                    ]
                }, {
                    image: new Icon({ name: 'image' }),
                    name: 'Image',
                    key: 'image',
                    content: [
                        {
                            name: 'Image',
                            type: 'image',
                            data: {
                                position: v2(0, 0),
                                size: v2(100, 100),
                            }
                        },
                    ]
                },
                {
                    image: new Icon({ name: 'fullscreen' }),
                    name: 'Fullscreen',
                    key: 'fullscreen',
                    content: [
                        {
                            name: 'Fullscreen image',
                            type: 'image',
                            data: {
                                position: v2(0, 0),
                                backgroundSize: 'cover',
                                size: v2(505, 545),
                            }
                        },
                    ]
                },
                {
                    image: new Icon({ name: 'fullscreen' }),
                    name: 'Callout',
                    key: 'callout',
                    content: [
                        {
                            name: 'Callout',
                            type: 'callout',
                            data: {
                                position: v2(30, 30),
                                position2: v2(450, 400),
                                size: 300,
                                size2: 30,
                            }
                        },
                    ]
                }]],
                ['Templates', [{
                    image: new Icon({ name: 'grid_view' }),
                    name: 'Grid (2x2)',
                    key: 'template1',
                    content: [
                        {
                            name: 'Top left',
                            type: 'image',
                            data: {
                                position: v2(10, 35),
                                size: v2(240, 240),
                            }
                        },
                        {
                            name: 'Top right',
                            type: 'image',
                            data: {
                                position: v2(255, 35),
                                size: v2(240, 240),
                            }
                        },
                        {
                            name: 'Bottom left',
                            type: 'image',
                            data: {
                                position: v2(10, 280),
                                size: v2(240, 240),
                            }
                        },
                        {
                            name: 'Bottom right',
                            type: 'image',
                            data: {
                                position: v2(255, 280),
                                size: v2(240, 240),
                            }
                        }
                    ]
                }]]
            ]),
        ]);
        $.windows = new WindowManager([
            new SettingsPanel(),
            new NotesPanel(),
            new ImportPanel(),
            new ExportPanel(),
        ]);
        $.workspace = new WorkSpace({
            default: {
                name: 'Builder',
                icon: Icon.make('space_dashboard'),
                data: [1, 'h', 15, [2, 'library'], [1, 'h', 70, [2, 'graphic'], [1, 'v', 50, [2, 'outliner'], [2, 'properties']]]]
            },
            grid: {
                name: 'Grid',
                icon: Icon.make('window'),
                data: [1, 'h', 50, [1, 'v', 50, [0], [0]], [1, 'v', 50, [0], [0]]]
            },
        });
        $.scene = new SceneObjectManager({
            graphic: $.panels.getPanel('graphic') as GraphicPanel,
            properties: $.panels.getPanel('properties') as PropertiesPanel,
            node: $.panels.getPanel('node') as NodeEditorPanel,
            timeline: $.panels.getPanel('timeline') as TimelinePanel,
            outliner: $.panels.getPanel('outliner') as OutlinerPanel,
        });

        $.workspace.resize();

        $.panels.forEach(([k, p]) => p.build());


        setTimeout(() => {
            $.workspace.resize();
            ($.panels.getPanel('graphic') as GraphicPanel).camera.center();
        }, 1);
    }

    public tick() {
    }

}


