import { WorkSpace } from './interface/interface';
import { PanelManager } from './interface/panelManager';
import { WindowManager } from './interface/windows/windowManager';
import { Main } from "./main";

declare global {
  function log(...data: any[]):void;
  var $: Glob
}
class Glob {
    public main: Main;
    public workspace: WorkSpace ;
    public panels: PanelManager;
    public windows: WindowManager;
    public windowSize: [number,number];
};
window.$ = new Glob();
window.log = console.log;

document.addEventListener("DOMContentLoaded", async () => {
    const g = new Main();
    document.body.appendChild($.workspace.domElement);
});