import { Panel } from '../interface/panel';
import { Icon, IconProperties } from '../lib/dom/icon';

export class TimelinePanel extends Panel {

    public icon: IconProperties = Icon.make('timeline');

    constructor() {
        super('timeline', 'Timeline');

        this.menu.addButton({
            key: $.unique,
            type: 'Action',
            design: 'icon',
            icon: Icon.make('skip_previous'),
            onClick: () => {

            },
        });
        this.menu.addButton({
            key: $.unique,
            type: 'Action',
            design: 'icon',
            icon: Icon.make('resume'),
            onClick: () => {

            },
        });
        this.menu.addButton({
            key: $.unique,
            type: 'Action',
            design: 'icon',
            icon: Icon.make('skip_next'),
            onClick: () => {

            },
        });

        this.menu.addButton({
            key: $.unique,
            type: 'Action',
            design: 'icon',
            icon: Icon.make('autoplay'),
            onClick: () => {

            },
        });

    }
}