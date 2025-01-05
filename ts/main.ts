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
import { ViewerPanel } from './panels/graphic/viewerPanel';




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
            new ViewerPanel(),
            new NodeEditorPanel(),
            new OutlinerPanel(),
            new PropertiesPanel(),
            new TimelinePanel(),
            new LibraryPanel([
                ['Images', [{
                    image: new Icon({ name: 'image' }),
                    name: 'Image',
                    key: 'image',
                    content: [
                        {
                            name: 'Image',
                            visual: {
                                position: v2(0, 0),
                                asset: {
                                    visualType: 'image',
                                    size: v2(50, 50),

                                }
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
                            visual: {
                                position: v2(0, 0),
                                asset: {
                                    visualType: 'image',
                                    size: v2(505, 545),

                                }
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
                            name: 'top left',
                            visual: {
                                position: v2(10, 35),
                                asset: {
                                    visualType: 'image',
                                    size: v2(240, 240),
                                }
                            }
                        },
                        {
                            name: 'top right',
                            visual: {
                                position: v2(255, 35),
                                asset: {
                                    visualType: 'image',
                                    size: v2(240, 240),
                                }
                            }
                        },
                        {
                            name: 'bottom left',
                            visual: {
                                position: v2(10, 280),
                                asset: {
                                    visualType: 'image',
                                    size: v2(240, 240),

                                }
                            }
                        },
                        {
                            name: 'bottom right',
                            visual: {
                                position: v2(255, 280),
                                asset: {
                                    visualType: 'image',
                                    size: v2(240, 240),
                                }
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
                data: [1, 'h', 15, [2, 'library'], [1, 'h', 80, [2, 'graphic'], [1, 'v', 50, [2, 'outliner'], [2, 'properties']]]]
            },
            grid: {
                name: 'Grid',
                icon: Icon.make('window'),
                data: [1, 'h', 50, [1, 'v', 50, [0], [0]], [1, 'v', 50, [0], [0]]]
            },
        });
        $.scene = new SceneObjectManager({
            graphic: $.panels.getPanel('graphic') as GraphicPanel,
            viewer: $.panels.getPanel('viewer') as ViewerPanel,
            properties: $.panels.getPanel('properties') as PropertiesPanel,
            node: $.panels.getPanel('node') as NodeEditorPanel,
            timeline: $.panels.getPanel('timeline') as TimelinePanel,
            outliner: $.panels.getPanel('outliner') as OutlinerPanel,
        });

        $.workspace.resize();

        $.panels.forEach(([k, p]) => p.build());

        // $.scene.bulk([
        //     {
        //         key: $.unique,
        //         components: [
        //             new SceneObjectComponentVisual({
        //                 key: $.unique,
        //                 position: v2(10, 10),
        //                 asset: {
        //                     visualType: 'image',
        //                     size: v2(100, 100),

        //                 }
        //             })
        //         ]
        //     },
        //     {
        //         key: $.unique,
        //         components: [
        //             new SceneObjectComponentVisual({
        //                 key: $.unique,
        //                 position: v2(0, 405),
        //                 asset: {
        //                     visualType: 'image',
        //                     size: v2(505, 100),

        //                 }
        //             })
        //         ]
        //     }
        // ]
        // );

        setTimeout(() => {
            $.workspace.resize();
            ($.panels.getPanel('graphic') as GraphicPanel).camera.center();
        }, 1);
    }

    public tick() {
    }

}


