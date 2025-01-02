import { DomElement } from '../../lib/dom/domElement';
import { DragReturnType } from './dragManager';

export class Resizer extends DomElement<'span'> {
    constructor(public readonly key: string = $.unique, private data: {
        reference: DomElement<any>;
        cursor?: string;
        callBack: (n: DragReturnType) => void;
    }) {
        super('span', {
            className: `section_dragger`
        });

        $.drag.register(this.key, {
            element: this,
            reference: this.data.reference,
            cursor: this.data.cursor,
            move: (e) => {
                this.data.callBack(e);
            }
        });
    }

    public setCursor(d: string) {
        $.drag.able(this.key, true, d)
    }

    // this.domElement.addEventListener('mousemove', (e: MouseEvent) => {
    //     if (this.dragging) {
    //         let v = this.direction === 'v' ?
    //             (e.y - this.domElement.getBoundingClientRect().y) / this.domElement.offsetHeight * 100 :
    //             (e.x - this.domElement.getBoundingClientRect().x) / this.domElement.offsetWidth * 100;

    //         if (v !== 0) this.percentage = Util.clamp(v, 0, 100);
    //     }
    // });
    // this.dragger.domElement.addEventListener('mousedown', () => this.dragging = true);
    // this.dragger.domElement.addEventListener('mouseup', () => this.dragging = false);
    // this.domElement.addEventListener('mouseup', () => this.dragging = false);
}