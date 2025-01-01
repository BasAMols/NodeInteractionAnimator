import { WindowPanel } from './window';

export class Settings extends WindowPanel {
    constructor() {
        super('settings', 'Settings');
    }
    public resize(): void {
        super.resize();
    }
}