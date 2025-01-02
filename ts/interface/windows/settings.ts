import { WindowPanel } from './window';

export class SettingsPanel extends WindowPanel {
    constructor() {
        super('settings', 'Settings');
    }
    public resize(): void {
        super.resize();
    }
}