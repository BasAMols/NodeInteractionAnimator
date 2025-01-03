import { WorkSpace } from './interface/interface';
import { PanelManager } from './interface/panelManager';
import { NodeEditorPanel } from './panels/node/nodePanel';
import { OutlinerPanel } from './panels/outliner';
import { PropertiesPanel } from './panels/properties';
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
import { SceneObjectComponentVisual } from './sceneobjects/components/sceneobjectComponentVisual';
import { SceneObject } from './sceneobjects/sceneobject';
import { LibraryPanel } from './panels/library/libraryPanel';
import { Icon } from './lib/dom/icon';




export class Main {
    public ticker: Ticker;

    public constructor() {
        /*  TODO
        - Global Node Manager
        - Outliner that visualises nodes
        - Visual component in graphic panel
        - Node component in node panel
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
                {
                    image: new Icon({name: 'grid_view'}),
                    name: 'Grid',
                    key: 'grid',
                },
                {
                    image: new Icon({name: 'grid_view'}),
                    name: 'Grid',
                    key: 'grid',
                },
                {
                    image: new Icon({name: 'grid_view'}),
                    name: 'Grid',
                    key: 'grid',
                },
                {
                    image: new Icon({name: 'grid_view'}),
                    name: 'Grid',
                    key: 'grid',
                },
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
                name: 'Default',
                data: [1, 'h', 15, [2, 'library'], [1, 'h', 80, [2, 'graphic'], [1, 'v', 50, [2, 'outliner'], [2, 'properties']]]]
            }
        });
        $.scene = new SceneObjectManager({
            graphic: $.panels.getPanel('graphic') as GraphicPanel,
            properties: $.panels.getPanel('properties') as PropertiesPanel,
            node: $.panels.getPanel('node') as NodeEditorPanel,
            timeline: $.panels.getPanel('timeline') as TimelinePanel,
            outliner: $.panels.getPanel('outliner') as OutlinerPanel,
        });

        $.workspace.resize();
        setTimeout(() => {
            $.workspace.resize();
            $.panels.forEach(([k, p]) => p.build());

            $.scene.add(new SceneObject({
                key: $.unique,
                components: [
                    new SceneObjectComponentVisual({
                        key: $.unique,
                        position: v2(10, 10),
                        asset: {
                            visualType: 'image',
                            size: v2(100, 100),

                        }
                    })
                ]
            }));
            $.scene.add(new SceneObject({
                key: $.unique,
                components: [
                    new SceneObjectComponentVisual({
                        key: $.unique,
                        position: v2(0, 405),
                        asset: {
                            visualType: 'image',
                            size: v2(505, 100),

                        }
                    })
                ]
            }));

        }, 20);
    }

    public tick() {
    }

}


