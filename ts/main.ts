import { WorkSpace } from './interface/interface';
import { PanelManager } from './interface/panelManager';
import { NodeEditorPanel } from './panels/node/nodePanel';
import { OutlinerPanel } from './panels/outliner';
import { PropertiesPanel } from './panels/properties';
import { TimelinePanel } from './panels/timeline';
import { Ticker } from './lib/utilities/ticker';
import { GraphicPanel } from './panels/graphic/graphicPanel';
import { WindowManager } from './interface/windows/windowManager';
import { Settings } from './interface/windows/settings';
import { DragManager } from './interface/dragging/dragManager';
import { Notes } from './interface/windows/notes';




export class Main {
    public ticker: Ticker;

    public constructor() {
        $.main = this;
        $.drag = new DragManager();
        $.panels = new PanelManager([
            new GraphicPanel(),
            new NodeEditorPanel(),
            new OutlinerPanel(),
            new PropertiesPanel(),
            new TimelinePanel(),
        ])
        $.windows = new WindowManager([
            new Settings(),
            new Notes(),
        ])
        $.workspace = new WorkSpace({
            default: {
                name: 'Default',
                data: [1, 'v', 80, [1, 'h', 70, [2, 'graphic'], [1, 'v', 50, [2, 'outliner'], [2, 'properties']]], [2, 'timeline']]
            }
        })
        $.workspace.resize();
        setTimeout(()=>{
            $.workspace.resize();
        }, 20)
    }

    public tick() {
    }

}


