import { InputDevices } from './utilities/input/inputDevices';
import { Ticker } from './utilities/ticker';

export var glob = new class {
    public game: Game;
    public device: InputDevices = new InputDevices();
};

export class Game {
    public ticker: Ticker;

    public constructor() {
        glob.game = this;
        this.build();
        glob.device.ready();
    }

    private build() {

    }

    public tick() {
    }

}


