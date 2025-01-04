import { Panel } from '../../interface/panel';
import { DomElement } from '../../lib/dom/domElement';
import { IconProperties, Icon } from '../../lib/dom/icon';
import { LibraryItem, LibraryItemAttr } from './libraryItem';

export class LibraryPanel extends Panel {
    public icon: IconProperties = Icon.make('video_library');

    constructor(list: [string, LibraryItemAttr[]][] = []) {
        super('library', 'Library');
        list.forEach((l) => {
            this.addCategories(l);
        });

    }

    addCategories([k, items]:[string, LibraryItemAttr[]] ) {
        const w = this.content.child('div', {className: 'library_category'});
        w.child('div', {className: 'library_category_name', text: k});
        items.forEach((l) => {
            this.addItem(w,l);
        });
    }

    addItem(parent: DomElement, l: LibraryItemAttr) {
        parent.append(new LibraryItem(l));
    }
}