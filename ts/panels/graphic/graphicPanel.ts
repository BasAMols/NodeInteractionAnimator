import { Panel } from '../../interface/panel';
import { Camera } from '../utils/camera';

export class GraphicPanel extends Panel {
    camera: Camera;
    constructor() {
        super('graphic', 'Graphic');
        this.camera = this.content.append(new Camera(this, [505,545], false)) as Camera;
    }
    public resize(): void {
        super.resize();
        this.camera?.resize();
    }
}