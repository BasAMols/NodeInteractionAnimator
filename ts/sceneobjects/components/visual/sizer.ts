import { DomElement } from '../../../lib/dom/domElement';
import { Icon } from '../../../lib/dom/icon';
import { Vector2 } from '../../../lib/utilities/vector2';
import { GraphicPanel } from '../../../panels/graphic/graphicPanel';

export class Sizer extends DomElement<'div'> {
    public constructor({ graphic, reference, onChange, direction = 'd' }: { graphic: GraphicPanel; reference: DomElement; onChange: (v: Vector2) => void; direction?: 'x' | 'y' | 'd'; }) {
        super('div', {
            className: 'sizer ui'
        });

        $.mouse.registerDrag($.unique, {
            element: this,
            cursor: { x: 'w-resize', y: 'n-resize', d: 'nw-resize' }[direction],
            reference,
            initialTolerance: 20,
            move: (e) => {
                if (e.e.ctrlKey && e.e.shiftKey) {
                    onChange(e.relative.scale(1 / (graphic.camera.scale)).scale(0.04).floor().scale(25));
                } else if (e.e.ctrlKey) {
                    onChange(e.relative.scale(1 / (graphic.camera.scale)).scale(0.1).floor().scale(10));
                } else if (e.e.shiftKey) {
                    onChange(e.relative.scale(1 / (graphic.camera.scale)).scale(0.2).floor().scale(5));
                } else {
                    onChange(e.relative.scale(1 / (graphic.camera.scale)).floor());
                }
            }
        });
        this.append(new Icon({ name: { y: 'fit_page_height', x: 'fit_page_width', d: 'aspect_ratio' }[direction] }));


    }
}