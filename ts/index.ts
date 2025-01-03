import { DragManager } from './interface/dragging/dragManager';
import { WorkSpace } from './interface/interface';
import { PanelManager } from './interface/panelManager';
import { WindowManager } from './interface/windows/windowManager';
import { Vector2 } from './lib/utilities/vector2';
import { Main } from "./main";
import { SceneObjectManager } from './sceneobjects/sceneobjectManager';

declare global {
  var $: Glob;
}
class Glob {
  public main: Main;
  public workspace: WorkSpace;
  public panels: PanelManager;
  public windows: WindowManager;
  public windowSize: Vector2;
  public mouse: DragManager;
  public scene: SceneObjectManager;
  public get unique(): string {
    this.uniqueIndex++;
    return (this.uniqueIndex + 10000).toString(16);
  }
  public state = new (class state {
    private list: string[] = [];
    set(n: string) {
      if (!this.list.includes(n)) { 
        this.list.push(n); 
        document.body.classList.add(`state_${n}`)
      }
    }
    unset(n: string) {
      if (this.list.includes(n)) {
        this.list.splice(this.list.indexOf(n), 1); 
        document.body.classList.remove(`state_${n}`)
      }
    }
    check(n: string) {
      return this.list.includes(n);
    }

  })();
  private uniqueIndex: number = 0;
};
window.$ = new Glob();

document.addEventListener("DOMContentLoaded", async () => {
  const g = new Main();
  document.body.appendChild($.workspace.domElement);
});