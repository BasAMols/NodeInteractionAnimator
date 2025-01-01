import { WorkSpace } from './interface/interface';
import { PanelManager } from './interface/panelManager';
import { NodeEditorPanel } from './panels/node/nodePanel';
import { OutlinerPanel } from './panels/outliner';
import { PropertiesPanel } from './panels/properties';
import { TimelinePanel } from './panels/timeline';
import { Ticker } from './lib/utilities/ticker';
import { GraphicPanel } from './panels/graphic/graphicPanel';




export class Main {
    public ticker: Ticker;

    public constructor() {
        $.main = this;
        $.panels = new PanelManager([
            new GraphicPanel(),
            new NodeEditorPanel(),
            new OutlinerPanel(),
            new PropertiesPanel(),
            new TimelinePanel(),
        ])
        $.workspace = new WorkSpace({
            default: {
                name: 'Default',
                data: [1, 'v', 50, [1, 'h', 70, [2, 'graphic'], [1, 'v', 50, [2, 'outliner'], [2, 'properties']]], [2, 'node']]
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


