import { glob } from '../../game';
import { DomText } from '../dom/domText';

export class Keyboard {

    private keyDown: Record<string, [() => void]> = {};
    private keyUp: Record<string, [() => void]> = {};

    ready() {
        glob.renderer.dom.addEventListener('keydown', (e) => {
            const k = e.key.toLowerCase();
            this.keyDown[k]?.forEach((c) => {
                c();
            });
        });
        glob.renderer.dom.addEventListener('keyup', (e) => {
            const k = e.key.toLowerCase();
            this.keyUp[k]?.forEach((c) => {
                c();
            });
        });
    }

    register(key: string, down: () => void, up: () => void) {
        const k = key.toLowerCase();

        if (this.keyDown[k]) this.keyDown[k].push(down);
        else this.keyDown[k] = [down];

        if (this.keyUp[k]) this.keyUp[k].push(up);
        else this.keyUp[k] = [up];
    }
}

export class InputDevices {
    public keyboard: Keyboard = new Keyboard();
    private overlay: DomText;
    private _locked: boolean;
    mobile: boolean;
    public get locked(): boolean {
        return this._locked;
    }
    public set locked(value: boolean) {
        this._locked = value;
        this.overlay.dom.style.display = !value ? 'block' : 'none';
    }
    constructor() {
        this.overlay = new DomText({
            text: 'Pauzed',
        });
        this.overlay.dom.setAttribute('style', `
            transform-origin: left bottom;
            pointer-events: none;
            bottom: 0px;
            left: 0px;
            user-select: none;
            z-index: 999;
            position: absolute;
            height: 100vh;
            width: 100vw;
            color: white !important;
            font-family: monospace;
            font-weight: bold;
            font-size: 40px;
            padding-left: 50px;
            padding-top: 20px;
            box-sizing: border-box;
            text-transform: uppercase;`
        );
    }

    ready() {
        window.addEventListener(`contextmenu`, (e) => e.preventDefault());

        this.mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (this.mobile) {
            //mobile
            this.locked = true;

        } else {
            glob.level.interface.touchControls.style.display = 'none';
            glob.renderer.dom.addEventListener('click', (e) => {
                if (!this.locked) {
                    glob.renderer.dom.requestPointerLock();
                }
            });

            document.addEventListener('pointerlockchange', () => {
                this.locked = (document.pointerLockElement === glob.renderer.dom);
            });
            document.body.appendChild(this.overlay.dom);

        }
        this.keyboard.ready();
    }
}
