import { WorkSpace } from './interface/interface';
import { PanelManager } from './interface/panelManager';
import { MainPanel } from './panels/main';
import { NodeEditorPanel } from './panels/node';
import { OutlinerPanel } from './panels/outliner';
import { PropertiesPanel } from './panels/properties';
import { TimelinePanel } from './panels/timeline';
import { Ticker } from './lib/utilities/ticker';




export class Main {
    public ticker: Ticker;

    public constructor() {
        glob.main = this;
        glob.panels = new PanelManager([
            new MainPanel(),
            new NodeEditorPanel(),
            new OutlinerPanel(),
            new PropertiesPanel(),
            new TimelinePanel(),
        ])
        glob.interface = new WorkSpace({
            default: {
                name: 'Default',
                data: [1, 'v', 50, [1, 'h', 70, [2, 'main'], [1, 'v', 50, [2, 'outliner'], [2, 'properties']]], [2, 'timeline']]
            }
        })
        this.build();
    }

    private build() {
    }

    public tick() {
    }

}


