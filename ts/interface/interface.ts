import { DomElement } from '../dom/domElement';
import { Section } from './section';

export class Interface extends DomElement<'div'>{
    private mainSection = new Section();
    public constructor() {
        super('div', {
            className: 'content'
        });
        this.append(this.mainSection)
    }

    public build() {
        this.setPreset();
    }

    public setPreset() {
        this.mainSection.empty();
        const [t, b] = this.mainSection.setMode('split', 'v', 50);
        const [tl, tr] = t.setMode('split', 'h', 70);
        const [trt, trb] = tr.setMode('split', 'v', 50);

        b.setMode('panel', 'timeline')
        tl.setMode('panel', 'main')
        trt.setMode('panel', 'outliner')
        trb.setMode('panel', 'properties')
    }
}