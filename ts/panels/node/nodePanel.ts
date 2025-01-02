import { Icon, IconProperties } from '../../lib/dom/icon';
import { v2 } from '../../lib/utilities/vector2';
import { CameraPanel } from '../cameraPanel';

export class NodeEditorPanel extends CameraPanel {
    public icon: IconProperties = Icon.make('linked_services');
    constructor() {
        super('node', 'Node', v2(2000,1000));
    }
}