import { Icon, IconProperties } from '../../lib/dom/icon';
import { v2 } from '../../lib/utilities/vector2';
import { CameraPanel } from '../cameraPanel';

export class NodeEditorPanel extends CameraPanel {
    public icon: IconProperties = Icon.make('linked_services');
    constructor() {
        super('node', 'Node', {
            camera: {contentSize: v2(505, 545), minZoom: 0.1, maxZoom: 5, scrollSpeed: 2}
        });
    }
}