import { DomElement } from '../../../lib/dom/domElement';
import { Icon } from '../../../lib/dom/icon';
import { v2, Vector2 } from '../../../lib/utilities/vector2';
import { GraphicPanel } from '../../../panels/graphic/graphicPanel';

export class Mover extends DomElement<'div'> {
    public constructor(graphic: GraphicPanel, onChange: (v: Vector2) => void, shape: 'square'|'circle' = 'square') {
        super('div', {
            className: `mover editorUi ui ${shape}`
        });

        $.mouse.registerDrag($.unique, {
            element: this,
            cursor: 'move',
            reference: graphic.graphic,
            initialTolerance: 20,
            move: (e) => {
                if (e.e.ctrlKey && e.e.shiftKey) {
                    onChange(e.relative.add(e.offset).scale((1 / graphic.camera.scale)).scale(0.04).floor().scale(25).subtract(v2(-10)));
                } else if (e.e.ctrlKey) {
                    onChange(e.relative.add(e.offset).scale((1 / graphic.camera.scale)).scale(0.1).floor().scale(10).subtract(v2(-10)));
                } else if (e.e.shiftKey) {
                    onChange(e.relative.add(e.offset).scale((1 / graphic.camera.scale)).scale(0.2).floor().scale(5).subtract(v2(-10)));
                } else {
                    onChange(e.relative.add(e.offset).scale((1 / graphic.camera.scale)).floor().subtract(v2(-10)));
                }
            }
        });
        this.append(new Icon({ name: 'drag_pan' }));


    }
}