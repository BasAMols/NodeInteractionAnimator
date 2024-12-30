import { Interface } from './interface/interface';
import { MainPanel } from './interface/panels/main';
import { NodeEditorPanel } from './interface/panels/node';
import { OutlinerPanel } from './interface/panels/outliner';
import { PanelManager } from './interface/panels/panelManager';
import { PropertiesPanel } from './interface/panels/properties';
import { TimelinePanel } from './interface/panels/timeline';
import { Ticker } from './utilities/ticker';

export class Glob {
    public main: Main;
    public interface: Interface ;
    public panels: PanelManager;
};
export var glob = new Glob;

export class Main {
    public ticker: Ticker;
    public glob: Glob;

    public constructor() {
        this.glob = glob
        glob.main = this;
        glob.panels = new PanelManager([
            new MainPanel(),
            new NodeEditorPanel(),
            new OutlinerPanel(),
            new PropertiesPanel(),
            new TimelinePanel(),
        ])
        glob.interface = new Interface()
        this.build();
    }

    private build() {
        glob.interface.build();
    }

    public tick() {
    }

}


