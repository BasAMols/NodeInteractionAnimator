import { WorkSpace } from './interface/interface';
import { PanelManager } from './interface/panelManager';
import { Main } from "./main";

declare global {
  function log(...data: any[]):void;
  var glob: Glob
}
class Glob {
    public main: Main;
    public interface: WorkSpace ;
    public panels: PanelManager;
};
window.glob = new Glob();
window.log = console.log;

document.addEventListener("DOMContentLoaded", async () => {
    const g = new Main();
    document.body.appendChild(glob.interface.domElement);
});