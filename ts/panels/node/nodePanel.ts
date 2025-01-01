import { Panel } from '../../interface/panel';
import { Camera } from '../utils/camera';

export class NodeEditorPanel extends Panel {
    camera: Camera;
    constructor() {
        super('node', 'Node');
        this.camera = this.content.append(new Camera(this, [500,500])) as Camera;
    }
    public resize(): void {
        super.resize();
        this.camera?.resize();
    }
}