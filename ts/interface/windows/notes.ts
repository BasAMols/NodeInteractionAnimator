import { DomElement } from '../../lib/dom/domElement';
import { WindowPanel } from './window';

export class NotesPanel extends WindowPanel {
    private area: DomElement<"textarea">;
    private text: string;
    constructor() {
        super('notes', 'Notes');
        this.area = this.content.child('textarea')
        this.area.domElement.addEventListener('change', (v)=>{
            this.text = this.area.domElement.textContent;
        })
    }
    public resize(): void {
        super.resize();
    }
}