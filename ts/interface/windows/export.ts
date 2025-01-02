import { WindowPanel } from './window';

export class ExportPanel extends WindowPanel {
    constructor() {
        super('export', 'Export');
    }
    public resize(): void {
        super.resize();
    }
}