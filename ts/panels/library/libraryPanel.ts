import { Panel } from '../../interface/panel';
import { IconProperties, Icon } from '../../lib/dom/icon';
import { LibraryItem, LibraryItemAttr } from './libraryItem';

export class LibraryPanel extends Panel {
    public icon: IconProperties = Icon.make('video_library');

    constructor(list: LibraryItemAttr[] = []) {
        super('library', 'Library');
        list.forEach((l)=>{
            this.addItem(l)
        })

    }

    addItem(l: LibraryItemAttr) {
        this.content.append(new LibraryItem(l))
    }
}